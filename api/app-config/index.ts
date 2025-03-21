import { AppConfig } from "@/types/app-config.types";
import supabase from "@/utils/supabase-db";

export const fetchAppConfig = async () => {
  const { data, error } = await supabase
    .from("app_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data;
};

export const updateAppConfig = async (updatedAppConfig: AppConfig) => {
  const { data, error } = await supabase
    .from("app_config")
    .update(updatedAppConfig)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchTimezones = async () => {
  const { data, error } = await supabase.from("timezones").select("*");

  if (error) throw error;
  return data;
};
