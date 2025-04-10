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
  const series1 = data.map((item) => item.total_new_tasks);
  const series2 = data.map((item) => item.total_finished_tasks);
  const xAxis = data.map((item) => item.month_year);
  console.log(series1, series2);

  const combinedData = [
    {
      id: "new-tasks",
      color: "#0c64fc",
      label: t("development-metric-new-tasks"),
      data: series1,
    },
    {
      id: "finished-tasks",
      color: "#1cc47c",
      label: t("development-metric-finished-tasks"),
      data: series2,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader
        title={t("development-metric-title")}
        subtitle={t("development-metric-description")}
      />
      <StatCard header="Metric 7">
        <StatCard.Line labels={xAxis} data={combinedData} />
      </StatCard>
    </div>
  );
};
