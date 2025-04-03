import { ToastProps, addToast } from "@heroui/toast";
import { Dispatch, SetStateAction } from "react";

import { fetchAdminById, updateAdminById } from "@/api/admin";
import { updateAppConfig } from "@/api/app-config";
import { deleteImage, uploadImage } from "@/api/storage";
import { fetchUserData, resetPassword, updateAuthUser } from "@/api/users";
import { ProfileData } from "@/types/user.types";

export const fetchProfile = async () => {
  const { data } = await fetchUserData();
  const admin = await fetchAdminById(data.user.id);
  return admin;
};

export const handleSendResetPasswordRequest = async (
  email: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  t: (key: string) => string,
) => {
  let toastProps;
  setLoading(true);
  try {
    const { success } = await resetPassword(email);
    if (success) {
      toastProps = {
        title: t("reset-request-success-toast-title"),
        description: t("reset-request-success-toast-description"),
        color: "success",
      };
    }
  } catch (e) {
    toastProps = {
      title: t("reset-request-error-toast-title"),
      description: t("reset-request-error-toast-description"),
      color: "danger",
    };
  } finally {
    setLoading(false);
    addToast(toastProps as ToastProps);
  }
};

export const saveImageToAdmin = async (
  t: (key: string) => string,
  setIsRevalidated: (value: boolean) => void,
  user: ProfileData,
  setLoading: Dispatch<SetStateAction<boolean>>,
  image: File | null = null,
) => {
  let toastProps;
  setLoading(true);

  try {
    if (image) {
      await uploadImage({
        file: image,
        path: `user/${user.id}`,
        bucket: "profile-picture",
      });
    }
    if (!image) {
      await deleteImage({ path: `user/${user.id}`, bucket: "profile-picture" });
    }

    const randomNumber = Math.random() * 10;
    const updatedAdminData = {
      user_id: user.id,
      profile_img: image
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-picture/user/${user.id}?c=${randomNumber}`
        : "",
    };
    const data = await updateAdminById(updatedAdminData);

    if (data) {
      const preText = image === null ? "delete" : "upload";
      toastProps = {
        title: t(`${preText}-profile-picture-success-toast-title`),
        description: t(`${preText}-profile-picture-success-toast-description`),
        color: "success",
      };
    }
    return data;
  } catch (e) {
    toastProps = {
      title: t("upload-profile-picture-error-toast-title"),
      description: t("upload-profile-picture-error-toast-description"),
      color: "danger",
    };
    return null;
  } finally {
    addToast(toastProps as ToastProps);
    setLoading(false);
    setIsRevalidated(true);
  }
};

export const saveAllSettings = async (
  formData: FormData,
  setLoading: Dispatch<SetStateAction<boolean>>,
  t: (key: string) => string,
) => {
  let toastProps;
  setLoading(true);
  try {
    const fullName = formData.get("name");

    if (fullName) {
      await updateAuthUser({
        data: { full_name: fullName as string, fullName: fullName as string },
      });
    }

    const updatedAppConfig = {
      org_name: formData.get("org-name") as string,
      timezone: formData.get("timezone") as string,
    };

    await updateAppConfig(updatedAppConfig);
    document.cookie = `timezone=${updatedAppConfig.timezone}; path=/`;
    document.cookie = `org_name=${updatedAppConfig.org_name}; path=/`;

    toastProps = {
      title: t("save-success-toast-title"),
      description: t("save-success-toast-description"),
      color: "success",
    };
    return { success: true };
  } catch (e) {
    toastProps = {
      title: t("save-error-toast-title"),
      description: t("save-error-toast-description"),
      color: "danger",
    };
    return { success: false };
  } finally {
    setLoading(false);
    addToast(toastProps as ToastProps);
  }
};
