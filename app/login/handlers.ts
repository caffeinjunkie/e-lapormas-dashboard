import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { login, register } from "@/api/auth";
import { resetPassword } from "@/api/users";
import { validateConfirmPassword } from "@/utils/string";
import {
  translateRegisterErrorMessage,
  translateLoginErrorMessage,
} from "@/app/login/utils";

interface HandleLoginProps {
  formData: FormData;
  router: AppRouterInstance;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const handleLogin = async ({
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
    setError(translateLoginErrorMessage(error.message));
  } finally {
    setLoading(false);
  }
};

interface HandleRegisterProps {
  formData: FormData;
  setError: (errors: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
  setModalProps: (props: { title: string; message: string }) => void;
}

const handleRegister = async ({
  formData,
  setError,
  setLoading,
  setIsModalOpen,
  setModalProps,
}: HandleRegisterProps) => {
  setLoading(true);

  const passwordMismatchErrors = validateConfirmPassword(
    formData.get("password") as string,
    formData.get("confirm-password") as string,
  );

  if (passwordMismatchErrors) {
    setError({ "confirm-password": passwordMismatchErrors });
    setLoading(false);
    return;
  }

  try {
    const { data } = await register(formData);
    const identities = data.user?.identities;
    if (identities?.length === 0) {
      setError({
        email: "Email telah terdaftar. Mohon gunakan email lain.",
      });
      return;
    }

    const unverifiedIdentities = identities?.filter(
      (identity) => identity.identity_data?.email_verified === false,
    );

    if (identities?.length !== 0 && unverifiedIdentities?.length !== 0) {
      setIsModalOpen(true);
      setModalProps({
        title: "Email Berhasil Didaftarkan",
        message:
          "Mohon verifikasi email Anda untuk melanjutkan proses pendaftaran.",
      });
      return;
    }
  } catch (error: any) {
    const message = translateRegisterErrorMessage(
      error.message,
      formData.get("email") as string,
    );
    setError({ email: message });
  } finally {
    setLoading(false);
  }
};

interface HandleResetPasswordProps {
  email: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
  setModalProps: (props: { title: string; message: string }) => void;
}

const handleResetPassword = async ({
  email,
  setLoading,
  setError,
  setSuccess,
  setIsModalOpen,
  setModalProps,
}: HandleResetPasswordProps) => {
  setLoading(true);

  try {
    const result = await resetPassword(email);
    if (result.success) {
      setSuccess(true);
    }
  } catch (error: any) {
    setError("Terjadi kesalahan. Mohon coba sesaat lagi.");
  } finally {
    setLoading(false);
    setModalProps({
      title: "Reset Password",
      message:
        "Link untuk reset password telah dikirim ke email Anda. Silakan cek email Anda untuk melanjutkan.",
    });
    setTimeout(() => {
      setIsModalOpen(true);
    }, 500);
  }
};

export { handleLogin, handleRegister, handleResetPassword };
