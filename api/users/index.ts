import { createClient } from "@/utils/supabase/client";

export const fetchUserData = async () => {
  const client = createClient();

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export const resetPassword = async (email: string) => {
  const client = createClient();

  const result = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/forgot-password`,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
};
