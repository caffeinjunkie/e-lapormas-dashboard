import supabase from "@/utils/supabase-db";

export const fetchAnnouncements = async (
  offset: number = 0,
  limit: number = 8,
  searchValue: string = "",
) => {
  const { data, error, count } = await supabase
    .from("announcements")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1)
    .or(`title.ilike.%${searchValue}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data, count };
};

export const updateAnnouncementById = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const { data: updatedData, error } = await supabase
    .from("announcements")
    .update(data)
    .eq("id", id)
    .single();

  if (error) throw error;

  return { data: updatedData };
};

export const createAnnouncement = async (data: Record<string, unknown>) => {
  const { data: createdData, error } = await supabase
    .from("announcements")
    .insert([data])
    .single();

  if (error) throw error;

  return { data: createdData };
};

export const deleteAnnouncement = async (id: string) => {
  const { data: deletedData, error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id)
    .single();

  if (error) throw error;

  return { data: deletedData };
};

export const updateAnnouncement = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const { data: updatedData, error } = await supabase
    .from("announcements")
    .update(data)
    .eq("id", id)
    .single();

  if (error) throw error;

  return { data: updatedData };
};
