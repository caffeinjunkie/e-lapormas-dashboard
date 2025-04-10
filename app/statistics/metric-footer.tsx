import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { getMoreOrLessKey, getPercentageDifference } from "@/utils/string";

interface MetricFooterProps {
  firstValue: number;
  secondValue: number;
  isAllTime: boolean;
}

export const MetricFooter = ({
  firstValue,
  secondValue,
  isAllTime,
}: MetricFooterProps) => {
  const t = useTranslations("StatisticsPage");
  const isMore = Number(getPercentageDifference(firstValue, secondValue)) > 0;

  return (
    <div className="w-full mt-auto">
      <p className="text-default-500 text-xs text-center">
        {isAllTime
          ? t("all-time-percentage-text")
          : t.rich(getMoreOrLessKey(firstValue, secondValue), {
              value: getPercentageDifference(firstValue, secondValue).replace(
                "-",
                "",
              ),
              styled: (chunks: ReactNode) => (
                <strong
                  className={clsx(
                    "inline-flex items-baseline",
                    firstValue === secondValue
                      ? "text-default-500"
                      : isMore
                        ? "text-success"
                        : "text-red-500",
                  )}
                >
                  {firstValue === secondValue || (
                    <span className="mr-0.5 self-center">
                      {isMore ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                      )}
                    </span>
                  )}
                  {chunks}
                </strong>
              ),
            })}
      </p>
    </div>
  );
};
