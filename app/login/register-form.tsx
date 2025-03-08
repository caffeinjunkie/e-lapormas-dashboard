import { Dispatch, SetStateAction, FormEvent } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";

import { PasswordInput } from "@/components/password-input";

import {
  validateEmail,
  validateIsRequired,
  validateCreatePassword,
} from "./utils";

interface RegisterTabProps {
  handleRegister: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setTab: Dispatch<SetStateAction<"login" | "register">>;
  errors?: Record<string, string>;
  isLoading?: boolean;
}

export const RegisterForm = ({
  handleRegister,
  setTab,
  errors,
  isLoading,
}: RegisterTabProps) => (
  <Form
    validationErrors={errors}
    className="flex flex-col gap-4 mt-8"
    onSubmit={handleRegister}
  >
    <Input
      label="Nama Lengkap"
      variant="flat"
      aria-label="full-name"
      name="full-name"
      isRequired
      validate={(value) => validateIsRequired(value, "nama")}
    />
    <Input
      label="Email"
      type="email"
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
      ariaLabel="password"
      validate={(value) =>
        validateIsRequired(value, "kata sandi") || validateCreatePassword(value)
      }
    />
    <PasswordInput
      label="Konfirmasi Kata sandi"
      isRequired
      ariaLabel="confirm-password"
      validate={(value) =>
        validateIsRequired(value, "konfirmasi kata sandi") ||
        validateCreatePassword(value)
      }
    />
    <p className="text-center text-small w-full">
      Sudah punya akun?{" "}
      <Link size="sm" href="#" onPress={() => setTab("login")}>
        Langsung masuk aja!
      </Link>
    </p>
    <Button
      color="primary"
      isLoading={isLoading}
      className="w-full mt-4"
      type="submit"
    >
      Daftar
    </Button>
  </Form>
);
