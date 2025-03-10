"use server";

import { createClient } from "@/utils/supabase/server";

export const login = async (formData: FormData) => {
  const client = await createClient();
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await client.auth.signInWithPassword(loginData);

  if (error) {
    throw new Error(error.message);
  }

  console.log("User signed in:", data);
  return { data };
};

export const register = async (formData: FormData) => {
  const client = await createClient();
  //TODO: create a safer way to pass data here
  const registrationData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        fullName: formData.get("full-name") as string,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/auth/confirm`,
    },
  };

  const { data, error } = await client.auth.signUp(registrationData);
  //TODO: connect pekerja AI admin services to save admin
  //personal data such as full name, email, and image.

  if (error) {
    throw new Error(error.message);
  }

  console.log("User registered:", data);
  return { data };
};

export const logout = async () => {
  const client = await createClient();
  const { error } = await client.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
  };
};
