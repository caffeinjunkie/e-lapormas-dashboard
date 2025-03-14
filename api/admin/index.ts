import supabase from "@/utils/supabase-db";

export const fetchAdmins = async (offset = 0, limit = 10) => {
  const { data: admins, error } = await supabase
    .from("admins")
    .select("*")
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return admins;
};
