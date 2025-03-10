import { createClient } from "@/utils/supabase/client";

export const fetchUserData = async () => {
  const client = createClient();

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};
