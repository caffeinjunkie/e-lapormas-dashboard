"use client";

import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { Spinner } from "@heroui/spinner";
import { SharedSelection } from "@heroui/system";
import clsx from "clsx";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { MetricFooter } from "./components/metric-footer";
import { MetricHeader } from "./components/metric-header";
import { SectionHeader } from "./components/section-header";
import { getAllTimeData } from "./utils";

import { StatCard } from "@/components/stat-card";
import { MainMetrics as MainMetricsType } from "@/types/statistics.types";
import { formatMonthYearDate } from "@/utils/date";

type ItemType = { id: string; label: string };

interface MainMetricsProps {
  data: MainMetricsType[];
  isLoading: boolean;
}

export const MainMetrics = ({ data, isLoading }: MainMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  const [currentData, setCurrentData] = useState<MainMetricsType>();
  const [prevData, setPrevData] = useState<MainMetricsType>();
  const [selectedMenu, setSelectedMenu] = useState<ItemType | undefined>();
  const isAllTime = selectedMenu?.id === data.length.toString();
  const [isMounted, setIsMounted] = useState(false);
  const formatter = useFormatter();

  const defaultMenu = [
    {
      label: t("main-metric-menu-all-time"),
      id: data.length.toString(),
    },
  ];
  const mainMetricMenu = [
    ...(data?.map((item, index) => ({
      id: index.toString(),
      label: formatMonthYearDate(formatter, item.month_year),
    })) || []),
    ...defaultMenu,
  ];

  const [selected, setSelected] = useState(
    new Set([mainMetricMenu[mainMetricMenu.length - 2].id.toString()]),
  );

  const currentDataMemo = useMemo(() => {
    return data?.[Number(selected.values().next().value)];
  }, [selected, data, selectedMenu]);

  const prevDataMemo = useMemo(() => {
    return data?.[Number(selected.values().next().value) - 1];
  }, [selected, data, selectedMenu]);

  const pieData = useMemo(() => {
    if (!data) return [];
    return [
      {
        id: "1",
        label: t("main-metric-pending-text"),
        color: "#f38383",
        value: currentData?.current_pending_tasks,
      },
      {
        id: "2",
        label: t("main-metric-in-progress-text"),
        color: "#ffb477",
        value: currentData?.current_in_progress_tasks,
      },
      {
        id: "3",
        label: t("main-metric-completed-text"),
        color: "#19c37e",
        value: currentData?.current_completed_tasks,
      },
    ];
  }, [currentData, data, t]);

  useEffect(() => {
    setIsMounted(true);
    if (!data) return;
    const currentMenu = mainMetricMenu.find((item) => selected.has(item.id));
    setSelectedMenu(currentMenu);
    if (currentMenu?.id === data.length.toString()) {
      setCurrentData(getAllTimeData(data));
      return;
    }
    setCurrentData(currentDataMemo);
    setPrevData(prevDataMemo!);
  }, [selected]);

  if (!isMounted) {
    return (
      <div className="flex w-full absolute left-0 items-center justify-center bottom-0 h-screen">
        <Spinner />
      </div>
    );
  }

  const items = [
    {
      name: "new",
      withFooter: true,
      firstValue: currentData?.total_new_tasks || 0,
      secondValue: prevData?.total_new_tasks || 0,
      children: (
        <StatCard.Numbers
          isEmpty={!data}
          value={currentData?.total_new_tasks || 0}
        />
      ),
    },
    {
      name: "completed",
      withFooter: true,
      firstValue: currentData?.total_finished_tasks || 0,
      secondValue: prevData?.total_finished_tasks || 0,
      children: (
        <StatCard.Numbers
          isEmpty={!data}
          value={currentData?.total_finished_tasks || 0}
        />
      ),
    },
    {
      name: "user-satisfactions",
      withFooter: true,
      firstValue: currentData?.user_satisfactions || 0,
      secondValue: prevData?.user_satisfactions || 0,
      children: (
        <StatCard.Percentage
          isEmpty={!data}
          value={currentData?.user_satisfactions || 0}
        />
      ),
    },
    {
      name: "comparison",
      children: (
        <StatCard.Pie
          data={pieData}
          withLegend
          withCenterLabel
          type="sliced-donut"
        />
      ),
    },
  ];

  const renderItem = (
    name: string,
    children: React.ReactNode,
    withFooter: boolean = false,
    firstValue?: number,
    secondValue?: number,
  ) => (
    <StatCard
      key={name}
      isLoading={isLoading}
      header={
        <MetricHeader withTooltip label={name} className="justify-center" />
      }
      footer={
        withFooter && (
          <MetricFooter
            firstValue={firstValue || 0}
            secondValue={secondValue || 0}
            name={name}
            isAllTime={isAllTime}
          />
        )
      }
      classNames={{
        root: "min-h-24 lg:min-h-64",
        header: "px-4",
        body: "flex items-center justify-center",
      }}
    >
      {children}
    </StatCard>
  );

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader
        title={t("main-metric-title")}
        subtitle={t("main-metric-description")}
        content={
          <Select
            size="sm"
            items={mainMetricMenu as ItemType[]}
            selectedKeys={selected}
            selectionMode="single"
            disabledKeys={selected}
            className="w-full max-w-40"
            onSelectionChange={setSelected as (keys: SharedSelection) => void}
          >
            {(item) => (
              <SelectItem key={item.id} className="outline-none">
                {item.label}
              </SelectItem>
            )}
          </Select>
        }
      />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4 flex-grow">
        {items.map((item) =>
          renderItem(
            item.name,
            item.children,
            item.withFooter,
            item.firstValue,
            item.secondValue,
          ),
        )}
      </div>
    </div>
  );
};
