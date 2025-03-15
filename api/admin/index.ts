import supabase from "@/utils/supabase-db";

export const fetchIsAdminASuperAdmin = async (id: string) => {
  const { data, error } = await supabase
    .from("admins")
    .select("is_super_admin")
    .eq("user_id", id)
    .single();

  if (error) throw error;
  return { isSuperAdmin: data.is_super_admin };
};

export const fetchPaginatedAdmins = async (page = 1, limit = 9) => {
  const { data, error, count } = await supabase
    .from("admins")
    .select("*", { count: "exact" })
    .range((page - 1) * limit, (page - 1) * limit + limit - 1);

  if (error) throw error;
  return { data, count };
};
