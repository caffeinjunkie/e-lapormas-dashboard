import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/tooltip";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";

interface MetricHeaderProps {
  metricName?: string;
  label: string;
  className?: string;
  withTooltip?: boolean;
}

export const MetricHeader = ({
  metricName = "main",
  label,
  className,
  withTooltip = false,
}: MetricHeaderProps) => {
  const t = useTranslations("StatisticsPage");
  return (
    <span
      className={clsx(
        title({ className: "text-sm w-full" }),
        "inline-flex flex-wrap items-baseline",
        className,
      )}
    >
      {withTooltip ? (
        t(`${metricName}-metric-${label}-header-text`)
          .split(" ")
          .map((word, i, arr) => (
            <span key={i} className="mr-1">
              {word}
              {i === arr.length - 1 && (
                <Tooltip
                  content={t(`${metricName}-metric-${label}-tooltip-text`)}
                >
                  <InformationCircleIcon className="size-4 stroke-2 text-default-400 ml-1 mb-0.5 inline-block" />
                </Tooltip>
              )}
            </span>
          ))
      ) : (
        <p className="text-center">
          {t(`${metricName}-metric-${label}-header-text`)}
        </p>
      )}
    </span>
  );
};
