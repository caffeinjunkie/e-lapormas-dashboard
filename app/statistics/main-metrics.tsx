import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";
import { mainMetrics } from "@/app/statistics/mock-data";

interface MainMetricsProps {
  data: typeof mainMetrics;
}

export const MainMetrics = ({
  data
}: MainMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  return (
    <div className="flex flex-col gap-2 border-r-0 pr-0 pb-0 lg:border-r-1 border-default-200 lg:pr-3 lg:pb-3">
      <div className="flex flex-row items-start justify-between lg:min-h-16">
        <div className="flex flex-col">
          <p className={clsx(title({ className: "text-md" }))}>
            {t("main-metric-title")}
          </p>
          <p className={clsx(subtitle({ className: "text-sm" }))}>
            {t("main-metric-description")}
          </p>
        </div>
        <div className="flex h-8 w-56 bg-red-500" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:h-[50vh]">
        <StatCard
          header={
            <p
              className={clsx(
                title({ className: "text-sm text-center w-full" }),
              )}
            >
              {t("main-metric-new-header-text")}
            </p>
          }
          footer="Details"
          className=""
        >
          Content 1
        </StatCard>
        <StatCard
          header={
            <p
              className={clsx(
                title({ className: "text-sm text-center w-full" }),
              )}
            >
              {t("main-metric-completed-header-text")}
            </p>
          }
          footer="Details"
          className=""
        >
          Content 2
        </StatCard>
        <StatCard header="Metric 3" footer="Details">
          Content 3
        </StatCard>
        <StatCard header="Metric 4" footer="Details">
          Content 4
        </StatCard>
      </div>
    </div>
  );
};
