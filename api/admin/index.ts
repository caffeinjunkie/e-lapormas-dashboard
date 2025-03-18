import supabase from "@/utils/supabase-db";

import { AdminData } from "@/types/user.types";

export const fetchAdminById = async (id: string) => {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", id)
    .single();

  if (error) throw error;
  return data;
};

export const fetchAllAdmins = async () => {
  const { data, error, count } = await supabase
    .from("admins")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data, count };
};

export const checkIsUserAlreadyInvited = async (email: string) => {
  const { count } = await supabase
    .from("admins")
    .select("*", { count: "exact", head: true })
    .eq("email", email);

  return !count ? 0 : count > 0;
};

export const upsertAdmins = async (data: AdminData[]) => {
  const { data: updatedAdmins, error } = await supabase
    .from("admins")
    .upsert(data)
    .select();

  if (error) throw error;
  return updatedAdmins;
};

export const updateAdminById = async ({
  user_id,
  ...updatedData
}: AdminData) => {
  const { data, error } = await supabase
    .from("admins")
    .update(updatedData)
    .eq("user_id", user_id as string)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAdminByEmail = async ({
  email,
  ...updatedData
}: AdminData) => {
  const { data, error } = await supabase
    .from("admins")
    .update(updatedData)
    .eq("email", email as string)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createAdmin = async ({
  email,
  user_id,
}: {
  email: string;
  user_id: string;
}) => {
  const { data: insertedAdmin, error } = await supabase
    .from("admins")
    .insert([
      {
        email,
        user_id,
        is_super_admin: false,
        is_verified: false,
        display_name: "",
        profile_img: "",
        rating: 0,
      },
    ])
    .select();

  if (error) throw error;
  return insertedAdmin;
};
