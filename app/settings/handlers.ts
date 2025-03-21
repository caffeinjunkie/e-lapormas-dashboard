import { ToastProps, addToast } from "@heroui/toast";
import { Dispatch, SetStateAction } from "react";

import { fetchAdminById } from "@/api/admin";
import { fetchUserData, resetPassword } from "@/api/users";

export const getProfile = async () => {
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
