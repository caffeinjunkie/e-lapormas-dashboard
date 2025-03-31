import { fetchAllAdmins } from "@/api/admin";
import {
  FilterType,
  SortType,
  fetchTaskByTrackingId,
  fetchTasks,
} from "@/api/tasks";

interface GetReportsOptions {
  offset?: number;
  limit?: number;
  search?: string;
  status?: string;
  searchValue?: string;
  filters?: {
    category?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
  };
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
  searchValue = "",
  filters = {},
}: GetReportsOptions) => {
  const sort = getSortValue(sortBy);
  const constructedFilters = Object.entries(filters)
    .map(([field, value]) => {
      if (value) {
        return {
          field,
          value:
            field === "startDate" || field === "endDate"
              ? value
              : value
                  .split(",")
                  .map((v) => (field === "priority" ? v.toUpperCase() : v)),
        };
      }
      return null;
    })
    .filter(Boolean) as FilterType[];

  const { data, count, error } = await fetchTasks({
    offset,
    limit,
    searchValue,
    status,
    sort: sort as SortType,
    filters: constructedFilters as FilterType[],
  });
  return { reports: data, count, error };
};

export const appendParam = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value);
    } else {
      searchParams.delete(key);
    }
  });
  return searchParams.toString();
};

export const fetchReportAndAdmins = async (id: string) => {
  const { data } = await fetchTaskByTrackingId(id);
  const { data: admins } = await fetchAllAdmins();

  return { report: data, admins };
};
