import supabase from "@/utils/supabase-db";

interface FetchTasksOptions {
  filters?: {
    field: "status" | "priority" | "created_at";
    operator: "eq" | "lte" | "gte";
    value: string;
  }[];
  search?: string;
  sort?: {
    field: "created_at" | "title";
    order: "asc" | "desc";
  };
  offset?: number;
  limit?: number;
}

export const fetchTasks = async (options: FetchTasksOptions) => {
  const {
    filters = [],
    sort = {
      field: "created_at",
      order: "desc",
    },
    search = "",
    offset = 0,
    limit = 10,
  } = options;

  //   const { data, error, count } = await supabase
  //     .from("tasks")
  //     .select("*", { count: "exact" })
  //     .order(sort.field, { ascending: sort.order === "asc" })
  //     .range(offset, offset + limit - 1);
  let query = supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

  filters.forEach((filter) => {
    const { field, operator, value } = filter;

    switch (operator) {
      case "eq":
        query = query.eq(field, value);
        break;
      case "lte":
        query = query.lte(field, value);
        break;
      case "gte":
        query = query.gte(field, value);
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  });

  if (search) {
    query = query.ilike("title", `%${search}%`);
    query = query.ilike("tracking_id", `%${search}%`);
  }

  query = query.order(sort.field, { ascending: sort.order === "asc" });

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, count };
};
