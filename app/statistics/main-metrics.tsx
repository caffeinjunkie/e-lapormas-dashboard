"use client";

import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { SharedSelection } from "@heroui/system";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { MetricFooter } from "./components/metric-footer";
import { MetricHeader } from "./components/metric-header";
import { SectionHeader } from "./components/section-header";
import { getAllTimeData } from "./utils";

import { SingleSelectDropdown } from "@/components/single-select-dropdown";
import { StatCard } from "@/components/stat-card";
import { MainMetrics as MainMetricsType } from "@/types/statistics.types";
import { formatMonthYearDate } from "@/utils/date";

type ItemType = { id: string; label: string };

export const MainMetrics = ({ data }: { data: MainMetricsType[] }) => {
  const t = useTranslations("StatisticsPage");
  const [currentData, setCurrentData] = useState<MainMetricsType>();
  const [prevData, setPrevData] = useState<MainMetricsType>();
  const [selectedMenu, setSelectedMenu] = useState<ItemType | undefined>();;
  const isAllTime = selectedMenu?.id === "0";
  const [isMounted, setIsMounted] = useState(false);

  const defaultMenu = [
    {
      label: t("main-metric-menu-all-time"),
      id: "0",
    },
  ];
  const mainMetricMenu = [
    ...defaultMenu,
    ...data.map((item, index) => ({
      id: (index + 1).toString(),
      label: formatMonthYearDate(item.month_year),
    })),
  ];
  const { selected, setSelected } = SingleSelectDropdown.useDropdown(
    new Set([mainMetricMenu[mainMetricMenu.length - 1].id.toString()]),
  );

  const currentDataMemo = useMemo(() => {
    return data[Number(selected.values().next().value) - 1];
  }, [selected, data, selectedMenu]);

  const prevDataMemo = useMemo(() => {
    return data[Number(selected.values().next().value) - 2];
  }, [selected, data, selectedMenu]);

  const pieData = useMemo(() => {
    if (data.length === 0) return [];
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
    if (data.length === 0) return;
    const currentMenu = mainMetricMenu.find((item) => selected.has(item.id));
    setSelectedMenu(currentMenu);
    if (currentMenu?.id === "0") {
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
        <StatCard
          header={
            <MetricHeader withTooltip label="new" className="justify-center" />
          }
          footer={
            <MetricFooter
              firstValue={currentData?.total_new_tasks || 0}
              secondValue={prevData?.total_new_tasks || 0}
              name="new-reports"
              isAllTime={isAllTime}
            />
          }
          classNames={{
            body: "flex h-fit items-center justify-center",
          }}
        >
          <StatCard.Numbers
            value={currentData?.total_new_tasks || 0}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={
            <MetricHeader
              withTooltip
              label="completed"
              className="justify-center"
            />
          }
          footer={
            <MetricFooter
              firstValue={currentData?.total_finished_tasks || 0}
              secondValue={prevData?.total_finished_tasks || 0}
              name="finished-reports"
              isAllTime={isAllTime}
            />
          }
          classNames={{
            body: "flex h-fit items-center justify-center",
          }}
        >
          <StatCard.Numbers
            value={currentData?.total_finished_tasks || 0}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={
            <MetricHeader
              withTooltip
              label="user-satisfactions"
              className="justify-center"
            />
          }
          classNames={{
            header: "px-4",
            body: "flex h-fit items-center justify-center",
          }}
          footer={
            <MetricFooter
              firstValue={currentData?.user_satisfactions || 0}
              secondValue={prevData?.user_satisfactions || 0}
              name="user-satisfactions"
              isAllTime={isAllTime}
            />
          }
        >
          <StatCard.Percentage
            value={currentData?.user_satisfactions || 0}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={
            <MetricHeader
              withTooltip
              label="comparison"
              className="justify-center"
            />
          }
          classNames={{
            body: "flex items-center justify-center",
          }}
        >
          <StatCard.Pie
            data={pieData}
            withLegend
            withCenterLabel
            type="sliced-donut"
          />
        </StatCard>
      </div>
    </div>
  );
};
