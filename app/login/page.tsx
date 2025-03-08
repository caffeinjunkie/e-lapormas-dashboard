"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@heroui/modal";

import { login, register } from "@/app/api/login/handlers";
import { ResetPasswordForm } from "./reset-password-form";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import {
  buildFormData,
  validateConfirmPassword,
  translateLoginErrorMessage,
  translateRegisterErrorMessage,
} from "./utils";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const [registrationFormErrors, setRegistrationFormErrors] = useState({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
  });

  const closeModal = () => setIsModalOpen(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    const formData = buildFormData(e);
    setIsLoginButtonLoading(true);

    try {
      const result = await login(formData);
      if (result.data) {
        router.push("/");
      }
    } catch (error: any) {
      setLoginError(translateLoginErrorMessage(error.message));
    } finally {
      setIsLoginButtonLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);
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

  const resetErrors = () => {
    setLoginError(null);
    setRegistrationFormErrors({});
  };

  const handleTabChange = (key: string) => {
    setTab(key as "login" | "register");
    resetErrors();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen px-6 py-6">
      <Card className="max-w-md w-full">
        <CardBody className="overflow-hidden">
          {isResetPassword && (
            <ResetPasswordForm setIsResetPassword={setIsResetPassword} />
          )}
          {!isResetPassword && (
            <Tabs
              size="md"
              aria-label="Login tabs"
              selectedKey={tab}
              variant="underlined"
              onSelectionChange={(key) => handleTabChange(key as string)}
            >
              <Tab key="login" title="Masuk">
                <LoginForm
                  handleLogin={handleLogin}
                  setTab={setTab}
                  setIsResetPassword={setIsResetPassword}
                  submissionError={loginError}
                  isLoading={isLoginButtonLoading}
                />
              </Tab>
              <Tab key="register" title="Daftar">
                <RegisterForm
                  errors={registrationFormErrors}
                  handleRegister={handleRegister}
                  setTab={setTab}
                  isLoading={isRegisterButtonLoading}
                />
              </Tab>
            </Tabs>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{modalProps.title}</ModalHeader>
              <ModalBody>{modalProps.message}</ModalBody>
              <ModalFooter>
                <Button
                  className="w-full"
                  variant="light"
                  onPress={() => {
                    onClose();
                    handleTabChange("login");
                  }}
                >
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
