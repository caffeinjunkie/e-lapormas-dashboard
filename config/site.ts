export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "E-Lapor Dashboard",
  description: "Dashboard E-Lapor Mas.",
  menuItems: [
    {
      label: "Ikhtisar",
      href: "/",
    },
    {
      label: "Laporan",
      href: "/reports",
    },
    {
      label: "Statistik",
      href: "/statistics",
    },
    {
      label: "Pengumuman",
      href: "/announcements",
    },
  ],
  settingsItems: [
    {
      label: "Pengaturan",
      href: "/settings",
    },
    {
      label: "Keluar",
      href: "/logout",
    },
  ],
};
