export const columns = [
  { name: "NAME", uid: "display_name", width: 120, align: "start" },
  { name: "SUPER ADMIN", uid: "is_super_admin", width: 80, align: "center" },
  { name: "STATUS", uid: "is_verified", width: 100, align: "center" },
  { name: "ACTIONS", uid: "actions", width: 40, align: "center" },
];

export const statusOptions = [
  { translationKey: "status-all", uid: "all" },
  { translationKey: "status-verified", uid: "verified" },
  {
    translationKey: "status-pending",
    uid: "pending",
  },
];

export const footerClassNames = `
flex w-full justify-center pt-4 md:pt-2 pb-4 bg-white absolute md:sticky bottom-0 z-10 shadow-[rgba(5,5,5,0.1)_0_-1px_1px_0px] md:shadow-none
`;

export const headerClassNames = `absolute md:sticky w-full top-16 md:top-0 z-10 md:pt-6 pb-2 md:pb-4 mb-4 md:mb-1 bg-white px-6 shadow-sm md:shadow-none`;
