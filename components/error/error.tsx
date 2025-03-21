"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

export default function Error({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  const t = useTranslations("ErrorComponent");

  return (
    <div className="flex w-full gap-8 flex-col absolute bottom-0 left-0 h-screen items-center justify-center">
      <h2>{message}</h2>
      <Button
        onPress={onReset}
        startContent={<ArrowPathIcon className="size-4 md:size-5" />}
      >
        {t("try-again-button-text")}
      </Button>
    </div>
  );
}
