import { ToastProps, addToast } from "@heroui/toast";
import { Dispatch, SetStateAction } from "react";

import { fetchAdminById, updateAdminById } from "@/api/admin";
import { updateAppConfig } from "@/api/app-config";
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
  image: string = "",
) => {
  const updatedAdminData = {
    user_id: user.id,
    profile_img: image,
  };
  let toastProps;
  setLoading(true);

  try {
    const data = await updateAdminById(updatedAdminData);
    if (data) {
      const preText = image === "" ? "remove" : "update";
      toastProps = {
        title: t(`${preText}-photo-success-toast-title`),
        description: t(`${preText}-photo-success-toast-description`),
        color: "success",
      };
    }
  } catch (e) {
    toastProps = {
      title: t("update-photo-error-toast-title"),
      description: t("update-photo-error-toast-description"),
      color: "success",
    };
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
      await updateAuthUser({ data: { full_name: fullName as string } });
    }

    const updatedAppConfig = {
      org_name: formData.get("org-name") as string,
      timezone: formData.get("timezone") as string,
    };

    await updateAppConfig(updatedAppConfig);

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
