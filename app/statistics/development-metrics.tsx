import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { MetricHeader } from "./components/metric-header";
import { SectionHeader } from "./components/section-header";

import { mainMetrics } from "@/app/statistics/mock-data";
import { StatCard } from "@/components/stat-card";
import { formatMonthYearDate } from "@/utils/date";

interface DevelopmentMetricsProps {
  data: typeof mainMetrics;
}

export const DevelopmentMetrics = ({ data }: DevelopmentMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  const series1 = data.map((item) => item.total_new_tasks);
  const series2 = data.map((item) => item.total_finished_tasks);
  const allSameYear =
    data.length > 0 &&
    data.every((item) => {
      const date = new Date(item.month_year);
      return date.getFullYear() === new Date(data[0].month_year).getFullYear();
    });
  const xAxis = data.map((item) =>
    formatMonthYearDate(item.month_year, allSameYear),
  );

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
      <StatCard
        header={<MetricHeader metricName="development" label="multiline" />}
      >
        <StatCard.Line labels={xAxis} data={combinedData} isEmpty={data.length < 2} />
      </StatCard>
    </div>
  );
};
