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

export const fetchGeneralStatistics = async (
  offset: number = 0,
  limit: number = 12,
) => {
  const { data, error } = await supabase
    .from("general_statistics")
    .select("*")
    .order("month_year", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return data;
};
