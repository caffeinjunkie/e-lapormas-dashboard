"use client";

import { useState, FormEvent } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import NextImage from "next/image";
import { Modal } from "@/components/modal";
import { ModalHeader, ModalBody } from "@heroui/modal";

import { PasswordInput } from "@/components/password-input";
import {
  validatePassword,
  validateIsRequired,
  validateConfirmPassword,
} from "@/utils/string";
import { buildFormData } from "@/utils/form";
import { updatePassword, validateToken } from "@/api/users";
import {
  translateCreatePasswordErrorMessage,
  translateTokenErrorMessage,
} from "@/app/create-password/utils";
import { logout } from "@/api/auth";
import { siteConfig } from "@/config/site";
import { useModal } from "@/hooks/use-modal";

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

  const verifyToken = async () => {
    const tokenHash = searchParams.get("token_hash");

    if (!tokenHash) {
      setTokenError(
        "Tidak dapat mengakses halaman ini. Mohon kembali ke halaman login.",
      );
      return;
    }

    try {
      const result = await validateToken("recovery", tokenHash);
      const identities = result.data.user?.identities;

      const unverifiedIdentities = identities?.filter(
        (identity) => identity.identity_data?.email_verified === false,
      );

      if (unverifiedIdentities?.length !== 0) {
        setModalProps({
          title: "Email Belum Diverifikasi",
          message: "Mohon verifikasi email Anda.",
        });
        openModal();
      }
    } catch (error: any) {
      setTokenError(translateTokenErrorMessage(error.name));
    }
  };

  const handleSubmit = async (password: string) => {
    await verifyToken();

    const { success } = await updatePassword(password);
    console.log(success, "success");
    if (!success) {
      setIsLoading(false);
      throw new Error("Gagal mengubah kata sandi"); // create submission error
    }

    setModalProps({
      title: "Kata Sandi Baru Berhasil Dibuat",
      message:
        "Kata sandi baru berhasil dibuat. Anda dapat login dengan kata sandi baru.",
    });
    openModal();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    const confirmPasswordError = validateConfirmPassword(
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
      console.log(error, "error");
      setInputErrors({
        password: translateCreatePasswordErrorMessage(error.message),
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
              <p className="text-lg font-semibold">Terjadi Kesalahan</p>
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
                  Buat Kata Sandi
                </h3>
                <Form
                  className="flex flex-col items-center justify-between pt-2 gap-4"
                  validationErrors={inputErrors}
                  onSubmit={onSubmit}
                >
                  <div className="flex flex-col gap-4 w-full">
                    <PasswordInput
                      label="Kata sandi"
                      isRequired
                      radius="sm"
                      ariaLabel="password"
                      validate={(value) =>
                        validateIsRequired(value, "kata sandi") ||
                        validatePassword(value)
                      }
                    />
                    <PasswordInput
                      label="Konfirmasi Kata sandi"
                      isRequired
                      radius="sm"
                      ariaLabel="confirm-password"
                      validate={(value) =>
                        validateIsRequired(value, "konfirmasi kata sandi") ||
                        validatePassword(value)
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
                    Simpan Kata Sandi Baru
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
                Kembali ke halaman login
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
