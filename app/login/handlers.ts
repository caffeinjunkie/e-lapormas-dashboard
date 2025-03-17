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

interface HandleRegisterProps {
  formData: FormData;
  setError: (errors: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
  openModal: () => void;
  setModalProps: (props: { title: string; message: string }) => void;
}

const handleRegister = async ({
  formData,
  setError,
  setLoading,
  openModal,
  setModalProps,
}: HandleRegisterProps) => {
  setLoading(true);

  // const passwordMismatchErrors = validateConfirmPassword(
  //   formData.get("password") as string,
  //   formData.get("confirm-password") as string,
  // );

  // if (passwordMismatchErrors) {
  //   setError({ "confirm-password": passwordMismatchErrors });
  //   setLoading(false);
  //   return;
  // }

  // try {
  //   const { data } = await register(formData);
  //   const identities = data.user?.identities;
  //   if (identities?.length === 0) {
  //     setError({
  //       email: "Email telah terdaftar. Mohon gunakan email lain.",
  //     });
  //     return;
  //   }

  //   const unverifiedIdentities = identities?.filter(
  //     (identity) => identity.identity_data?.email_verified === false,
  //   );

  //   if (identities?.length !== 0 && unverifiedIdentities?.length !== 0) {
  //     openModal();
  //     setModalProps({
  //       title: "Email Berhasil Didaftarkan",
  //       message:
  //         "Mohon verifikasi email Anda untuk melanjutkan proses pendaftaran.",
  //     });
  //     return;
  //   }
  // } catch (error: any) {
  //   const message = translateRegisterErrorMessage(
  //     error.message,
  //     formData.get("email") as string,
  //   );
  //   setError({ email: message });
  // } finally {
  //   setLoading(false);
  // }
};

interface HandleResetPasswordProps {
  email: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  openModal: () => void;
  setModalProps: (props: { title: string; message: string }) => void;
}

const handleResetPassword = async ({
  email,
  setLoading,
  setError,
  setSuccess,
  openModal,
  setModalProps,
}: HandleResetPasswordProps) => {
  setLoading(true);

  try {
    const result = await resetPassword(email);
    if (result.success) {
      setSuccess(true);
      setModalProps({
        title: "Reset Password",
        message:
          "Link untuk reset password telah dikirim ke email Anda. Silakan cek email Anda untuk melanjutkan.",
      });
      setTimeout(() => {
        openModal();
      }, 500);
    }
  } catch (error: any) {
    setError("Terjadi kesalahan. Mohon coba sesaat lagi.");
  } finally {
    setLoading(false);
  }
};

export { handleLogin, handleRegister, handleResetPassword };
