"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  supabaseLogin,
  supabaseRegister,
  supabaseLogout,
} from "@/app/api/login/handlers";

export const login = async (formData: FormData) => {
  const { data, error } = await supabaseLogin(formData, supabase);

  if (error) {
    redirect("/error");
  }

  console.log("User signed in:", data);
  revalidatePath("/", "layout");
  redirect("/");
};

const register = async (formData: FormData) => {
  const { data, error } = await supabaseRegister(formData, supabase);
  //TODO: connect pekerja AI admin services to save admin
  //personal data such as full name, email, and image.

  if (error) {
    redirect("/error");
  }

  console.log("User registered:", data);
  revalidatePath("/", "layout");
  redirect("/");
};

const logout = async () => {
  const { error } = await supabaseLogout(supabase);
  if (error) {
    redirect("/error");
  }

  revalidatePath("/login", "layout");
  redirect("/login");
};
