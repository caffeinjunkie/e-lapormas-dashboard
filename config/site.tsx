import {
  ChartBarSquareIcon,
  RectangleGroupIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

export type SiteConfig = typeof siteConfig;

const iconClassname = "h-6 w-6";

export const siteConfig = {
  name: "E-Lapor Dashboard",
  description: "Dashboard E-Lapor Mas.",
  menuItems: [
    {
      label: "Ikhtisar",
      href: "/",
      icon: <RectangleGroupIcon className={iconClassname} />,
    },
    {
      label: "Laporan",
      href: "/reports",
      icon: <DocumentTextIcon className={iconClassname} />,
    },
    {
      label: "Statistik",
      href: "/statistics",
      icon: <ChartBarSquareIcon className={iconClassname} />,
    },
    {
      label: "Pengumuman",
      href: "/announcements",
      icon: <MegaphoneIcon className={iconClassname} />,
    },
  ],
  settingsItems: [
    {
      label: "Pengaturan",
      href: "/settings",
      icon: <Cog6ToothIcon className={iconClassname} />,
    },
    {
      label: "Keluar",
      href: "/logout",
      icon: <ArrowLeftStartOnRectangleIcon className={iconClassname} />,
    },
  ],
};
