import { fetchTasks } from "@/api/tasks";

interface GetReportsOptions {
  offset?: number;
  limit?: number;
  search?: string;
  status?: string;
  filters?: {
    field: "status" | "priority" | "created_at";
    operator: "eq" | "lte" | "gte";
    value: string;
  }[];
  sort?: {
    field: "created_at" | "title";
    order: "asc" | "desc";
  };
}

export const fetchReports = async (
  offset: number = 0,
  limit: number = 8,
  status: string = "PENDING",
) => {
  const { data, count, error } = await fetchTasks({
    offset,
    limit,
    status,
  });
  return { reports: data, count, error };
};
