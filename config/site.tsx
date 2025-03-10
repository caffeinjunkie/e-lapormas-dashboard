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

const sidebarTheme = {
  sidebarBackground: "#1a1c1e",
  linkText: "#ffffff",
  linkIndicator: "#ffffff",
};

export const siteConfig = {
  name: "E-Lapor Dashboard",
  description: "Dashboard Pelaporan Elektronik",
  organizationName: "Bandung Barat",
  logoSrc:
    "https://chnpxcvhzxlwdaqhbhqp.supabase.co/storage/v1/object/sign/photos/openart-image_1g1deKbR_1741562295689_raw-removebg-preview.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3Mvb3BlbmFydC1pbWFnZV8xZzFkZUtiUl8xNzQxNTYyMjk1Njg5X3Jhdy1yZW1vdmViZy1wcmV2aWV3LnBuZyIsImlhdCI6MTc0MTU2MjM5NywiZXhwIjoxODA0NjM0Mzk3fQ.0QOgUolCbwL2WQkmypEXGuuSX0HEuzZDPX8eCCADxPo",
  backgroundImageSrcs: [
    "https://chnpxcvhzxlwdaqhbhqp.supabase.co/storage/v1/object/sign/photos/Firefly%20generate%20image%20on%20indonesian%20landscape%200%20(3).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvRmlyZWZseSBnZW5lcmF0ZSBpbWFnZSBvbiBpbmRvbmVzaWFuIGxhbmRzY2FwZSAwICgzKS5qcGciLCJpYXQiOjE3NDE2MjgxMDUsImV4cCI6MTgwNDcwMDEwNX0.JMEF7P6GMMmLwABZ5Yzqh4weGX6TB7w6Fbbhd_G0330",
  ],
  sidebarTheme,
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
