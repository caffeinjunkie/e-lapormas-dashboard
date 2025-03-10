import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { login, register } from "@/app/api/login/handlers";
import {
  validateConfirmPassword,
  translateLoginErrorMessage,
  translateRegisterErrorMessage,
} from "./utils";

interface HandleLoginProps {
  formData: FormData;
  router: AppRouterInstance;
  setSubmissionError: (error: string | null) => void;
  setIsLoginButtonLoading: (loading: boolean) => void;
}

const handleLogin = async ({
  formData,
  router,
  setSubmissionError,
  setIsLoginButtonLoading,
}: HandleLoginProps) => {
  setSubmissionError(null);
  setIsLoginButtonLoading(true);

  try {
    const { data } = await login(formData);
    if (data) {
      router.push("/");
    }
  } catch (error: any) {
    setSubmissionError(translateLoginErrorMessage(error.message));
  } finally {
    setIsLoginButtonLoading(false);
  }
};

interface HandleRegisterProps {
  formData: FormData;
  setRegistrationFormErrors: (errors: Record<string, string>) => void;
  setIsRegisterButtonLoading: (loading: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
  setModalProps: (props: { title: string; message: string }) => void;
}

const handleRegister = async ({
  formData,
  setRegistrationFormErrors,
  setIsRegisterButtonLoading,
  setIsModalOpen,
  setModalProps,
}: HandleRegisterProps) => {
  setIsRegisterButtonLoading(true);

  const passwordMismatchErrors = validateConfirmPassword(
    formData.get("password") as string,
    formData.get("confirm-password") as string,
  );

  if (passwordMismatchErrors) {
    setRegistrationFormErrors({ "confirm-password": passwordMismatchErrors });
    setIsRegisterButtonLoading(false);
    return;
  }

  try {
    const { data } = await register(formData);
    const identities = data.user?.identities;
    if (identities?.length === 0) {
      setRegistrationFormErrors({
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
    setRegistrationFormErrors({ email: message });
  } finally {
    setIsRegisterButtonLoading(false);
  }
};

export { handleLogin, handleRegister };
