import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { categoryMetrics, locationMetrics } from "@/app/statistics/mock-data";
import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";

interface DemographyMetricsProps {
  data: {
    locationMetrics: typeof locationMetrics;
    categoryMetrics: typeof categoryMetrics;
  };
}

export const DemographyMetrics = ({ data }: DemographyMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col lg:min-h-16">
        <p className={clsx(title({ className: "text-md" }))}>
          {t("demography-metric-title")}
        </p>
        <p className={clsx(subtitle({ className: "text-sm" }))}>
          {t("demography-metric-description")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-rows-2 lg:h-[50vh]">
        <StatCard header="Metric 5" footer="Details">
          Content 5
        </StatCard>
        <StatCard header="Metric 6" footer="Details">
          Content 6
        </StatCard>
      </div>
    </div>
  );
};
