import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { PropsWithChildren, useState } from "react";

import { siteConfig } from "@/config/site";

interface MobileNavbarProps {
  onNavigate: (href: string) => void;
  openModal: (href: string) => void;
  shouldShowConfirmation: boolean;
  pathname: string;
}

export const MobileNavbar: React.FC<PropsWithChildren<MobileNavbarProps>> = ({
  openModal,
  onNavigate,
  shouldShowConfirmation,
  pathname,
  children,
}) => {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const mobileMenu = [...siteConfig.menuItems, ...siteConfig.settingsItems];

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isOpen}
      onMenuOpenChange={toggleMenu}
      className="flex md:hidden"
    >
      <NavbarContent className="md:hidden basis-1 pl-4" justify="start">
        <NavbarMenuToggle />
        {children}
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {mobileMenu.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={index === mobileMenu.length - 1 ? "text-danger" : ""}
                href={item.href === "/logout" ? "#" : item.href}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (item.href === pathname) {
                    setIsOpen(false);
                    return;
                  }
                  if (item.href === "/logout") {
                    openModal(item.href);
                    setIsOpen(false);
                    return;
                  } else {
                    shouldShowConfirmation
                      ? openModal(item.href)
                      : onNavigate(item.href);
                  }
                  setIsOpen(false);
                }}
              >
                {t(item.label)}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
