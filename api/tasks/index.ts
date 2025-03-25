import supabase from "@/utils/supabase-db";

export type SortType = {
  field: "created_at" | "title" | "priority";
  order: "asc" | "desc";
};

export type FilterType = {
  field: "category" | "priority" | "created_at";
  operator: "gte" | "lte" | "in";
  value: string[] | string;
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

  filters.forEach((filter) => {
    const { field, operator, value } = filter;

    if (operator === "in") {
      query = query.in(field, value as string[]);
    } else if (operator === "gte") {
      query = query.gte(field, value);
    } else if (operator === "lte") {
      query = query.lte(field, value);
    }
  });

  if (search) {
    query = query.ilike("title", `%${search}%`);
    query = query.ilike("tracking_id", `%${search}%`);
  }

  query = query.order(sort.field, { ascending: sort.order === "asc" });

  const { data, count, error } = await query;

  return { data, count, error };
};
