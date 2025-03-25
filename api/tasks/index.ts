import supabase from "@/utils/supabase-db";

export type SortType = {
  field: "created_at" | "title" | "priority";
  order: "asc" | "desc";
};

export type FilterType = {
  field: "category" | "priority";
  value: string[];
};

export type FilterByDate = {
  field: "created_at";
  operator: "gte" | "lte";
  value: string;
};

interface FetchTasksOptions {
  filters?: FilterType[];
  status?: string;
  search?: string;
  sort?: SortType;
  offset?: number;
  limit?: number;
}

export const fetchTasks = async (options: FetchTasksOptions) => {
  const {
    filters = [],
    status = "PENDING",
    sort = {
      field: "created_at",
      order: "desc",
    },
    search = "",
    offset = 0,
    limit = 10,
  } = options;

  let query = supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1)
    .eq("status", status);
  // .filter("progress", "contained by", { updated_by: "John Doe" })

  // .in("status", ["PENDING", "IN_PROGRESS"])
  // .in("category", ["keamanan", "lainnya"])
  // .gte("created_at", "2025-02-10 10:50:00+00")
  // .lte("created_at", "2025-04-10 10:50:00+00");

  filters.forEach((filter) => {
    const { field, value } = filter;

    query = query.in(field, value);
  });

  if (search) {
    query = query.ilike("title", `%${search}%`);
    query = query.ilike("tracking_id", `%${search}%`);
  }

  query = query.order(sort.field, { ascending: sort.order === "asc" });

  const { data, count, error } = await query;

  return { data, count, error };
};
