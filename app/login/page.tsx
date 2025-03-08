"use client";

import { FormEvent } from "react";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Form, FormProps } from "@heroui/form";

import { PasswordInput } from "@/components/password-input";
import { login, register } from "./actions";
import {
  validateIsRequired,
  validateEmail,
  validateCreatePassword,
} from "./utils";

export default function LoginPage() {
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // await login(new FormData(e.currentTarget))
  };

  return (
    <Card className="max-w-md w-full">
      <CardBody className="overflow-hidden">
        <Tabs fullWidth size="lg" aria-label="Login tabs">
          <Tab key="login" title="Masuk">
            <Form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <Input
                label="Email"
                type="email"
                variant="flat"
                validate={validateEmail}
              />
              <PasswordInput label="Kata sandi" />
              <div className="flex justify-end">
                <Link href="#" size="sm">
                  Lupa kata sandi?
                </Link>
              </div>
              <Button color="primary" type="submit">
                Masuk
              </Button>
            </Form>
          </Tab>
          <Tab key="register" title="Daftar">
            <Form className="flex flex-col gap-4">
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
                  validateIsRequired(value, "kata sandi") ||
                  validateCreatePassword(value)
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
              <Button color="primary" type="submit">
                Daftar
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
