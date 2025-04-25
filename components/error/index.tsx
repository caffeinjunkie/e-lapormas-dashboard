"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export default function Error({
  message,
  onReset,
  className,
  children,
}: {
  message: string;
  onReset: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const t = useTranslations("ErrorComponent");

  return (
    <div
      className={clsx(
        "flex w-full gap-8 flex-col px-8 items-center justify-center",
        className ? className : "absolute bottom-0 left-0 right-0 h-screen",
      )}
    >
      <h2 className="text-center text-black">{message}</h2>
      <div className="flex flex-col px-10 gap-2">
        <Button
          onPress={onReset}
          startContent={<ArrowPathIcon className="size-4 md:size-5" />}
        >
          {t("try-again-button-text")}
        </Button>
        {children}
      </div>
    </div>
  );
}
