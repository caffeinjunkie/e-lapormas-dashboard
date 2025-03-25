import { FilterType, SortType, fetchTasks } from "@/api/tasks";

interface GetReportsOptions {
  offset?: number;
  limit?: number;
  search?: string;
  status?: string;
  filters?: FilterType[];
  sortBy: string;
}

const getSortValue = (sortBy: string) => {
  switch (sortBy) {
    case "newest":
      return { field: "created_at", order: "desc" };
    case "oldest":
      return { field: "created_at", order: "asc" };
    case "higher-priority":
      return { field: "priority", order: "desc" };
    case "lower-priority":
      return { field: "priority", order: "asc" };
    case "a-to-z":
      return { field: "title", order: "asc" };
    case "z-to-a":
      return { field: "title", order: "desc" };
    default:
      return { field: "created_at", order: "desc" };
  }
};

export const fetchReports = async ({
  offset = 0,
  limit = 8,
  status = "PENDING",
  sortBy,
  filters = [],
}: GetReportsOptions) => {
  const sort = getSortValue(sortBy);
  console.log("tes");

  const { data, count, error } = await fetchTasks({
    offset,
    limit,
    status,
    sort: sort as SortType,
    filters,
  });
  return { reports: data, count, error };
};
