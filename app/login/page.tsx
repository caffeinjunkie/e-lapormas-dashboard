"use client";

import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Form } from "@heroui/form";

import { PasswordInput } from "@/components/password-input";

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

