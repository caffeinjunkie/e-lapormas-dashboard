import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { colors } from "../config";
import { MetricHeader } from "./components/metric-header";
import { SectionHeader } from "./components/section-header";

import Error from "@/components/error";
import { StatCard } from "@/components/stat-card";
import { LegendType, Legends } from "@/components/stat-card/legends";
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
  const limit = 6;
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

  const sliceData = (
    data: typeof memoizedTotalTasksData | typeof memoizedFinishedTasksData,
  ) => {
    if (data.length <= limit) return data;
    const droppedData = data.slice(0, data.length - limit);
    const slicedData = data.slice(-limit);
    const droppedDataSum = droppedData.reduce(
      (acc, curr) => acc + curr.value,
      0,
    );
    return [
      ...slicedData,
      {
        id: "other",
        label: t("other-text"),
        color: colors[6] || "#ffffff",
        value: droppedDataSum,
      },
    ];
  };

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
            body: "flex flex-row items-center justify-center @container",
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
              <Legends
                data={sliceData(memoizedTotalTasksData) as LegendType[]}
                size="sm"
              />
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
            <div className="flex flex-col @sm:flex-row @sm:pt-2 @lg:pt-0 items-center justify-center gap-4">
              <StatCard.Pie
                data={sliceData(memoizedTotalTasksData)}
                width={180}
                limit={4}
                height={150}
                content={t("demography-metric-location-total-content-text")}
              />
              <StatCard.Pie
                data={sliceData(memoizedFinishedTasksData)}
                width={180}
                height={150}
                content={t("demography-metric-location-finished-content-text")}
              />
            </div>
          )}
        </StatCard>
      </div>
    </div>
  );
};
