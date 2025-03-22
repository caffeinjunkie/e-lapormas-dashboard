import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";

import { Input } from "@/components/input";
import { PasswordInput } from "@/components/password-input";
import { validateEmail, validateIsRequired } from "@/utils/string";

interface LoginFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onResetPasswordPress: () => void;
  isLoading?: boolean;
}

export const LoginForm = ({
  onSubmit,
  onResetPasswordPress,
  isLoading,
}: LoginFormProps) => {
  const t = useTranslations("LoginPage");

  return (
    <Form
      className="flex flex-col items-center justify-between pt-4 h-full"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 w-full">
        <Input
          aria-label="email"
          label={t("login-form-email-input-label")}
          type="email"
          disabled={isLoading}
          name="email"
          isRequired
          validate={(value) =>
            validateIsRequired(t, value, "email") || validateEmail(t, value)
          }
        />
        <PasswordInput
          disabled={isLoading}
          isRequired
          ariaLabel="password"
          validate={(value) => validateIsRequired(t, value, "password")}
          label={t("login-form-password-input-label")}
        />
        <div className="flex justify-end items-center w-full">
          <Link
            href="#"
            color="danger"
            size="sm"
            onPress={onResetPasswordPress}
          >
            {t("login-form-forgot-password-link-text")}
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
        {t("login-form-submit-button-text")}
      </Button>
    </Form>
  );
};
