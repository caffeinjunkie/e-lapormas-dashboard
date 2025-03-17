import supabase from "@/utils/supabase-db";
import { AdminData } from "@/types/user.types";

export const fetchIsAdminASuperAdmin = async (id: string) => {
  const { data, error } = await supabase
    .from("admins")
    .select("is_super_admin")
    .eq("user_id", id)
    .single();

  if (error) throw error;
  return { isSuperAdmin: data.is_super_admin };
};

export const fetchAllAdmins = async () => {
  const { data, error, count } = await supabase
    .from("admins")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data, count };
};

export const upsertAdmins = async (data: AdminData[]) => {
  const { data: updatedAdmins, error } = await supabase
    .from("admins")
    .upsert(data)
    .select();

  if (error) throw error;
  return updatedAdmins;
};
