import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";

import { Input } from "@/components/input";
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
}: ResetPasswordFormProps) => {
  const t = useTranslations("LoginPage");

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex items-center gap-2">
        <Button isIconOnly size="sm" variant="light" onPress={onBackPress}>
          <ArrowLeftIcon className="size-4" strokeWidth="2" />
        </Button>
        <h3 className="text-base font-semibold">
          {t("forgot-password-tab-title")}
        </h3>
      </div>
      <Form className="flex flex-col gap-4 pt-2" onSubmit={onSubmit}>
        <Input
          label={t("forgot-password-email-input-label")}
          type="email"
          name="email"
          disabled={isSuccess}
          isRequired
          validate={(value) =>
            validateIsRequired(t, value, "email") || validateEmail(t, value)
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
          {t(`forgot-password-${isSuccess ? "success" : "submit"}-button-text`)}
        </Button>
      </Form>
    </div>
  );
};
