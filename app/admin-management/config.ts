export const columns = [
  { name: "NAME", uid: "display_name", width: 120, align: "start" },
  { name: "SUPER ADMIN", uid: "is_super_admin", width: 80, align: "center" },
  { name: "STATUS", uid: "is_verified", width: 100, align: "center" },
  { name: "ACTIONS", uid: "actions", width: 40, align: "center" },
];

export const statusOptions = [
  { labelKey: "status-all", id: "all" },
  { labelKey: "status-verified", id: "verified" },
  {
    labelKey: "status-pending",
    id: "pending",
  },
];
