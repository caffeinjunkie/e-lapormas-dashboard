import { createClient } from "@/utils/supabase/client";

export const fetchUserData = async () => {
  const client = createClient();

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return { data };
};

export const resetPassword = async (email: string) => {
  const client = createClient();

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/create-password`,
  });

  if (error) {
    throw error;
  }

  return { success: true };
};

export const updatePassword = async (password: string) => {
  const client = createClient();

  const { error } = await client.auth.updateUser({ password });

  if (error) {
    throw error;
  }

  return { success: true };
};
