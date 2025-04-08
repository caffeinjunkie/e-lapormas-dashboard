import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";
import { mainMetrics } from "@/app/statistics/mock-data";

interface DevelopmentMetricsProps {
  data: typeof mainMetrics;
}

export const DevelopmentMetrics = ({
  data
}: DevelopmentMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <p className={clsx(title({ className: "text-md" }))}>
          {t("development-metric-title")}
        </p>
        <p className={clsx(subtitle({ className: "text-sm" }))}>
          {t("development-metric-description")}
        </p>
      </div>
      <StatCard header="Metric 7" footer="Details">
        Content 7
      </StatCard>
    </div>
  );
};
