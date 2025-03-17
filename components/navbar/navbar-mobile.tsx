import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { useTranslations } from "next-intl";
import { PropsWithChildren, useState } from "react";

import { adminManagementItem, siteConfig } from "@/config/site";

interface MobileNavbarProps {
  isSuperAdmin: boolean;
  onLogout: () => void;
}

export const MobileNavbar: React.FC<PropsWithChildren<MobileNavbarProps>> = ({
  isSuperAdmin,
  onLogout,
  children,
}) => {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const mobileMenu = [
    ...siteConfig.menuItems,
    ...(isSuperAdmin ? [adminManagementItem] : []),
    ...siteConfig.settingsItems,
  ];

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
              <Link
                color={
                  index === mobileMenu.length - 1 ? "danger" : "foreground"
                }
                href={item.href === "/logout" ? "#" : item.href}
                size="lg"
                onClick={() => {
                  if (item.href === "/logout") {
                    onLogout();
                    return;
                  }
                  setIsOpen(false);
                }}
              >
                {t(item.label)}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
