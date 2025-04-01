export type ProfileData = {
  id: string;
  email: string;
  fullName?: string;
  imageSrc?: string;
};

export type AdminData = {
  id?: number;
  is_super_admin?: boolean;
  is_verified?: boolean;
  display_name?: string;
  user_id?: string;
  email?: string;
  rating?: number;
  profile_img?: string;
  created_at?: string;
  is_hidden?: boolean;
};
