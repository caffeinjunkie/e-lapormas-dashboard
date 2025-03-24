export const columns = [
  { name: "REPORT", uid: "report", width: 140, align: "start" },
  { name: "CATEGORY", uid: "category", width: 90, align: "start" },
  { name: "LOCATION", uid: "location", width: 100, align: "start" },
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
