import supabase from "@/utils/supabase-db";

interface FetchTasksOptions {
  filters?: {
    field: "status" | "priority" | "created_at";
    operator: "eq" | "lte" | "gte";
    value: string;
  }[];
  status?: string;
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
    .eq("status", status)
  // .filter("progress", "contained by", { updated_by: "John Doe" })

  // .in("status", ["PENDING", "IN_PROGRESS"])
  // .in("category", ["keamanan", "lainnya"])
  // .gte("created_at", "2025-02-10 10:50:00+00")
  // .lte("created_at", "2025-04-10 10:50:00+00");

  //   filters.forEach((filter) => {
  //     const { field, operator, value } = filter;

  //     switch (operator) {
  //       case "eq":
  //         query = query.eq(field, value);
  //         break;
  //       case "lte":
  //         query = query.lte(field, value);
  //         break;
  //       case "gte":
  //         query = query.gte(field, value);
  //         break;
  //       default:
  //         throw new Error(`Unsupported operator: ${operator}`);
  //     }
  //   });

  //   if (search) {
  //     query = query.ilike("title", `%${search}%`);
  //     query = query.ilike("tracking_id", `%${search}%`);
  //   }

  query = query.order(sort.field, { ascending: sort.order === "asc" });

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, count };
};
