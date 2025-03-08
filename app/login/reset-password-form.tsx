import { Dispatch, SetStateAction } from "react";
import { Button } from "@heroui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import { validateEmail, validateIsRequired } from "./utils";

export const ResetPasswordForm = ({
  setIsResetPassword,
}: {
  setIsResetPassword: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2 mb-4">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => setIsResetPassword(false)}
      >
        <ArrowLeftIcon className="size-4" />
      </Button>
      <h3 className="text-md font-semibold">Reset kata sandi</h3>
    </div>
    <Form className="flex flex-col gap-4">
      <Input
        label="Masukkan email anda"
        type="email"
        aria-label="email"
        variant="flat"
        isRequired
        validate={(value) =>
          validateIsRequired(value, "email") || validateEmail(value)
        }
      />
      <Button color="primary" className="w-full mt-8" type="submit">
        Kirim
      </Button>
    </Form>
  </div>
);
