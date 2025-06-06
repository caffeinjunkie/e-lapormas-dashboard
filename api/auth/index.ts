"use server";

import { generatePassword } from "@/utils/string";
import { createClient } from "@/utils/supabase-auth/server";

export const login = async (formData: FormData) => {
  const client = await createClient();
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await client.auth.signInWithPassword(loginData);

  if (error) {
    throw error;
  }

  return { data };
};

export const createAuthUser = async (email: string) => {
  const password = generatePassword();
  const client = await createClient();
  const registrationData = {
    email,
    password,
    options: {
      data: {
        email,
        pass_key: password,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/auth/confirm`,
    },
  };

  const { data, error } = await client.auth.signUp(registrationData);

  if (error) {
    throw error;
  }

  return { data };
};

export const logout = async () => {
  const client = await createClient();
  const { error } = await client.auth.signOut();
  if (error) {
    throw error;
  }

  return {
    success: true,
  };
};
