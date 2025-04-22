import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Skeleton } from "@heroui/skeleton";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { PropsWithChildren, useState } from "react";

import { UserAva } from "../user-ava";

import { siteConfig } from "@/config/site";
import { ProfileData } from "@/types/user.types";

interface SidebarProps {
  openModal: (href: string) => void;
  onNavigate: (href: string) => void;
  shouldShowConfirmation: boolean;
  pathname: string;
  user?: ProfileData | null;
  isLoaded?: boolean;
}

const ProfileSkeleton = () => (
  <div className="max-w-[300px] w-full flex items-center gap-3">
    <div>
      <Skeleton className="flex rounded-full w-11 h-11 animate-pulse" />
    </div>
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="h-3 w-3/5 rounded-lg animate-pulse" />
      <Skeleton className="h-2 w-4/5 rounded-lg animate-pulse" />
    </div>
  </div>
);

export const Sidebar: React.FC<PropsWithChildren<SidebarProps>> = ({
  pathname,
  user,
  onNavigate,
  shouldShowConfirmation,
  openModal,
  isLoaded,
  children,
}) => {
  const t = useTranslations("Navbar");
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    if (path.includes("/reports")) {
      return pathname.includes("/reports");
    }
    return pathname.includes(path);
  };

  const [isOpen, setIsOpen] = useState(false);
  const { sidebarTheme, menuItems, settingsItems } = siteConfig;
  const sidebarItems = [...menuItems];

  const activeIndex = sidebarItems.findIndex((item) => isActive(item.href));

  return (
    <div
      className="hidden md:flex flex-col w-full fixed bottom-0 top-0"
      style={{
        backgroundColor: sidebarTheme.primary,
      }}
    >
      <div className="fixed bottom-0 top-0 gap-4 w-[274px] flex flex-col justify-between overflow-y-scroll no-scrollbar">
        <div className="flex flex-col gap-16">
          <div className="flex items-center justify-start text-base font-semibold text-gray-200">
            {children}
          </div>
          <div className="relative">
            <div
              className={`${activeIndex === -1 ? "hidden" : "flex"} h-14 items-center absolute left-0 transition-all duration-300 ease-in-out`}
              style={{
                top: `${activeIndex !== 0 ? activeIndex * 3.5 : 0}rem`,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.3 * (activeIndex + 1),
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="w-1 py-4 rounded-r-lg"
                style={{
                  backgroundColor: sidebarTheme.secondary,
                }}
              />
            </div>
            <nav className="flex flex-col">
              {sidebarItems.map(({ href, label, Icon }, index) => (
                <NextLink
                  key={href}
                  className="flex w-full space-x-2 text-sm py-3 font-semibold group"
                  color="foreground"
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (href === pathname) {
                      return;
                    }
                    shouldShowConfirmation ? openModal(href) : onNavigate(href);
                  }}
                >
                  <motion.div
                    initial={{ x: -500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3 * (index + 1),
                      ease: "easeInOut",
                    }}
                    style={{
                      color: sidebarTheme.text,
                    }}
                    className={clsx(
                      "flex items-center gap-2 py-1 pl-10 transition-colors duration-300 ease-in-out",
                      isActive(href)
                        ? "opacity-100"
                        : "opacity-50 group-hover:opacity-70",
                    )}
                  >
                    <div>
                      <Icon
                        color={
                          isActive(href)
                            ? sidebarTheme.secondary
                            : sidebarTheme.text
                        }
                      />
                    </div>
                    <p>{t(label)}</p>
                  </motion.div>
                </NextLink>
              ))}
            </nav>
          </div>
        </div>
        <div className="py-6 px-6">
          <div
            className="py-2 px-2 rounded-full flex flex-row items-center justify-between gap-2 transition-all duration-500 ease-in-out"
            style={{
              backgroundColor: `${sidebarTheme.text}10`,
              outline:
                pathname === "/settings"
                  ? `1px solid ${sidebarTheme.secondary}bb`
                  : "1px solid transparent",
              boxShadow:
                pathname === "/settings"
                  ? `0 0 8px 1px ${sidebarTheme.secondary}cc`
                  : "0 0 0 1px transparent",
            }}
          >
            {isLoaded && user ? (
              <>
                <UserAva
                  imageSrc={user?.imageSrc}
                  theme={{
                    name: sidebarTheme.text,
                  }}
                  displayName={user?.fullName}
                  description={user?.email}
                  classNames={{
                    container: "contents",
                    name: "font-semibold",
                    description: "text-gray-400",
                  }}
                />
                <Popover
                  placement="right"
                  isOpen={isOpen}
                  onOpenChange={() => setIsOpen(!isOpen)}
                >
                  <PopoverTrigger>
                    <Button
                      variant="light"
                      size="sm"
                      radius="full"
                      isIconOnly
                      aria-label="Other"
                    >
                      <EllipsisHorizontalIcon
                        className="size-5"
                        color={sidebarTheme.text}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Listbox
                      aria-label="Actions"
                      onAction={(key) => {
                        if (key === pathname) {
                          setIsOpen(false);
                          return;
                        }
                        if (key === "/logout") {
                          openModal(key);
                        } else {
                          shouldShowConfirmation
                            ? openModal(key as string)
                            : onNavigate(key as string);
                        }
                        setIsOpen(false);
                      }}
                    >
                      {settingsItems.map((item, index) => (
                        <ListboxItem
                          key={item.href}
                          className={`${index === settingsItems.length - 1 ? "text-danger" : ""}`}
                        >
                          {t(item.label)}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <ProfileSkeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
