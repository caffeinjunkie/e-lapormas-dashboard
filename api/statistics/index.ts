import supabase from "@/utils/supabase-db";

export const fetchCategoryStatistics = async () => {
  const { data, error } = await supabase
    .from("category_statistics")
    .select("*");

  if (error) {
    throw error;
  }

  return data;
};

export const fetchLocationStatistics = async () => {
  const { data, error } = await supabase
    .from("location_statistics")
    .select("*");

  if (error) {
    throw error;
  }

  return data;
};

export const fetchGeneralStatistics = async () => {
  const { data, error } = await supabase.from("general_statistics").select("*");

  if (error) {
    throw error;
  }

  return data;
};

export const fetchGeneralStatisticsWithLimit = async (limit: number) => {
  const { data, error } = await supabase
    .from("general_statistics")
    .select("*")
    .order("month_year", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
};
