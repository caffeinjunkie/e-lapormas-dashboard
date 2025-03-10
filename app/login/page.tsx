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

import { buildFormData } from "@/utils/form";
import { ResetPasswordForm } from "@/app/login/components/reset-password-form";
import { LoginForm } from "@/app/login/components/login-form";
import { RegisterForm } from "./components/register-form";
import { loginImages } from "@/app/login/utils";
import {
  handleLogin,
  handleRegister,
  handleResetPassword,
} from "@/app/login/handlers";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const [isResetPasswordButtonLoading, setIsResetPasswordButtonLoading] =
    useState(false);
  const [registrationFormErrors, setRegistrationFormErrors] = useState({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const logoSrc =
    "https://chnpxcvhzxlwdaqhbhqp.supabase.co/storage/v1/object/sign/photos/openart-image_1g1deKbR_1741562295689_raw-removebg-preview.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3Mvb3BlbmFydC1pbWFnZV8xZzFkZUtiUl8xNzQxNTYyMjk1Njg5X3Jhdy1yZW1vdmViZy1wcmV2aWV3LnBuZyIsImlhdCI6MTc0MTU2MjM5NywiZXhwIjoxODA0NjM0Mzk3fQ.0QOgUolCbwL2WQkmypEXGuuSX0HEuzZDPX8eCCADxPo";

  const closeModal = () => setIsModalOpen(false);

  const onLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    handleLogin({
      formData,
      setError: setSubmissionError,
      setLoading: setIsLoginButtonLoading,
      router,
    });
  };

  const onRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    handleRegister({
      formData,
      setError: setRegistrationFormErrors,
      setLoading: setIsRegisterButtonLoading,
      setIsModalOpen,
      setModalProps,
    });
  };

  const onResetPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);
    const email = formData.get("email") as string;

    handleResetPassword({
      email,
      setLoading: setIsResetPasswordButtonLoading,
      setError: setSubmissionError,
      setSuccess: setSubmissionSuccess,
    });
  };

  const handleReset = () => {
    setSubmissionError(null);
    setRegistrationFormErrors({});
    setSubmissionSuccess(false);
  };

  const handleTabChange = (key: string) => {
    setTab(key as "login" | "register");
    handleReset();
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
      <div className="relative flex flex-col items-center justify-center py-6 px-6 w-full gap-8 h-screen">
        <div className="w-full flex justify-center items-center gap-1">
          <NextImage
            src={logoSrc}
            alt="Logo"
            className="object-contain"
            width={80}
            height={80}
          />
          <div className="flex flex-col text-sm text-black">
            <p>Dashboard</p>
            <p>Sistem Laporan Elektronik</p>
            <p>Bandung Barat</p>
          </div>
        </div>
        <Card className="max-w-md w-full min-w-[320px] overflow-scroll">
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
                  : "468px",
            }}
          >
            {isResetPassword && (
              <ResetPasswordForm
                onBackPress={() => {
                  handleReset();
                  setIsResetPassword(false);
                }}
                isSuccess={submissionSuccess}
                onSubmit={onResetPasswordSubmit}
                isLoading={isResetPasswordButtonLoading}
              />
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
