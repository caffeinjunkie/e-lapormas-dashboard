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

export const handleFetchReports = async (options: GetReportsOptions) => {
  // construct search here
  const { data, count } = await fetchTasks(options);
  return { data, count };
};
