import clsx from "clsx";
import { useTranslations } from "next-intl";

import { title } from "../primitives";

interface PercentageProps {
  value: number;
  isEmpty: boolean;
}

export const Percentage = ({ value, isEmpty }: PercentageProps) => {
  const t = useTranslations("StatCard");

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center mx-auto",
        !isEmpty ? "h-full" : "",
      )}
    >
      {!isEmpty ? (
        <div className="flex flex-col items-center justify-between h-full w-full">
          <span
            className={clsx(
              "text-center inline-flex h-full self-center items-baseline lg:items-center",
              "font-bold text-[4.5rem] lg:text-[6cqw]",
            )}
          >
            {value.toFixed(1).replace(".0", "")}
            <p
              className={clsx(
                title({ className: "lg:pt-5 text-3xl lg:text-[2cqw]" }),
              )}
            >
              %
            </p>
          </span>
        </div>
      ) : (
        <p className="text-center text-gray-500">{t("empty-text")}</p>
      )}
    </div>
  );
};

Percentage.displayName = "Percentage";
