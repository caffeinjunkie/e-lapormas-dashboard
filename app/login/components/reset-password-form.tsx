import { Dispatch, SetStateAction } from "react";
import { Button } from "@heroui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import { validateEmail, validateIsRequired } from "@/utils/string";

export const ResetPasswordForm = ({
  setIsResetPassword,
}: {
  setIsResetPassword: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="flex flex-col gap-4 p-1">
    <div className="flex items-center gap-2">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => setIsResetPassword(false)}
      >
        <ArrowLeftIcon className="size-4" strokeWidth="2" />
      </Button>
      <h3 className="text-md font-semibold">Reset kata sandi</h3>
    </div>
    <Form className="flex flex-col gap-4 pt-2">
      <Input
        label="Masukkan email anda"
        type="email"
        aria-label="email"
        variant="flat"
        radius="sm"
        isRequired
        validate={(value) =>
          validateIsRequired(value, "email") || validateEmail(value)
        }
      />
      <Button color="primary" radius="sm" className="w-full mt-4" type="submit">
        Kirim
      </Button>
    </Form>
  </div>
);
