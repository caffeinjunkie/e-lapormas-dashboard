import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { title } from "../primitives";

import {
  getMoreOrLessKey,
  getPercentageDifference,
  minifyNumber,
} from "@/utils/string";

interface PercentageProps {
  firstValue: number;
  secondValue: number;
  isEmpty: boolean;
}

export const Percentage = ({
  firstValue,
  secondValue,
  isEmpty,
}: PercentageProps) => {
  const t = useTranslations("StatCard");
  const difference = getPercentageDifference(firstValue, secondValue);
  const isMore = Number(difference) > 0;
  const icon = isMore ? (
    <ArrowTrendingUpIcon className="w-4 h-4 text-success" />
  ) : (
    <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
  );

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center",
        !isEmpty ? "h-full" : "",
      )}
    >
      {!isEmpty ? (
        <>
          <span
            className={clsx(
              "text-center flex flex-row",
              "font-bold text-[4.5rem]",
            )}
          >
            {firstValue.toFixed(1).replace(".0", "")}
            <p className={clsx(title({ className: "pt-5 text-xl" }))}>%</p>
          </span>
          {secondValue > 0 && (
            <p className="text-default-500 text-xs text-center">
              {t.rich(getMoreOrLessKey(firstValue, secondValue), {
                value: difference.replace("-", ""),
                styled: (chunks) => (
                  <strong
                    className={clsx(
                      "inline-flex items-baseline",
                      isMore ? "text-success" : "text-red-500",
                    )}
                  >
                    <span className="mr-0.5 self-center">{icon}</span>
                    {chunks}
                  </strong>
                ),
              })}
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">{t("empty-text")}</p>
      )}
    </div>
  );
};

Percentage.displayName = "Percentage";
