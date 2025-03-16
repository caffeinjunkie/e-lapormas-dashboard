import { PropsWithChildren } from "react";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Skeleton } from "@heroui/skeleton";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { siteConfig, adminManagementItem } from "@/config/site";
import { ProfileData } from "@/types/user.types";
import { UserAva } from "../user-ava";

interface SidebarProps {
  isSuperAdmin: boolean;
  onLogout: () => void;
  pathname: string;
  user?: ProfileData | null;
  isLoaded?: boolean;
}

const ProfileSkeleton = () => (
  <div className="max-w-[300px] w-full flex items-center gap-3">
    <div>
      <Skeleton className="flex rounded-full w-11 h-11" />
    </div>
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="h-3 w-3/5 rounded-lg" />
      <Skeleton className="h-2 w-4/5 rounded-lg" />
    </div>
  </div>
);

export const Sidebar: React.FC<PropsWithChildren<SidebarProps>> = ({
  isSuperAdmin,
  pathname,
  user,
  onLogout,
  isLoaded,
  children,
}) => {
  const t = useTranslations("Navbar");
  const isActive = (path: string) => pathname === path;
  const { sidebarTheme, menuItems, settingsItems } = siteConfig;
  const sidebarItems = [
    ...menuItems,
    ...(isSuperAdmin ? [adminManagementItem] : []),
  ];

  const activeIndex = sidebarItems.findIndex((item) => item.href === pathname);

  return (
    <div
      className="hidden md:flex flex-col fixed bottom-2 top-2 gap-4 w-72 justify-between rounded-xl shadow-lg"
      style={{
        backgroundColor: sidebarTheme.sidebarBackground,
      }}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-start py-6 px-9 text-md font-semibold text-gray-200">
          {children}
        </div>
        <div className="relative">
          <div
            className={`${activeIndex === -1 ? "hidden" : "flex"} h-14 items-center absolute left-0 transition-all duration-300 ease-in-out`}
            style={{
              top: `${activeIndex !== 0 ? activeIndex * 3.5 : 0}rem`,
            }}
          >
            <div
              className="w-1 py-4 rounded-r-lg"
              style={{
                backgroundColor: sidebarTheme.linkIndicator,
              }}
            />
          </div>
          <nav className="flex flex-col">
            {sidebarItems.map(({ href, label, Icon }) => (
              <NextLink
                key={href}
                className="flex w-full space-x-2 text-sm py-3 font-semibold"
                color="foreground"
                href={href}
              >
                <div
                  style={{
                    color: sidebarTheme.linkText,
                  }}
                  className={`flex items-center gap-2 py-1 px-8 transition-colors duration-300 ease-in-out ${isActive(href) ? "opacity-100" : "opacity-50 hover:opacity-70"}`}
                >
                  <Icon color={sidebarTheme.linkText} />
                  {t(label)}
                </div>
              </NextLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="py-6 px-6">
        <div className="py-2 px-2 bg-white/5 rounded-full flex flex-row items-center justify-between gap-2">
          {isLoaded && user ? (
            <>
              <UserAva
                imageSrc=""
                displayName={user?.fullName}
                description={user?.email}
                classNames={{
                  container: "contents",
                  name: "font-semibold text-white",
                  description: "text-gray-400",
                }}
              />
              <Popover placement="right">
                <PopoverTrigger>
                  <Button
                    variant="light"
                    size="sm"
                    radius="full"
                    isIconOnly
                    aria-label="Other"
                  >
                    <EllipsisHorizontalIcon className="size-5" color="white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Listbox
                    aria-label="Actions"
                    onAction={(key) => {
                      if (key === "/logout") {
                        onLogout();
                      } else {
                        redirect(key as string);
                      }
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
  );
};
