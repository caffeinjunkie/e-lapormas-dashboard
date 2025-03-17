import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { Dispatch, FormEvent, SetStateAction } from "react";

import { Input } from "@/components/input";
import { PasswordInput } from "@/components/password-input";

import {
  validateEmail,
  validateIsRequired,
  validatePassword,
} from "@/utils/string";

interface RegisterFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setTab: Dispatch<SetStateAction<"login" | "register">>;
  errors?: Record<string, string>;
  isLoading?: boolean;
}

export const RegisterForm = ({
  onSubmit,
  setTab,
  errors,
  isLoading,
}: RegisterFormProps) => {
  const t = (key: string) => key;

  return (
    <Form
      className="flex flex-col items-center justify-between pt-4"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 w-full">
        <Input
          label="Nama Lengkap"
          aria-label="full-name"
          name="full-name"
          isRequired
          validate={(value) => validateIsRequired(t, value, "nama")}
        />
        <Input
          label="Email"
          type="email"
          aria-label="email"
          name="email"
          isRequired
          validate={(value) =>
            validateIsRequired(t, value, "email") || validateEmail(t, value)
          }
        />
        <PasswordInput
          label="Kata sandi"
          isRequired
          ariaLabel="password"
          validate={(value) =>
            validateIsRequired(t, value, "kata sandi") ||
            validatePassword(t, value)
          }
        />
        <PasswordInput
          label="Konfirmasi Kata sandi"
          isRequired
          ariaLabel="confirm-password"
          validate={(value) =>
            validateIsRequired(t, value, "konfirmasi kata sandi") ||
            validatePassword(t, value)
          }
        />
        <p className="text-center text-small w-full">
          Sudah punya akun?{" "}
          <Link size="sm" href="#" onPress={() => setTab("login")}>
            Langsung masuk aja!
          </Link>
        </p>
      </div>
      <Button
        color="primary"
        radius="sm"
        isLoading={isLoading}
        className="w-full mt-4 mb-[-8px]"
        type="submit"
      >
        Daftar
      </Button>
    </Form>
  );
};
