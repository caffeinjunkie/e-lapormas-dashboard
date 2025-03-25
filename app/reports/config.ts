export const columns = [
  { name: "REPORT", uid: "report", width: 140, align: "start" },
  { name: "CATEGORY", uid: "category", width: 90, align: "start" },
  { name: "LOCATION", uid: "location", width: 100, align: "start" },
  { name: "CREATED DATE", uid: "created_at", width: 70, align: "start" },
  { name: "PRIORITY", uid: "priority", width: 65, align: "center" },
  { name: "STATUS", uid: "status", width: 75, align: "center" },
  { name: "ACTIONS", uid: "actions", width: 50, align: "center" },
];

export const statusOptions = [
  { labelKey: "status-pending", id: "pending" },
  { labelKey: "status-in-progress", id: "in_progress" },
  { labelKey: "status-completed", id: "completed" },
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
  { labelKey: "sort-a-to-z", id: "a-to-z" },
  { labelKey: "sort-z-to-a", id: "z-to-a" },
];

export enum SortLabel {
  A_TO_Z = "sort-a-to-z",
  Z_TO_A = "sort-z-to-a",
  NEWEST = "sort-newest",
  OLDEST = "sort-oldest",
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

export enum PriorityColor {
  CRITICAL = "danger",
  HIGH = "warning",
  MID = "primary",
  LOW = "default",
}

export enum StatusColor {
  PENDING = "default",
  IN_PROGRESS = "warning",
  COMPLETED = "success",
}

export const swrConfig = {
  dedupingInterval: 60000,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
