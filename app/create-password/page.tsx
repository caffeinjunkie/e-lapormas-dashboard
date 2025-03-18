"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import {
  deleteAllCookies,
  getCreatePasswordErrorMessage,
  getTokenErrorMessage,
} from "@/app/create-password/utils";

import { Modal } from "@/components/modal";
import { useModal } from "@/components/modal/use-modal";
import { PasswordInput } from "@/components/password-input";

import { logout } from "@/api/auth";
import { updateAuthUser, validateToken } from "@/api/users";

import { buildFormData } from "@/utils/form";
import {
  validateConfirmPassword,
  validateIsRequired,
  validatePassword,
} from "@/utils/string";

import { siteConfig } from "@/config/site";

export default function CreatePasswordPage() {
  const [inputErrors, setInputErrors] = useState<
    Record<string, string> | undefined
  >(undefined);
  const [tokenError, setTokenError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
  });
  const searchParams = useSearchParams();
  const { backgroundImageSrcs } = siteConfig;
  const t = useTranslations("CreatePasswordPage");
  const type = searchParams.get("type");
  const tokenHash = searchParams.get("token_hash");

  useEffect(() => {
    deleteAllCookies();
  }, []);

  const verifyIdentity = async () => {
    if (!tokenHash) {
      setTokenError(t("no-access-error-message"));
      return null;
    }

    try {
      const result = await validateToken("recovery", tokenHash);
      const identities = result.data.user?.identities;

      const unverifiedIdentities = identities?.filter(
        (identity) => identity.identity_data?.email_verified === false,
      );

      return unverifiedIdentities;
    } catch (error: any) {
      setTokenError(t(getTokenErrorMessage(error.name)));
    }

    return null;
  };

  const handleSubmit = async (password: string) => {
    const identities = await verifyIdentity();

    if (!identities) {
      return;
    }

    if (identities?.length === 0 && type !== "invite") {
      setModalProps({
        title: t("create-password-unverified-identity-error-title"),
        message: t("create-password-unverified-identity-error-message"),
      });
      openModal();
      return;
    }

    const { success } = await updateAuthUser({ password });
    if (!success) {
      setIsLoading(false);
      throw new Error("Gagal mengubah kata sandi"); // create submission error
    }

    setModalProps({
      title: t("create-password-success-title"),
      message: t("create-password-success-message"),
    });
    openModal();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    const confirmPasswordError = validateConfirmPassword(
      t,
      password,
      confirmPassword,
    );
    if (confirmPasswordError) {
      setInputErrors({ "confirm-password": confirmPasswordError });
      return;
    }

    setIsLoading(true);
    setInputErrors(undefined);

    try {
      await handleSubmit(password);
    } catch (error: any) {
      setInputErrors({
        password: t(getCreatePasswordErrorMessage(error.message)),
      });
    } finally {
      setIsLoading(false);
      await logout();
    }
  };

  const onCloseModal = () => {
    closeModal();
    handleReset();
    router.push("/login");
  };

  const handleReset = () => {
    setInputErrors(undefined);
    setTokenError(undefined);
    setModalProps({
      title: "",
      message: "",
    });
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
        <Card className="max-w-md w-full min-w-[360px] overflow-scroll">
          {tokenError && (
            <CardHeader className="flex p-4 gap-2 items-center justify-center">
              <p className="text-lg font-semibold">
                {t("default-error-message-title")}
              </p>
            </CardHeader>
          )}
          <CardBody className="flex flex-col p-4 gap-4">
            {tokenError && (
              <p className="text-sm text-center text-default-500">
                {tokenError}
              </p>
            )}
            {!tokenError && (
              <>
                <h3 className="text-md text-center font-semibold">
                  {t("create-password-title")}
                </h3>
                <Form
                  className="flex flex-col items-center justify-between pt-2 gap-4"
                  validationErrors={inputErrors}
                  onSubmit={onSubmit}
                >
                  <div className="flex flex-col gap-4 w-full">
                    <PasswordInput
                      label={t("create-password-password-input-label")}
                      isRequired
                      radius="sm"
                      ariaLabel="password"
                      validate={(value) =>
                        validateIsRequired(t, value, "password") ||
                        validatePassword(t, value)
                      }
                    />
                    <PasswordInput
                      label={t("create-password-confirm-password-input-label")}
                      isRequired
                      radius="sm"
                      ariaLabel="confirm-password"
                      validate={(value) =>
                        validateIsRequired(t, value, "confirm-password") ||
                        validatePassword(t, value)
                      }
                    />
                  </div>
                  <Button
                    color="primary"
                    radius="sm"
                    isLoading={isLoading}
                    className="w-full mt-4"
                    type="submit"
                  >
                    {t("create-password-submit-button-text")}
                  </Button>
                </Form>
              </>
            )}
          </CardBody>
          {tokenError && (
            <CardFooter className="pt-4">
              <Button
                as={Link}
                href="/login"
                color="primary"
                radius="sm"
                className="w-full"
              >
                {t("create-password-error-link-text")}
              </Button>
            </CardFooter>
          )}
        </Card>
        <Modal isOpen={isOpen} title={modalProps.title} onClose={onCloseModal}>
          <ModalHeader className="text-black">{modalProps.title}</ModalHeader>
          <ModalBody className="text-default-500">
            {modalProps.message}
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}

CreatePasswordPage.displayName = "CreatePasswordPage";
