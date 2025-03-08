import { PropsWithChildren } from "react";
import NextLink from "next/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Skeleton } from "@heroui/skeleton";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { siteConfig } from "@/config/site";
import { sidebarTheme } from "@/config/colors";
import { ProfileData } from "@/app/types/user";

interface SidebarProps {
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
  pathname,
  user,
  onLogout,
  isLoaded,
  children,
}) => {
  const isActive = (path: string) => pathname === path;

  const activeIndex = siteConfig.menuItems.findIndex(
    (item) => item.href === pathname,
  );

  return (
    <div
      className="hidden sm:flex flex-col fixed bottom-2 top-2 gap-4 w-72 justify-between rounded-2xl"
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
            {siteConfig.menuItems.map((item) => (
              <NextLink
                key={item.href}
                className="flex w-full space-x-2 text-sm py-3 font-medium"
                color="foreground"
                href={item.href}
              >
                <div
                  style={{
                    color: sidebarTheme.linkText,
                  }}
                  className={`flex items-center gap-2 py-1 px-8 transition-colors duration-300 ease-in-out ${isActive(item.href) ? "opacity-100" : "opacity-50 hover:opacity-70"}`}
                >
                  {item.icon}
                  {item.label}
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
              <Avatar
                className="size-11"
                showFallback
                name={user?.fullName}
                src=""
              />
              <div className="flex-1 flex-col overflow-hidden whitespace-nowrap">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <Popover placement="right">
                <PopoverTrigger>
                  <Button
                    variant="light"
                    size="sm"
                    radius="full"
                    isIconOnly
                    aria-label="Setting"
                  >
                    <EllipsisHorizontalIcon className="size-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Listbox
                    aria-label="Actions"
                    onAction={(key) => {
                      if (key === "/logout") {
                        onLogout();
                      }
                    }}
                  >
                    {siteConfig.settingsItems.map((item, index) => (
                      <ListboxItem
                        key={item.href}
                        className={`${index === siteConfig.settingsItems.length - 1 ? "text-danger" : ""}`}
                      >
                        {item.label}
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
