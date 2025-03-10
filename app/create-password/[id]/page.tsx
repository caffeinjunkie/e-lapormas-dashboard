"use client";

import { useState, FormEvent, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { createClient } from "@/utils/supabase/client";

import { PasswordInput } from "@/components/password-input";
import {
  validatePassword,
  validateIsRequired,
  validateConfirmPassword,
} from "@/utils/string";
import { buildFormData } from "@/utils/form";
import { updatePassword } from "@/api/users";
import { translateCreatePasswordErrorMessage } from "@/app/create-password/[id]/utils";

export default function CreatePasswordPage() {
  const [errors, setErrors] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const validateSession = async () => {
    // const res = await fetchUserData();
    // const {
    //   data,
    // } = await createClient().auth.getSession();
    // use id token to validate session if expired
    console.log(id, "id");
    if (!id) {
      // change to if expired
      router.replace("/error?message=Akses tidak valid");
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

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
      setErrors({ "confirm-password": confirmPasswordError });
      return;
    }

    setIsLoading(true);
    setErrors(undefined);

    try {
      console.log(id, "id");
      const { success } = await updatePassword(password);
      if (!success) {
        throw new Error("Gagal mengubah kata sandi");
      }
      console.log("Password berhasil diubah");
    } catch (error: any) {
      console.log(error.message, "error");
      setErrors({
        password: translateCreatePasswordErrorMessage(error.message),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <Card className="max-w-md w-full min-w-[360px] overflow-scroll">
        <CardBody className="flex flex-col p-4 gap-4">
          <h3 className="text-md text-center font-semibold">Buat Kata Sandi</h3>
          <Form
            className="flex flex-col items-center justify-between pt-2 gap-4"
            validationErrors={errors}
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
        </CardBody>
      </Card>
    </div>
  );
}
