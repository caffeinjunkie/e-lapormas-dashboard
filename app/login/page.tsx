"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { ModalHeader, ModalBody } from "@heroui/modal";
import { useTranslations } from "next-intl";

import { buildFormData } from "@/utils/form";
import { ResetPasswordForm } from "@/app/login/components/reset-password-form";
import { LoginForm } from "@/app/login/components/login-form";
import { siteConfig } from "@/config/site";
import { handleLogin, handleResetPassword } from "@/app/login/handlers";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
  const [isResetPasswordButtonLoading, setIsResetPasswordButtonLoading] =
    useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { logoSrc, backgroundImageSrcs } = siteConfig;

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

  const onResetPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);
    const email = formData.get("email") as string;

    handleResetPassword({
      email,
      setLoading: setIsResetPasswordButtonLoading,
      setError: setSubmissionError,
      setSuccess: setSubmissionSuccess,
      openModal,
      setModalProps,
    });
  };

  const handleReset = () => {
    setSubmissionError(null);
    setSubmissionSuccess(false);
    setModalProps({
      title: "",
      message: "",
    });
  };

  const handleTabChange = (key: string) => {
    setTab(key as "login" | "register");
    handleReset();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <NextImage
        src={backgroundImageSrcs[0]}
        alt="Login"
        width={2688}
        height={1536}
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
            <p>{t("title-1")}</p>
            <p>{t("title-2")}</p>
            <p>{siteConfig.organizationName}</p>
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
                  : "230px",
              minHeight: isResetPassword
                ? "100px"
                : tab === "login"
                  ? "280px"
                  : "128px",
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
                <Tab key="login" title={t("login-tab-title")}>
                  <LoginForm
                    onSubmit={onLoginSubmit}
                    onResetPasswordPress={() => {
                      setIsResetPassword(true);
                      handleReset();
                    }}
                    isLoading={isLoginButtonLoading}
                  />
                </Tab>
                <Tab key="register" title={t("register-tab-title")}>
                  <p className="text-center text-sm text-default-500 py-4">
                    {t("register-tab-invite-only-message")}
                  </p>
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
        <Modal
          isOpen={isOpen}
          onClose={() => {
            closeModal();
            if (isResetPassword) {
              setIsResetPassword(false);
            }
            handleTabChange("login");
            handleReset();
          }}
        >
          <ModalHeader className="text-black">{modalProps.title}</ModalHeader>
          <ModalBody className="text-default-500">
            {modalProps.message}
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}
