"use client";

import { FormEvent, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { useRouter } from "next/navigation";

import { login, register } from "@/app/api/login/handlers";
import { ResetPasswordForm } from "./reset-password-form";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import {
  buildFormData,
  validateConfirmPassword,
  translateLoginErrorMessage,
  translateRegisterErrorMessage,
} from "./utils";
import { useSupabase } from "@/app/providers/supabase-provider";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useSupabase();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const [registrationFormErrors, setRegistrationFormErrors] = useState({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    const data = buildFormData(e);
    setIsLoginButtonLoading(true);

    try {
      const result = await login(supabase, data);
      if (result.data) {
        router.push("/");
      }
    } catch (error: any) {
      setLoginError(translateLoginErrorMessage(error.message));
    } finally {
      setIsLoginButtonLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = buildFormData(e);
    setIsRegisterButtonLoading(true);

    const passwordMismatchErrors = validateConfirmPassword(
      data.get("password") as string,
      data.get("confirm-password") as string,
    );

    console.log(passwordMismatchErrors);

    if (passwordMismatchErrors) {
      setRegistrationFormErrors({ "confirm-password": passwordMismatchErrors });
      setIsRegisterButtonLoading(false);
      return;
    }

    try {
      const result = await register(supabase, data);
      if (!result.data.session) {
        setRegistrationFormErrors({ email: "Email telah digunakan. Mohon gunakan email lain." });
        return;
      }

      if (result.data) {
        router.push("/");
      }
    } catch (error: any) {
      const message = translateRegisterErrorMessage(
        error.message,
        data.get("email") as string,
      );
      setRegistrationFormErrors({ email: message });
    } finally {
      setIsRegisterButtonLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen px-6 py-6">
      <Card className="max-w-md w-full">
        <CardBody className="overflow-hidden">
          {isResetPassword && (
            <ResetPasswordForm setIsResetPassword={setIsResetPassword} />
          )}
          {!isResetPassword && (
            <Tabs
              size="md"
              aria-label="Login tabs"
              selectedKey={tab}
              variant="underlined"
              onSelectionChange={(key) => setTab(key as "login" | "register")}
            >
              <Tab key="login" title="Masuk">
                <LoginForm
                  handleLogin={handleLogin}
                  setTab={setTab}
                  setIsResetPassword={setIsResetPassword}
                  submissionError={loginError}
                  isLoading={isLoginButtonLoading}
                />
              </Tab>
              <Tab key="register" title="Daftar">
                <RegisterForm
                  errors={registrationFormErrors}
                  handleRegister={handleRegister}
                  setTab={setTab}
                  isLoading={isRegisterButtonLoading}
                />
              </Tab>
            </Tabs>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
