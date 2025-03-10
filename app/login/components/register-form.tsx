import { Dispatch, SetStateAction, FormEvent } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";

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
}: RegisterFormProps) => (
  <Form
    className="flex flex-col items-center justify-between pt-4"
    validationErrors={errors}
    onSubmit={onSubmit}
  >
    <div className="flex flex-col gap-4 w-full">
      <Input
        label="Nama Lengkap"
        radius="sm"
        variant="flat"
        aria-label="full-name"
        name="full-name"
        isRequired
        validate={(value) => validateIsRequired(value, "nama")}
      />
      <Input
        label="Email"
        type="email"
        radius="sm"
        aria-label="email"
        name="email"
        variant="flat"
        isRequired
        validate={(value) =>
          validateIsRequired(value, "email") || validateEmail(value)
        }
      />
      <PasswordInput
        label="Kata sandi"
        isRequired
        radius="sm"
        ariaLabel="password"
        validate={(value) =>
          validateIsRequired(value, "kata sandi") || validatePassword(value)
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
