"use client";

import { FormEvent, useState, Dispatch, SetStateAction } from "react";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Form } from "@heroui/form";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

import { PasswordInput } from "@/components/password-input";
import {
  validateIsRequired,
  validateEmail,
  validateCreatePassword,
} from "./utils";
import { register } from "./actions";

interface RegisterTabProps {
  handleRegister: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setTab: Dispatch<SetStateAction<"login" | "register">>;
}

interface LoginTabProps {
  handleLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setTab: Dispatch<SetStateAction<"login" | "register">>;
  setIsResetPassword: Dispatch<SetStateAction<boolean>>;
}

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

const ResetPasswordForm = ({
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
        <ArrowLeftIcon className="size-5" />
      </Button>
      <h3 className="text-lg font-semibold">Reset kata sandi</h3>
    </div>
    <Form className="flex flex-col gap-4">
      <Input
        label="Masukkan email anda"
        type="email"
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

const LoginForm = ({
  handleLogin,
  setTab,
  setIsResetPassword,
}: LoginTabProps) => (
  <Form className="flex flex-col gap-4 mt-8" onSubmit={handleLogin}>
    <Input label="Email" type="email" variant="flat" validate={validateEmail} />
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
    <Button color="primary" className="w-full mt-8" type="submit">
      Masuk
    </Button>
  </Form>
);

const RegisterForm = ({ handleRegister, setTab }: RegisterTabProps) => (
  <Form className="flex flex-col gap-4 mt-8" onSubmit={handleRegister}>
    <Input
      label="Nama Depan"
      variant="flat"
      isRequired
      validate={(value) => validateIsRequired(value, "nama depan")}
    />
    <Input
      label="Nama Belakang"
      variant="flat"
      isRequired
      validate={(value) => validateIsRequired(value, "nama belakang")}
    />
    <Input
      label="Email"
      type="email"
      variant="flat"
      isRequired
      validate={(value) =>
        validateIsRequired(value, "email") || validateEmail(value)
      }
    />
    <PasswordInput
      label="Kata sandi"
      isRequired
      validate={(value) =>
        validateIsRequired(value, "kata sandi") || validateCreatePassword(value)
      }
    />
    <PasswordInput
      label="Konfirmasi Kata sandi"
      isRequired
      validate={(value) =>
        validateIsRequired(value, "konfirmasi kata sandi") ||
        validateCreatePassword(value)
      }
    />
    <p className="text-center text-small w-full">
      Sudah punya akun?{" "}
      <Link size="sm" href="#" onPress={() => setTab("login")}>
        Langsung masuk aja!
      </Link>
    </p>
    <Button color="primary" className="w-full mt-4" type="submit">
      Daftar
    </Button>
  </Form>
);
