"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useError } from "@/providers/error-provider";

export default function ErrorPage() {
  const t = useTranslations("ErrorPage");
  const error = useError();

  const searchParams = useSearchParams();
  const errorCode = searchParams.get("errorCode");
  const message = errorCode
    ? t(`error-description-${errorCode?.replaceAll("_", "-")}`)
    : t("error-description-default");

  useEffect(() => {
    if (!errorCode) {
      error?.clearError();
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="maxw-md w-full p-2">
        <CardHeader className="flex p-4 gap-2 items-center justify-center">
          <p className="text-lg font-semibold text-black">{t("error-title")}</p>
        </CardHeader>
        <CardBody className="flex flex-col p-4 gap-4">
          <p className="text-sm text-default-500 text-black">{message}</p>
        </CardBody>
        <CardFooter className="pt-4">
          <Button
            onPress={error?.clearError}
            color="primary"
            radius="sm"
            variant="light"
            className="w-full"
          >
            {t("back-button-text")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
