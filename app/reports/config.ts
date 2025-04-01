export const columns = [
  { name: "REPORT", uid: "report", width: 140, align: "start" },
  { name: "CATEGORY", uid: "category", width: 90, align: "start" },
  { name: "LOCATION", uid: "location", width: 100, align: "start" },
  { name: "CREATED DATE", uid: "created_at", width: 70, align: "start" },
  { name: "PRIORITY", uid: "priority", width: 65, align: "center" },
  { name: "ACTIONS", uid: "actions", width: 50, align: "center" },
];

export const categoryOptions = [
  { labelKey: "category-kebijakan-publik", id: "kebijakan-publik" },
  { labelKey: "category-kondisi-jalan", id: "kondisi-jalan" },
  { labelKey: "category-fasilitas-umum", id: "fasilitas-umum" },
  { labelKey: "category-makanan-bergizi", id: "makanan-bergizi" },
  { labelKey: "category-program-pemerintah", id: "program-pemerintah" },
  { labelKey: "category-keamanan", id: "keamanan" },
  { labelKey: "category-pungli", id: "pungli" },
  { labelKey: "category-lainnya", id: "lainnya" },
];

export const priorityOptions = [
  { labelKey: "priority-critical", id: "critical" },
  { labelKey: "priority-high", id: "high" },
  { labelKey: "priority-mid", id: "mid" },
  { labelKey: "priority-low", id: "low" },
];

export const sortOptions = [
  { labelKey: "sort-newest", id: "newest" },
  { labelKey: "sort-oldest", id: "oldest" },
  { labelKey: "sort-higher-priority", id: "higher-priority" },
  { labelKey: "sort-lower-priority", id: "lower-priority" },
  { labelKey: "sort-z-to-a", id: "z-to-a" },
  { labelKey: "sort-a-to-z", id: "a-to-z" },
];

export enum SortLabel {
  A_TO_Z = "sort-a-to-z",
  Z_TO_A = "sort-z-to-a",
  NEWEST = "sort-newest",
  OLDEST = "sort-oldest",
  HIGHER_PRIORITY = "sort-higher-priority",
  LOWER_PRIORITY = "sort-lower-priority",
}

export enum StatusEnum {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum PriorityLabel {
  CRITICAL = "priority-critical",
  HIGH = "priority-high",
  MID = "priority-mid",
  LOW = "priority-low",
}

export enum StatusLabel {
  PENDING = "status-pending",
  IN_PROGRESS = "status-in-progress",
  COMPLETED = "status-completed",
}

export enum PriorityChipColor {
  CRITICAL = "danger",
  HIGH = "warning",
  MID = "default",
  LOW = "secondary",
}

export enum StatusChipColor {
  PENDING = "default",
  IN_PROGRESS = "warning",
  COMPLETED = "success",
}

export const swrConfig = {
  dedupingInterval: 60000,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
