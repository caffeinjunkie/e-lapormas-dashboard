import { useTranslations } from "next-intl";

import { MetricHeader } from "./components/metric-header";
import { SectionHeader } from "./components/section-header";

import { StatCard } from "@/components/stat-card";
import { CategoryMetrics, LocationMetrics } from "@/types/statistics.types";

interface DemographyMetricsProps {
  data: {
    locationMetrics: LocationMetrics[];
    categoryMetrics: CategoryMetrics[];
  };
}

export const DemographyMetrics = ({ data }: DemographyMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  const series1 = data.categoryMetrics.map(
    (item) => item.total_tasks - item.total_finished_tasks,
  );
  const series2 = data.categoryMetrics.map((item) => item.total_finished_tasks);
  const xAxis = data.categoryMetrics.map((item) =>
    t(`demography-metric-category-${item.category}`),
  );

  const combinedCategory = [
    {
      id: "unfinished-tasks",
      color: "#faa95a",
      label: t("demography-metric-unfinished-task-text"),
      data: series1,
    },
    {
      id: "finished-tasks",
      color: "#1cc47c",
      label: t("demography-metric-finished-tasks-text"),
      data: series2,
    },
  ];

  return (
    <div className="flex flex-col gap-2 ">
      <SectionHeader
        title={t("demography-metric-title")}
        subtitle={t("demography-metric-description")}
      />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 w-full">
        <StatCard
          header={
            <MetricHeader
              metricName="demography"
              label="category"
              className="justify-center"
              withTooltip
            />
          }
        >
          <StatCard.Bar
            isEmpty={data.categoryMetrics.length === 0}
            data={combinedCategory}
            labels={xAxis}
          />
        </StatCard>
        <StatCard
          header={
            <MetricHeader
              metricName="demography"
              label="location"
              className="justify-center"
              withTooltip
            />
          }
        >
          Content 6
        </StatCard>
      </div>
    </div>
  );
};
