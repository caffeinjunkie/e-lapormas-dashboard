"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
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

interface MainMetricsProps {
  data: MainMetricsType[];
}

type ItemType = { id: string; label: string };

export const MainMetrics = ({ data }: MainMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  // const [selected, setSelected] = useState(data.length - 1);
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
  const [currentData, setCurrentData] = useState<MainMetricsType>();
  const [prevData, setPrevData] = useState<MainMetricsType>();
  const [selectedMenu, setSelectedMenu] = useState<ItemType | undefined>();
  const isAllTime = selectedMenu?.id === "0";

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

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader
        title={t("main-metric-title")}
        subtitle={t("main-metric-description")}
        content={
          <SingleSelectDropdown
            size="sm"
            label={t("main-metric-filter-label")}
            items={mainMetricMenu as ItemType[]}
            triggerClassname="w-fit min-w-[100px]"
            closeOnSelect
            buttonEndContent={
              <ChevronDownIcon className="size-3 stroke-2 text-default-700" />
            }
            selectedKeys={selected}
            onSelectionChange={setSelected as (keys: SharedSelection) => void}
          >
            <p>{selectedMenu?.label}</p>
          </SingleSelectDropdown>
        }
      />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4 flex-grow">
        <StatCard
          header={<MetricHeader withTooltip label="new" />}
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
          header={<MetricHeader withTooltip label="completed" />}
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
          header={<MetricHeader withTooltip label="user-satisfactions" />}
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
          header={<MetricHeader withTooltip label="comparison" />}
          classNames={{
            body: "flex items-center justify-center",
          }}
        >
          <StatCard.Pie data={pieData} />
        </StatCard>
      </div>
    </div>
  );
};
