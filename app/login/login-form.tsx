import { FormEvent, Dispatch, SetStateAction } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

import { PasswordInput } from "@/components/password-input";
import { validateEmail } from "./utils";

interface LoginFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setTab: Dispatch<SetStateAction<"login" | "register">>;
  setIsResetPassword: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
}

export const LoginForm = ({
  onSubmit,
  setTab,
  setIsResetPassword,
  isLoading,
}: LoginFormProps) => (
  <Form
    className="flex flex-col items-center justify-between pt-4 h-full"
    onSubmit={onSubmit}
  >
    <div className="flex flex-col gap-4 w-full">
      <Input
        aria-label="email"
        label="Email"
        radius="sm"
        type="email"
        name="email"
        variant="flat"
        validate={validateEmail}
      />
      <PasswordInput radius="sm" label="Kata sandi" />
      <div className="flex justify-between items-center w-full">
        <Link href="#" size="sm" onPress={() => setTab("register")}>
          Daftar sekarang!
        </Link>
        <Link
          href="#"
          color="danger"
          size="sm"
          onPress={() => setIsResetPassword(true)}
        >
          Lupa kata sandi?
        </Link>
      </div>
    </div>

    <Button
      color="primary"
      radius="sm"
      isLoading={isLoading}
      className="w-full mt-8 mb-[-8px]"
      type="submit"
    >
      Masuk
    </Button>
  </Form>
);
