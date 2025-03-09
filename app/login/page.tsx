"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
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

import { ResetPasswordForm } from "./reset-password-form";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { buildFormData, loginImages } from "./utils";
import { handleLogin, handleRegister } from "./handlers";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const [registrationFormErrors, setRegistrationFormErrors] = useState({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
  });

  const closeModal = () => setIsModalOpen(false);

  const onLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    handleLogin({
      formData,
      setSubmissionError,
      setIsLoginButtonLoading,
      router,
    });
  };

  const onRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    handleRegister({
      formData,
      setRegistrationFormErrors,
      setIsRegisterButtonLoading,
      setIsModalOpen,
      setModalProps,
    });
  };

  const resetErrors = () => {
    setSubmissionError(null);
    setRegistrationFormErrors({});
  };

  const handleTabChange = (key: string) => {
    setTab(key as "login" | "register");
    resetErrors();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <NextImage
        src={loginImages[0]}
        alt="Login"
        width={1920}
        height={1080}
        className="w-full h-full object-cover absolute top-0 left-0"
      />
      <div className="relative flex flex-col items-center justify-center py-6 px-6 w-full h-screen">
        <Card className="max-w-md w-full min-w-[320px]">
          <CardBody
            className="overflow-hidden transition-max-h transition-min-h duration-500 linear"
            style={{
              maxHeight: isResetPassword
                ? "240px"
                : tab === "login"
                  ? "380px"
                  : "580px",
              minHeight: isResetPassword
                ? "100px"
                : tab === "login"
                  ? "280px"
                  : "380px",
            }}
          >
            {isResetPassword && (
              <ResetPasswordForm setIsResetPassword={setIsResetPassword} />
            )}
            {!isResetPassword && (
              <Tabs
                size="md"
                aria-label="Login tabs"
                selectedKey={tab}
                variant="underlined"
                className="font-semibold"
                onSelectionChange={(key) => handleTabChange(key as string)}
              >
                <Tab key="login" title="Masuk">
                  <LoginForm
                    onSubmit={onLoginSubmit}
                    setTab={setTab}
                    setIsResetPassword={setIsResetPassword}
                    isLoading={isLoginButtonLoading}
                  />
                </Tab>
                <Tab key="register" title="Daftar">
                  <RegisterForm
                    errors={registrationFormErrors}
                    onSubmit={onRegisterSubmit}
                    setTab={setTab}
                    isLoading={isRegisterButtonLoading}
                  />
                </Tab>
              </Tabs>
            )}
            {submissionError && (
              <p className="text-danger w-full text-center text-xs pt-2 pb-2">
                {submissionError}
              </p>
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
    </div>
  );
}
