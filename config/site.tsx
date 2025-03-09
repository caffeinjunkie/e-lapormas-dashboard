import {
  ChartBarSquareIcon,
  RectangleGroupIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { DashboardIcon } from "@/components/icons";
import { IconSvgProps } from "@/types";

export type SiteConfig = typeof siteConfig;

const iconClassname = "h-6 w-6";

export const siteConfig = {
  name: "E-Lapor Dashboard",
  description: "Dashboard E-Lapor Mas.",
  menuItems: [
    {
      label: "Ikhtisar",
      href: "/",
      Icon: (props: IconSvgProps) => (
        <DashboardIcon {...props} height={25} width={25} />
      ),
    },
    {
      label: "Laporan",
      href: "/reports",
      Icon: (props: IconSvgProps) => (
        <DocumentTextIcon className={iconClassname} {...props} />
      ),
    },
    {
      label: "Statistik",
      href: "/statistics",
      Icon: (props: IconSvgProps) => (
        <ChartBarSquareIcon className={iconClassname} {...props} />
      ),
    },
    {
      label: "Pengumuman",
      href: "/announcements",
      Icon: (props: IconSvgProps) => (
        <MegaphoneIcon className={iconClassname} {...props} />
      ),
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
