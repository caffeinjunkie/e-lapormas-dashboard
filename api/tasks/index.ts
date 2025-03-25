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
  searchQuery?: string;
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
    searchQuery = "",
    offset = 0,
    limit = 10,
  } = options;

  let query = supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1)
    .eq("status", status)
    .or(`title.ilike.%${searchQuery}%, tracking_id.ilike.%${searchQuery}%`);

  filters.forEach((filter) => {
    const { field, operator, value } = filter;

    switch (operator) {
      case "in":
        query = query.in(field, value as string[]);
        break;
      case "gte":
        query = query.gte(field, value);
        break;
      case "lte":
        query = query.lte(field, value);
        break;
    }
  });

  query = query.order(sort.field, { ascending: sort.order === "asc" });

  const { data, count, error } = await query;

  return { data, count, error };
};
