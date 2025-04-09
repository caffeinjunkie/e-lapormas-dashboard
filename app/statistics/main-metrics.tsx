"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "@heroui/dropdown";
import { SharedSelection } from "@heroui/system";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getAllTimeData } from "./utils";

import { mainMetrics } from "@/app/statistics/mock-data";
import { subtitle, title } from "@/components/primitives";
import { SingleSelectDropdown } from "@/components/single-select-dropdown";
import { StatCard } from "@/components/stat-card";
import { MainMetrics as MainMetricsType } from "@/types/statistics.types";

interface MainMetricsProps {
  data: typeof mainMetrics;
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
      label: item.month_year,
    })),
  ];
  const { selected, setSelected } = SingleSelectDropdown.useDropdown(
    new Set([mainMetricMenu[mainMetricMenu.length - 1].id.toString()]),
  );
  const [currentData, setCurrentData] = useState<MainMetricsType>();
  const [prevData, setPrevData] = useState<MainMetricsType>();
  const [selectedMenu, setSelectedMenu] = useState<ItemType | undefined>();
  const isAllTime = selectedMenu?.id === "0";

  useEffect(() => {
    const currentMenu = mainMetricMenu.find((item) => selected.has(item.id));
    setSelectedMenu(currentMenu);
    if (currentMenu?.id === "0") {
      const allTimeData = getAllTimeData(data);
      setCurrentData(allTimeData);
      return;
    }
    setCurrentData(data[Number(selected.values().next().value) - 1]);
    setPrevData(data[Number(selected.values().next().value) - 2]);
  }, [selected]);

  const renderHeader = (text: string) => (
    <p className={clsx(title({ className: "text-sm text-center w-full" }))}>
      {text}
    </p>
  );

  const formatPieData = () => {
    if (data.length === 0) return [];
    return [
      {
        key: t("main-metric-pending-text"),
        color: "#f38383",
        data: currentData?.current_pending_tasks,
      },
      {
        key: t("main-metric-in-progress-text"),
        color: "#ffb477",
        data: currentData?.current_in_progress_tasks,
      },
      {
        key: t("main-metric-completed-text"),
        color: "#19c37e",
        data: currentData?.current_completed_tasks,
      },
    ];
  };

  return (
    <div className="flex flex-col gap-2 border-r-0 pr-0 pb-0 lg:border-r-1 border-default-200 lg:pr-3 lg:pb-3">
      <div className="flex flex-row items-start justify-between lg:min-h-16">
        <div className="flex flex-col">
          <p className={clsx(title({ className: "text-md" }))}>
            {t("main-metric-title")}
          </p>
          <p className={clsx(subtitle({ className: "text-sm" }))}>
            {t("main-metric-description")}
          </p>
        </div>
        <SingleSelectDropdown
          size="sm"
          label={t("main-metric-filter-label")}
          items={mainMetricMenu as ItemType[]}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          buttonEndContent={
            <ChevronDownIcon className="size-4 stroke-2 text-default-700" />
          }
          selectedKeys={selected}
          onSelectionChange={setSelected as (keys: SharedSelection) => void}
        >
          <p>{selectedMenu?.label}</p>
        </SingleSelectDropdown>
      </div>
      <div className="grid gap-4 md:grid-cols-2 flex-grow">
        <StatCard
          header={renderHeader(t("main-metric-new-header-text"))}
          classNames={{
            body: "flex h-fit items-center justify-center",
          }}
        >
          <StatCard.Numbers
            firstValue={currentData?.total_new_tasks || 0}
            secondValue={prevData?.total_new_tasks || 0}
            isAllTime={isAllTime}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={renderHeader(t("main-metric-completed-header-text"))}
          classNames={{
            body: "flex h-fit items-center justify-center",
          }}
        >
          <StatCard.Numbers
            firstValue={currentData?.total_finished_tasks || 0}
            secondValue={prevData?.total_finished_tasks || 0}
            isAllTime={isAllTime}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={renderHeader(t("main-metric-user-satisfactions-header-text"))}
          classNames={{
            header: "px-12 lg:px-4",
            body: "flex h-fit items-center justify-center",
          }}
        >
          <StatCard.Percentage
            firstValue={currentData?.user_satisfactions || 0}
            secondValue={prevData?.user_satisfactions || 0}
            isAllTime={isAllTime}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={renderHeader(t("main-metric-comparison-header-text"))}
          classNames={{
            body: "flex items-center justify-center",
          }}
        >
          <StatCard.Pie
            id="main-metric-comparison"
            height={120}
            width={200}
            doughnut
            data={formatPieData()}
          />
        </StatCard>
      </div>
    </div>
  );
};
