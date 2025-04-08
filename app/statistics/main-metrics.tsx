"use client";

import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { mainMetrics } from "@/app/statistics/mock-data";
import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";
import {
  getMoreOrLessKey,
  getPercentageDifference,
  minifyNumber,
} from "@/utils/string";

interface MainMetricsProps {
  data: typeof mainMetrics;
}

export const MainMetrics = ({ data }: MainMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  const [selected, setSelected] = useState(data.length - 1);

  const renderHeader = (text: string) => (
    <p className={clsx(title({ className: "text-sm text-center w-full" }))}>
      {text}
    </p>
  );

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
        <div className="flex h-8 w-56 bg-red-500" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 flex-grow">
        <StatCard header={renderHeader(t("main-metric-new-header-text"))}>
          <StatCard.Numbers
            firstValue={data[selected]?.total_new_tasks}
            secondValue={data[selected - 1]?.total_new_tasks}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard header={renderHeader(t("main-metric-completed-header-text"))}>
          <StatCard.Numbers
            firstValue={data[selected]?.total_finished_tasks}
            secondValue={data[selected - 1]?.total_finished_tasks}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={renderHeader(t("main-metric-user-satisfactions-header-text"))}
        >
          <StatCard.Percentage
            firstValue={data[selected]?.user_satisfactions}
            secondValue={data[selected - 1]?.user_satisfactions}
            isEmpty={data.length === 0}
          />
        </StatCard>
        <StatCard
          header={renderHeader(t("main-metric-comparison-header-text"))}
        >
          Content 4
        </StatCard>
      </div>
    </div>
  );
};
