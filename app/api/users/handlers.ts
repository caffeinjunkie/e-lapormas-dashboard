import { SupabaseClient } from "@supabase/supabase-js";

export const fetchUserData = async (client: SupabaseClient) => {
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};
