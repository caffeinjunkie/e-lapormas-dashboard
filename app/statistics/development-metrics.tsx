import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { SectionHeader } from "./section-header";

import { mainMetrics } from "@/app/statistics/mock-data";
import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";

interface DevelopmentMetricsProps {
  data: typeof mainMetrics;
}

export const DevelopmentMetrics = ({ data }: DevelopmentMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  const series = data.map((item, index) => ({
    id: index.toString(),
    key: item.month_year,
    data: item.total_new_tasks,
  }));

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader
        title={t("development-metric-title")}
        subtitle={t("development-metric-description")}
      />
      <StatCard header="Metric 7" footer="Details">
        {/* <StatCard.Line id="multi" series={series} /> */}
      </StatCard>
    </div>
  );
};
