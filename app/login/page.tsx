"use client";

import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Tab, Tabs } from "@heroui/tabs";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { handleLogin, handleResetPassword } from "@/app/login/handlers";
import { LoginForm } from "@/app/login/login-form";
import { ResetPasswordForm } from "@/app/login/reset-password-form";
import { LogoHorizontal } from "@/components/icons";
import { Modal } from "@/components/modal";
import { siteConfig } from "@/config/site";
import { buildFormData } from "@/utils/form";

enum LoginTabEnum {
  LOGIN = "login",
  REGISTER = "register",
}

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const [tab, setTab] = useState<LoginTabEnum>(LoginTabEnum.LOGIN);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
  const [isResetPasswordButtonLoading, setIsResetPasswordButtonLoading] =
    useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = Modal.useModal();
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { backgroundImageSrcs } = siteConfig;

  const onLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    handleLogin({
      t,
      formData,
      setError: setSubmissionError,
      setLoading: setIsLoginButtonLoading,
      router,
    });
  };

  const onResetPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleReset();
    const formData = buildFormData(e);
    const email = formData.get("email") as string;

    handleResetPassword({
      email,
      setLoading: setIsResetPasswordButtonLoading,
      setError: setSubmissionError,
      setSuccess: setSubmissionSuccess,
      openModal,
      setModalProps,
      t,
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
    setTab(key as LoginTabEnum);
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
      <div className="absolute top-8 left-8">
        <Image
          src={`${siteConfig.storagePath}/app-assets//kabmimika.png`}
          height={64}
          className="object-contain"
          alt="Logo"
        />
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative flex flex-col items-center justify-center py-6 px-6 w-full gap-8 h-screen"
      >
        <div className="w-full flex justify-center items-center gap-1">
          <LogoHorizontal width={240} height={120} />
        </div>
        <Card isBlurred className="max-w-md w-full min-w-[320px]">
          <CardBody
            className="overflow-hidden transition-max-h transition-min-h duration-500 linear"
            style={{
              maxHeight: isResetPassword
                ? "240px"
                : tab === LoginTabEnum.LOGIN
                  ? "400px"
                  : "230px",
              minHeight: isResetPassword
                ? "100px"
                : tab === LoginTabEnum.LOGIN
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
                classNames={{
                  tabContent: "data-[active=true]: text-default-700",
                }}
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
                  <p className="text-center text-sm text-current py-4">
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
            handleTabChange(LoginTabEnum.LOGIN);
            handleReset();
          }}
        >
          <ModalHeader className="text-current">{modalProps.title}</ModalHeader>
          <ModalBody className="text-default-500">
            {modalProps.message}
          </ModalBody>
        </Modal>
      </motion.div>
    </div>
  );
}

LoginPage.displayName = "LoginPage";
