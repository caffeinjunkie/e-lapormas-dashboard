import { useTranslations } from "next-intl";

import { SectionHeader } from "./section-header";

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
      <StatCard header="Metric 5" footer="Details">
        Content 5
      </StatCard>
      {/* <div className="grid gap-4 md:grid-rows-2 w-full">
        <StatCard header="Metric 5" footer="Details">
          Content 5
        </StatCard>
        <StatCard header="Metric 6" footer="Details">
          Content 6
        </StatCard>
      </div> */}
    </div>
  );
};
