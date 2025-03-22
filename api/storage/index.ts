import supabase from "@/utils/supabase-db";

interface DefaultImageProps {
  bucket: string;
  path: string;
}

interface UploadImageProps extends DefaultImageProps {
  file: File;
}

export const uploadImage = async ({ file, path, bucket }: UploadImageProps) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${path}`, file, {
      cacheControl: "86400", // cached for 1 day
      upsert: true,
    });

  if (error) throw error;
  return data;
};

export const deleteImage = async ({ path, bucket }: DefaultImageProps) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
  return data;
};
