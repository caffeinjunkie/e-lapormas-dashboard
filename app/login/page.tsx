"use client";

import { FormEvent, useState, Dispatch, SetStateAction } from "react";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";

import { register } from "./actions";
import { ResetPasswordForm } from "./reset-password-form";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [isResetPassword, setIsResetPassword] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(e.currentTarget);
    // await login(new FormData(e.currentTarget))
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    console.log(e);
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await register(data);
  };

  return (
    <Card className="max-w-md w-full">
      <CardBody className="overflow-hidden">
        {isResetPassword && (
          <ResetPasswordForm setIsResetPassword={setIsResetPassword} />
        )}
        {!isResetPassword && (
          <Tabs
            fullWidth
            size="lg"
            aria-label="Login tabs"
            selectedKey={tab}
            onSelectionChange={(key) => setTab(key as "login" | "register")}
          >
            <Tab key="login" title="Masuk">
              <LoginForm
                handleLogin={handleLogin}
                setTab={setTab}
                setIsResetPassword={setIsResetPassword}
              />
            </Tab>
            <Tab key="register" title="Daftar">
              <RegisterForm handleRegister={handleRegister} setTab={setTab} />
            </Tab>
          </Tabs>
        )}
      </CardBody>
    </Card>
  );
}
