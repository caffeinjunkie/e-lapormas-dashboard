import {
  ChartPieIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { DashboardIcon } from "@/components/icons";
import { IconSvgProps } from "@/types/icon.types";

export type SiteConfig = typeof siteConfig;

const iconClassname = "h-6 w-6";

const sidebarTheme = {
  primary: "#1a1c1e",
  secondary: "#FF9F29",
  text: "#ffffff",
};

const sidebarMenuItems = [
  {
    label: "navbar-dashboard-label",
    href: "/",
    Icon: (props: IconSvgProps) => (
      <DashboardIcon {...props} height={25} width={25} />
    ),
  },
  {
    label: "navbar-reports-label",
    href: "/reports?status=PENDING&page=1",
    Icon: (props: IconSvgProps) => (
      <DocumentTextIcon className={iconClassname} {...props} />
    ),
  },
  {
    label: "navbar-statistics-label",
    href: "/statistics",
    Icon: (props: IconSvgProps) => (
      <ChartPieIcon className={iconClassname} {...props} />
    ),
  },
  // {
  //   label: "navbar-announcements-label",
  //   href: "/announcements",
  //   Icon: (props: IconSvgProps) => (
  //     <MegaphoneIcon className={iconClassname} {...props} />
  //   ),
  // },
  {
    label: "navbar-admin-management-label",
    href: "/admin-management",
    Icon: (props: IconSvgProps) => (
      <UsersIcon className={iconClassname} {...props} />
    ),
  },
];

const additionalMenuItems = [
  {
    label: "navbar-settings-label",
    href: "/settings",
  },
  {
    label: "navbar-logout-label",
    href: "/logout",
  },
];

export const privatePaths = [...sidebarMenuItems, additionalMenuItems[0]].map(
  (item) => item.href,
);

export const siteConfig = {
  name: "LaporID Dashboard",
  description: "Dashboard Pelaporan Elektronik",
  backgroundImageSrcs: [
    "https://chnpxcvhzxlwdaqhbhqp.supabase.co/storage/v1/object/sign/photos/Firefly%20generate%20image%20on%20indonesian%20landscape%200%20(3).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvRmlyZWZseSBnZW5lcmF0ZSBpbWFnZSBvbiBpbmRvbmVzaWFuIGxhbmRzY2FwZSAwICgzKS5qcGciLCJpYXQiOjE3NDE2MjgxMDUsImV4cCI6MTgwNDcwMDEwNX0.JMEF7P6GMMmLwABZ5Yzqh4weGX6TB7w6Fbbhd_G0330",
  ],
  sidebarTheme,
  menuItems: sidebarMenuItems,
  settingsItems: additionalMenuItems,
};
