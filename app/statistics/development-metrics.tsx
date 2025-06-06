"use client";

import { Tab, Tabs } from "@heroui/tabs";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { MetricHeader } from "./components/metric-header";
import { SectionHeader } from "./components/section-header";

import Error from "@/components/error";
import { StatCard } from "@/components/stat-card";
import { MainMetrics } from "@/types/statistics.types";
import { formatMonthYearDate } from "@/utils/date";

interface DevelopmentMetricsProps {
  data: MainMetrics[];
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

export const DevelopmentMetrics = ({
  data,
  isLoading,
  error,
  mutate,
}: DevelopmentMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  const formatter = useFormatter();
  const [dataLimit, setDataLimit] = useState<3 | 6 | 12>(3);
  const series1 = data.map((item) => item.total_new_tasks);
  const series2 = data.map((item) => item.total_finished_tasks);
  const xAxis = data.map((item) =>
    formatMonthYearDate(formatter, item.month_year, false),
  );
  const limitData = (array: any[], limit: number) => {
    return array.slice(-limit);
  };

  const limitedSeries1 = limitData(series1, dataLimit);
  const limitedSeries2 = limitData(series2, dataLimit);
  const limitedXAxis = limitData(xAxis, dataLimit);

  const combinedData = [
    {
      id: "new-tasks",
      color: "#0c64fc",
      label: t("development-metric-new-tasks"),
      data: limitedSeries1,
    },
    {
      id: "finished-tasks",
      color: "#1cc47c",
      label: t("development-metric-finished-tasks"),
      data: limitedSeries2,
    },
  ];

  const renderHeader = () => (
    <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between items-center sm:items-start w-full p-1 pl-2">
      <MetricHeader
        metricName="development"
        label={`multiline-${dataLimit}-months`}
        className="justify-center sm:justify-start w-fit"
      />
      <Tabs
        size="sm"
        aria-label="Development tabs"
        selectedKey={`${dataLimit}-months`}
        color="default"
        variant="solid"
        radius="none"
        className="font-semibold"
        classNames={{
          tabList: "rounded-lg",
          cursor: "rounded-md",
        }}
        onSelectionChange={(key) =>
          setDataLimit(Number(key.toString().split("-")[0]) as 3 | 6 | 12)
        }
      >
        <Tab key="3-months" title={t("development-metric-3-months")} />
        <Tab
          key="6-months"
          title={t("development-metric-6-months")}
          isDisabled={data.length < 4}
        />
        <Tab
          key="12-months"
          title={t("development-metric-12-months")}
          isDisabled={data.length < 7}
        />
      </Tabs>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <SectionHeader
        title={t("development-metric-title")}
        subtitle={t("development-metric-description")}
      />
      <StatCard
        isLoading={isLoading}
        header={renderHeader()}
        classNames={{
          body: "px-0 lg:px-2",
        }}
      >
        {error ? (
          <Error
            className="h-full p-4"
            message={t("error-message")}
            onReset={() => mutate()}
          />
        ) : (
          <StatCard.Line
            labels={limitedXAxis}
            data={combinedData}
            isEmpty={data.length < 2}
          />
        )}
      </StatCard>
    </div>
  );
};
