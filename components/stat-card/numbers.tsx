import clsx from "clsx";
import { useTranslations } from "next-intl";

import { minifyNumber } from "@/utils/string";

interface NumbersProps {
  value: number;
  isEmpty: boolean;
  size?: "sm" | "md" | "lg";
}

export const Numbers = ({ value, isEmpty, size = "md" }: NumbersProps) => {
  const t = useTranslations("StatCard");

  const textSize = {
    sm: "text-[4.5rem] lg:text-[6cqw]",
    md: "text-[5rem] lg:text-[6cqw]",
    lg: "text-[6rem] lg:text-[8cqw]",
  }[size];

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center",
        !isEmpty ? "h-full" : "",
      )}
    >
      {!isEmpty ? (
        <p className={clsx("text-center font-bold", textSize)}>
          {minifyNumber(value)}
        </p>
      ) : (
        <p className="text-center text-gray-500">{t("empty-text")}</p>
      )}
    </div>
  );
};

Numbers.displayName = "Numbers";
