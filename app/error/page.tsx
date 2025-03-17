"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { useError } from "@/providers/error-provider";

export default function ErrorPage() {
  const t = useTranslations("ErrorPage");
  const error = useError();

  const searchParams = useSearchParams();
  const errorCode = searchParams.get("errorCode");
  const message =
    searchParams.get("errorDescription") ||
    "Terjadi kesalahan. Mohon coba sesaat lagi";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="maxw-md w-full p-2">
        <CardHeader className="flex p-4 gap-2 items-center justify-center">
          <p className="text-lg font-semibold">{t("error-title")}</p>
        </CardHeader>
        <CardBody className="flex flex-col p-4 gap-4">
          <p className="text-sm text-default-500">
            {errorCode
              ? t(`error-description-${errorCode.replaceAll("_", "-")}`)
              : message}
          </p>
        </CardBody>
        <CardFooter className="pt-4">
          <Button
            onPress={error?.clearError}
            color="primary"
            radius="sm"
            variant="light"
            className="w-full"
          >
            {t("back-to-login-button")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
