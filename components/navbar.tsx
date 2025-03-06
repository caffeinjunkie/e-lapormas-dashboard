"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import clsx from "clsx";
import { link as linkStyles } from "@heroui/theme";

import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
// import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { sidebarTheme } from "@/config/colors";

export const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const mobileMenu = [...siteConfig.menuItems, ...siteConfig.settingsItems];

  const icon = (
    <NextLink className="flex justify-start items-center gap-1" href="/">
      <Logo />
      <p className="font-bold text-inherit">ACME</p>
    </NextLink>
  );

  return (
    <>
      <HeroUINavbar maxWidth="xl" position="sticky" className="flex sm:hidden">
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="start">
          <NavbarMenuToggle />
          {icon}
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
      <div
        className={`hidden sm:flex flex-col gap-4 w-96 h-full`}
        style={{
          backgroundColor: sidebarTheme.sidebarBackground,
        }}
      >
        <div className="flex items-center justify-center py-6 text-md font-semibold text-gray-200">
          {icon}
        </div>

        <nav className="flex flex-col gap-2">
          {siteConfig.menuItems.map((item) => (
            <NextLink
              key={item.href}
              className="flex w-full space-x-2 text-sm py-3 font-medium"
              color="foreground"
              href={item.href}
            >
              <div
                className="w-1 h-full rounded-r-lg transition-colors duration-300 ease-in-out"
                style={{
                  backgroundColor: isActive(item.href)
                    ? sidebarTheme.linkIndicator
                    : sidebarTheme.sidebarBackground,
                }}
              />
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
    </>
  );
};
