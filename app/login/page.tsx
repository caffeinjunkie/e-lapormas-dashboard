"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Form } from "@heroui/form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  return (
    <Card className="max-w-md w-full">
      <CardBody className="overflow-hidden">
        <Tabs fullWidth size="lg" aria-label="Login tabs">
          <Tab key="login" title="Masuk">
            <Form className="flex flex-col gap-4">
              <Input label="Email" type="email" variant="flat" />
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
              <Input label="Nama Depan" variant="flat" />
              <Input label="Nama Belakang" variant="flat" />
              <Input label="Email" type="email" variant="flat" />
              <PasswordInput label="Kata sandi" />
              <PasswordInput label="Konfirmasi Kata sandi" />
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

const PasswordInput = ({
  label,
  variant = "flat"
}: {
  label: string;
  variant?: "flat" | "bordered" | "faded" | "underlined";
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label={label}
      type={isVisible ? "text" : "password"}
      variant={variant}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashIcon className="w-6 h-6 text-default-400 pointer-events-none" />
          ) : (
            <EyeIcon className="w-6 h-6 text-default-400 pointer-events-none" />
          )}
        </button>
      }
    />
  );
};
