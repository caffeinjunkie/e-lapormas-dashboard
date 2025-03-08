import { FormEvent, Dispatch, SetStateAction } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

import { PasswordInput } from "@/components/password-input";
import { validateEmail } from "./utils";

interface LoginTabProps {
  handleLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setTab: Dispatch<SetStateAction<"login" | "register">>;
  setIsResetPassword: Dispatch<SetStateAction<boolean>>;
  submissionError?: string | null;
  isLoading?: boolean;
}

export const LoginForm = ({
  handleLogin,
  setTab,
  setIsResetPassword,
  submissionError,
  isLoading,
}: LoginTabProps) => (
  <Form className="flex flex-col gap-4 mt-8" onSubmit={handleLogin}>
    <Input
      aria-label="email"
      label="Email"
      type="email"
      name="email"
      variant="flat"
      validate={validateEmail}
    />
    <PasswordInput label="Kata sandi" />
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
    <Button
      color="primary"
      isLoading={isLoading}
      className="w-full mt-8"
      type="submit"
    >
      Masuk
    </Button>
    {submissionError && (
      <p className="text-danger w-full text-center text-xs">
        {submissionError}
      </p>
    )}
  </Form>
);
