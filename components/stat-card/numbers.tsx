import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import {
  getMoreOrLessKey,
  getPercentageDifference,
  minifyNumber,
} from "@/utils/string";

interface NumbersProps {
  firstValue: number;
  secondValue: number;
  isEmpty: boolean;
}

export const Numbers = ({ firstValue, secondValue, isEmpty }: NumbersProps) => {
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
        <div className="flex flex-col items-center justify-between">
          <p
            className={clsx("text-center font-bold text-[5rem] lg:text-[5cqw]")}
          >
            {minifyNumber(firstValue)}
          </p>
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
        </div>
      ) : (
        <p className="text-center text-gray-500">{t("empty-text")}</p>
      )}
    </div>
  );
};

Numbers.displayName = "Numbers";
