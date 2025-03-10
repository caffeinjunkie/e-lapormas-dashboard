import { FormEvent } from "react";
import { Button } from "@heroui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import { validateEmail, validateIsRequired } from "@/utils/string";

interface ResetPasswordFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onBackPress: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export const ResetPasswordForm = ({
  onSubmit,
  isLoading,
  onBackPress,
  isSuccess,
}: ResetPasswordFormProps) => (
  <div className="flex flex-col gap-4 p-1">
    <div className="flex items-center gap-2">
      <Button isIconOnly size="sm" variant="light" onPress={onBackPress}>
        <ArrowLeftIcon className="size-4" strokeWidth="2" />
      </Button>
      <h3 className="text-md font-semibold">Reset kata sandi</h3>
    </div>
    <Form className="flex flex-col gap-4 pt-2" onSubmit={onSubmit}>
      <Input
        label="Masukkan email anda"
        type="email"
        name="email"
        aria-label="email"
        disabled={isSuccess}
        variant="flat"
        radius="sm"
        isRequired
        validate={(value) =>
          validateIsRequired(value, "email") || validateEmail(value)
        }
      />
      <Button
        color={isSuccess ? "success" : "primary"}
        radius="sm"
        isLoading={isLoading}
        disabled={isSuccess}
        className="w-full mt-4 text-white"
        startContent={isSuccess && <CheckCircleIcon className="size-5" />}
        type="submit"
      >
        {isSuccess ? "Terkirim" : "Kirim"}
      </Button>
    </Form>
  </div>
);
