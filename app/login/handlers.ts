import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { login } from "@/api/auth";
import { resetPassword } from "@/api/users";

interface HandleLoginProps {
  t: (key: string) => string;
  formData: FormData;
  router: AppRouterInstance;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const getErrorMessageKey = (message: string) => {
  switch (message) {
    case "Email not confirmed":
      return "verify-email-error-message";
    case "Invalid login credentials":
      return "invalid-credentials-error-message";
    default:
      return "default-error-message";
  }
};

const handleLogin = async ({
  t,
  formData,
  router,
  setError,
  setLoading,
}: HandleLoginProps) => {
  setError(null);
  setLoading(true);

  try {
    const { data } = await login(formData);
    if (data) {
      router.push("/");
    }
  } catch (error: any) {
    const errorMessageKey = getErrorMessageKey(error.message);
    setError(t(errorMessageKey));
    setLoading(false);
  }
};

interface HandleResetPasswordProps {
  email: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  openModal: () => void;
  setModalProps: (props: { title: string; message: string }) => void;
  t: (key: string) => string;
}

const handleResetPassword = async ({
  email,
  setLoading,
  setError,
  setSuccess,
  openModal,
  setModalProps,
  t,
}: HandleResetPasswordProps) => {
  setLoading(true);

  try {
    const result = await resetPassword(email);
    if (result.success) {
      setSuccess(true);
      setModalProps({
        title: t("reset-password-success-title"),
        message: t("reset-password-success-message"),
      });
      setTimeout(() => {
        openModal();
      }, 500);
    }
  } catch (error: any) {
    setError(t("reset-password-error-message"));
  } finally {
    setLoading(false);
  }
};

export { handleLogin, handleResetPassword };
