import clsx from "clsx";
import { useTranslations } from "next-intl";

import { minifyNumber } from "@/utils/string";

interface NumbersProps {
  value: number;
  isEmpty: boolean;
}

export const Numbers = ({ value, isEmpty }: NumbersProps) => {
  const t = useTranslations("StatCard");

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center",
        !isEmpty ? "h-full" : "",
      )}
    >
      {!isEmpty ? (
        <p className={clsx("text-center font-bold text-[5rem] lg:text-[5cqw]")}>
          {minifyNumber(value)}
        </p>
      ) : (
        <p className="text-center text-gray-500">{t("empty-text")}</p>
      )}
    </div>
  );
};

Numbers.displayName = "Numbers";
