import { PropsWithChildren, useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";

interface MobileNavbarProps {
  onLogout: () => void;
}

export const MobileNavbar: React.FC<PropsWithChildren<MobileNavbarProps>> = ({
  onLogout,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const mobileMenu = [...siteConfig.menuItems, ...siteConfig.settingsItems];

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isOpen}
      onMenuOpenChange={toggleMenu}
      className="flex sm:hidden"
    >
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="start">
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
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
