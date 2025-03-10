import { FormEvent, Dispatch, SetStateAction } from "react";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/input";
import { validateEmail } from "@/utils/string";

interface LoginFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setTab: Dispatch<SetStateAction<"login" | "register">>;
  onResetPasswordPress: () => void;
  isLoading?: boolean;
}

export const LoginForm = ({
  onSubmit,
  setTab,
  onResetPasswordPress,
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
        type="email"
        name="email"
        validate={validateEmail}
      />
      <PasswordInput label="Kata sandi" />
      <div className="flex justify-between items-center w-full">
        <Link href="#" size="sm" onPress={() => setTab("register")}>
          Daftar sekarang!
        </Link>
        <Link href="#" color="danger" size="sm" onPress={onResetPasswordPress}>
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
