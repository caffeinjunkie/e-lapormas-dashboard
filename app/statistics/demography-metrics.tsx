import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { colors } from "../config";
import { MetricHeader } from "./components/metric-header";
import { SectionHeader } from "./components/section-header";

import Error from "@/components/error";
import { StatCard } from "@/components/stat-card";
import { Legends } from "@/components/stat-card/legends";
import { CategoryMetrics, LocationMetrics } from "@/types/statistics.types";

interface DemographyMetricsProps {
  data: {
    categoryData: CategoryMetrics[];
    locationData: LocationMetrics[];
  };
  mutate?: {
    category: () => void;
    location: () => void;
  };
  error?: {
    category?: unknown;
    location?: unknown;
  };
  isLoading?: {
    category: boolean;
    location: boolean;
  };
}

export const DemographyMetrics = ({
  data,
  error,
  mutate,
  isLoading,
}: DemographyMetricsProps) => {
  const { categoryData, locationData } = data;
  const t = useTranslations("StatisticsPage");
  const series1 = categoryData.map(
    (item) => item.total_tasks - item.total_finished_tasks,
  );
  const series2 = categoryData.map((item) => item.total_finished_tasks);
  const labels = categoryData.map((item) =>
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

  const memoizedTotalTasksData = useMemo(
    () =>
      locationData
        .map((item, index) => ({
          id: item.location,
          label: item.location,
          color: colors[index] || "#ffffff",
          value: item.total_tasks,
        }))
        .sort((a, b) => a.value - b.value),
    [locationData],
  );

  const legendData = [
    ...memoizedTotalTasksData.slice(-7),
    {
      id: "other",
      label: t("other-text"),
      color: colors[7] || "#ffffff",
      value: 0,
    },
  ];

  const memoizedFinishedTasksData = useMemo(
    () =>
      locationData
        .map((item, index) => ({
          id: item.location,
          label: item.location,
          color: colors[index] || "#ffffff",
          value: item.total_finished_tasks,
        }))
        .sort((a, b) => a.value - b.value),
    [locationData],
  );

  return (
    <div className="flex flex-col gap-2 ">
      <SectionHeader
        title={t("demography-metric-title")}
        subtitle={t("demography-metric-description")}
      />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 w-full">
        <StatCard
          isLoading={isLoading?.category}
          header={
            <MetricHeader
              metricName="demography"
              label="category"
              className="justify-center"
              withTooltip
            />
          }
        >
          {error?.category ? (
            <Error
              className="h-full"
              message={t("error-message")}
              onReset={() => mutate?.category()}
            />
          ) : (
            <StatCard.Bar
              isEmpty={categoryData.length === 0}
              data={combinedCategory}
              labels={labels}
              withLegend
            />
          )}
        </StatCard>
        <StatCard
          isLoading={isLoading?.location}
          classNames={{
            body: "flex flex-row items-center justify-center",
          }}
          header={
            <MetricHeader
              metricName="demography"
              label="location"
              className="justify-center"
              withTooltip
            />
          }
          footer={
            <div className="w-full">
              <Legends data={legendData} size="sm" />
            </div>
          }
        >
          {error?.location ? (
            <Error
              className="h-full p-4"
              message={t("error-message")}
              onReset={() => mutate?.location()}
            />
          ) : (
            <>
              <StatCard.Pie
                data={memoizedTotalTasksData}
                width={180}
                height={150}
                content={t("demography-metric-location-total-content-text")}
              />
              <StatCard.Pie
                data={memoizedFinishedTasksData}
                width={180}
                height={150}
                content={t("demography-metric-location-finished-content-text")}
              />
            </>
          )}
        </StatCard>
      </div>
    </div>
  );
};
