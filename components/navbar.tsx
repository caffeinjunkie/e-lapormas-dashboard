"use client";

import { useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
} from "@heroui/navbar";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Link } from "@heroui/link";
import { Avatar } from "@heroui/avatar";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
// import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { sidebarTheme } from "@/config/colors";
import { useSupabase } from "@/providers/supabase-provider";
import { logout } from "@/app/api/login/handlers";
import { useRouter } from "next/navigation";

interface MobileNavbarProps {
  onLogout: () => void;
}

interface SidebarProps extends MobileNavbarProps {
  pathname: string;
}

export const Navbar = () => {
  const router = useRouter();
  const [isLogoutConfirmModalOpen, setIsLogoutConfirmModalOpen] =
    useState(false);
  const closeLogoutConfirmModal = () => setIsLogoutConfirmModalOpen(false);
  const openLogoutConfirmModal = () => setIsLogoutConfirmModalOpen(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const supabase = useSupabase();
  const pathname = usePathname();
  const isPublicPage = pathname === "/login" || pathname === "/error";

  const handleLogout = async () => {
    setIsButtonLoading(true);
    try {
      const result = await logout(supabase);
      if (result.success) {
        router.push("/login");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsButtonLoading(false);
      closeLogoutConfirmModal();
    }
  };

  return (
    <>
      {!isPublicPage && <MobileNavbar onLogout={openLogoutConfirmModal} />}
      {!isPublicPage && (
        <div className="px-2 shadow-lg">
          <Sidebar pathname={pathname} onLogout={openLogoutConfirmModal} />
        </div>
      )}
      <Modal
        backdrop="opaque"
        isOpen={isLogoutConfirmModalOpen}
        onClose={closeLogoutConfirmModal}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Apakah anda yakin ingin keluar?
              </ModalHeader>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  isLoading={isButtonLoading}
                  onPress={handleLogout}
                >
                  Ya, keluar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Tidak
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const Icon = () => (
  <NextLink className="flex justify-start items-center gap-1" href="/">
    <Logo />
    <p className="font-bold text-inherit">e-lapormas jakarta</p>
  </NextLink>
);

const MobileNavbar = ({ onLogout }: MobileNavbarProps) => {
  const mobileMenu = [...siteConfig.menuItems, ...siteConfig.settingsItems];
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="flex sm:hidden">
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="start">
        <NavbarMenuToggle />
        <Icon />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {mobileMenu.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === mobileMenu.length - 1 ? "danger" : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

const Sidebar = ({ pathname, onLogout }: SidebarProps) => {
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
          <Icon />
        </div>
        <div className="relative">
          <div
            className="flex h-14 items-center absolute left-0 transition-all duration-300 ease-in-out"
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
          <Avatar
            showFallback
            name="Joko Purwadi"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <div className="flex-1 flex-col overflow-hidden whitespace-nowrap">
            <p className="text-sm font-medium truncate">Joko Purwadi</p>
            <p className="text-xs text-gray-400 truncate">jkoput@gmail.com</p>
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
        </div>
      </div>
    </div>
  );
};
