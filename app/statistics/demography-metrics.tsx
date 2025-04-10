import { useTranslations } from "next-intl";

import { SectionHeader } from "./components/section-header";

import { categoryMetrics, locationMetrics } from "@/app/statistics/mock-data";
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
    <div className="flex flex-col gap-2 ">
      <SectionHeader
        title={t("demography-metric-title")}
        subtitle={t("demography-metric-description")}
      />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 w-full">
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
