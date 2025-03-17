import { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase-auth/client";

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

type UpdateAuthUserData = {
  email?: string;
  data?: {
    fullName?: string;
  };
  password?: string;
};

export const updateAuthUser = async (updatedData: UpdateAuthUserData) => {
  const client = createClient();

  const { error } = await client.auth.updateUser(updatedData);

  if (error) {
    throw error;
  }

  return { success: true };
};

export const validateToken = async (type: EmailOtpType, token_hash: string) => {
  const client = createClient();

  const { data, error } = await client.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    throw error;
  }

  return { data };
};

export const deleteAuthUser = async (id: string) => {
  const client = createClient();

  const { error } = await client.auth.admin.deleteUser(id);

  if (error) {
    throw error;
  }

  return { success: true };
};

export const inviteByEmail = async (email: string) => {
  const client = createClient();
  const { error } = await client.auth.admin.inviteUserByEmail(email, {
    data: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/auth/confirm`,
    },
  });

  if (error) {
    throw error;
  }

  return { success: true };
};

export const generateFakeName = async () => {
  const data = await fetch("https://randomuser.me/api/?inc=name&nat=US");
  const { results } = await data.json();

  return `${results[0].name.first} ${results[0].name.last}`;
};
