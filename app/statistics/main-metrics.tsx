"use client";

import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { mainMetrics } from "@/app/statistics/mock-data";
import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";
import { minifyNumber } from "@/utils/string";

interface MainMetricsProps {
  data: typeof mainMetrics;
}

export const MainMetrics = ({ data }: MainMetricsProps) => {
  const t = useTranslations("StatisticsPage");
  const [selected, setSelected] = useState(0);

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
      <div className="grid gap-4 md:grid-cols-2 lg:h-[50vh]">
        <StatCard header={renderHeader(t("main-metric-new-header-text"))}>
          <div
            className={clsx(
              "flex flex-col items-center justify-center",
              data.length === 0 ? "h-full" : "",
            )}
          >
            {data.length > 0 ? (
              <>
                <p className={clsx("text-center font-bold text-[5rem]")}>
                  {minifyNumber(data[selected]?.total_new_tasks)}
                </p>
                <span className={clsx("text-xs flex flex-row gap-1")}>
                  37% <p className="text-default-500">more than last month</p>
                </span>
              </>
            ) : (
              <p className="text-center text-gray-500">
                {t("main-metric-empty-text")}
              </p>
            )}
          </div>
        </StatCard>
        <StatCard header={renderHeader(t("main-metric-completed-header-text"))}>
          <div
            className={clsx(
              "flex flex-col items-center justify-center",
              data.length === 0 ? "h-full" : "",
            )}
          >
            {data.length > 0 ? (
              <p className={clsx("text-center font-bold text-[5rem]")}>
                {data[selected]?.total_finished_tasks}
              </p>
            ) : (
              <p className="text-center text-gray-500">
                {t("main-metric-empty-text")}
              </p>
            )}
          </div>
        </StatCard>
        <StatCard
          header={renderHeader(t("main-metric-user-satisfactions-header-text"))}
        >
          <div
            className={clsx(
              "flex flex-col items-center justify-center",
              data.length === 0 ? "h-full" : "",
            )}
          >
            {data.length > 0 ? (
              <span
                className={clsx(
                  "text-center flex flex-row",
                  selected === null ? "text-gray-500" : "font-bold text-[4rem]",
                )}
              >
                {data[selected]?.user_satisfactions
                  ?.toFixed(1)
                  .replace(".0", "")}
                <p className={clsx(title({ className: "pt-5 text-xl" }))}>%</p>
              </span>
            ) : (
              <p className="text-center text-gray-500">
                {t("main-metric-empty-text")}
              </p>
            )}
          </div>
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
