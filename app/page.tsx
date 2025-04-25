"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useSWR from "swr";

import { swrConfig } from "./config";
import { MetricFooter } from "./statistics/components/metric-footer";

import { fetchAdmins } from "@/api/admin";
import { fetchGeneralStatistics } from "@/api/statistics";
import Error from "@/components/error";
import { TrophyIcon } from "@/components/icons";
import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";
import { AdminData } from "@/types/user.types";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  const [mainMetricTab, setMainMetricTab] = useState("0");

  const {
    data: adminsData,
    error: adminsError,
    isLoading: isAdminsLoading,
    mutate: mutateAdmins,
  } = useSWR(["admins"], () => fetchAdmins(), swrConfig);

  const {
    data: mainMetricsData,
    error: mainMetricsError,
    isLoading: isMainMetricsLoading,
    mutate: mutateMainMetrics,
  } = useSWR(
    ["main-metrics-dashboard"],
    () => fetchGeneralStatistics(0, 2, "desc"),
    swrConfig,
  );

  const mainMetricItems = [
    {
      name: "new",
      withFooter: true,
      firstValue:
        mainMetricsData?.[mainMetricsData.length - 2]?.total_new_tasks || 0,
      secondValue:
        mainMetricsData?.[mainMetricsData.length - 1]?.total_new_tasks || 0,
      children: (
        <StatCard.Numbers
          size="lg"
          isEmpty={!mainMetricsData}
          value={
            mainMetricsData?.[mainMetricsData.length - 1]?.total_new_tasks || 0
          }
        />
      ),
    },
    {
      name: "completed",
      withFooter: true,
      firstValue:
        mainMetricsData?.[mainMetricsData.length - 2]?.total_finished_tasks ||
        0,
      secondValue:
        mainMetricsData?.[mainMetricsData.length - 1]?.total_finished_tasks ||
        0,
      children: (
        <StatCard.Numbers
          size="lg"
          isEmpty={!mainMetricsData}
          value={
            mainMetricsData?.[mainMetricsData.length - 1]
              ?.total_finished_tasks || 0
          }
        />
      ),
    },
    {
      name: "user-satisfactions",
      withFooter: true,
      firstValue:
        mainMetricsData?.[mainMetricsData.length - 2]?.user_satisfactions! *
          10 || 0,
      secondValue:
        mainMetricsData?.[mainMetricsData.length - 1]?.user_satisfactions! *
          10 || 0,
      children: (
        <StatCard.Percentage
          isEmpty={!mainMetricsData}
          value={
            mainMetricsData?.[mainMetricsData.length - 1]?.user_satisfactions! *
              10 || 0
          }
        />
      ),
    },
  ];

  const renderLeaderboardItem = (admin: AdminData, index: number) => (
    <div
      key={admin.user_id}
      className={clsx(
        "flex items-center justify-between gap-8 rounded-2xl px-2",
        index === 0 && "bg-danger text-white py-2",
      )}
    >
      <div className="text-left flex flex-row gap-1 items-center">
        <TrophyIcon
          height={24}
          width={24}
          className={index === 0 ? "" : "hidden"}
        />
        {index !== 0 && (
          <span className="text-sm text-center font-semibold w-[24px]">
            {index + 1}
          </span>
        )}
        <div className="flex flex-col flex-1 max-w-full">
          <p className="line-clamp-1 font-semibold text-sm">
            {admin.display_name || "-"}
          </p>
          <p className="text-xs">{admin.email}</p>
        </div>
      </div>
      <p className="font-semibold text-right text-sm">{admin.rating}</p>
    </div>
  );

  return (
    <Layout
      title={t("title")}
      classNames={{
        body: "flex flex-col gap-2 px-4 sm:px-6 py-2",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
        <StatCard
          classNames={{
            root: "min-h-24 lg:min-h-64",
            header: "pl-4 pr-3",
            body: "flex items-center justify-center px-4",
          }}
          isLoading={isMainMetricsLoading}
          footer={
            <MetricFooter
              firstValue={
                mainMetricItems[Number(mainMetricTab)].firstValue || 0
              }
              secondValue={
                mainMetricItems[Number(mainMetricTab)].secondValue || 0
              }
              name={mainMetricItems[Number(mainMetricTab)].name}
            />
          }
          header={
            <div className="flex flex-col md:flex-row justify-between items-center lg:items-start gap-2 w-full">
              <p
                className={clsx(
                  title({
                    className: "text-sm w-full text-center md:text-left",
                  }),
                )}
              >
                {t("main-metrics-title")}
              </p>
              <div className="flex items-center gap-2 flex-row">
                <Button
                  size="sm"
                  isIconOnly
                  startContent={
                    <ChevronLeftIcon className="w-4 h-4" strokeWidth={3} />
                  }
                  isDisabled={mainMetricTab === "0"}
                  onPress={() =>
                    setMainMetricTab((Number(mainMetricTab) - 1).toString())
                  }
                />
                <p className="text-sm font-semibold w-40 text-center">
                  {t(`${mainMetricItems[Number(mainMetricTab)].name}-tab-text`)}
                </p>
                <Button
                  size="sm"
                  isIconOnly
                  isDisabled={mainMetricTab === "2"}
                  endContent={
                    <ChevronRightIcon className="w-4 h-4" strokeWidth={3} />
                  }
                  onPress={() =>
                    setMainMetricTab((Number(mainMetricTab) + 1).toString())
                  }
                />
              </div>
            </div>
          }
        >
          {mainMetricsError && (
            <Error
              className="h-full p-4"
              message={t("error-message")}
              onReset={mutateMainMetrics}
            />
          )}
          {mainMetricsData &&
            !mainMetricsError &&
            mainMetricItems[Number(mainMetricTab)].children}
        </StatCard>
        <StatCard
          classNames={{
            root: "min-h-24 lg:min-h-64",
            header: "px-4",
            body: "flex items-center justify-center px-4",
          }}
          isLoading={isAdminsLoading}
          header={
            <p
              className={clsx(
                title({ className: "text-sm w-full text-center md:text-left" }),
              )}
            >
              {t("admin-leaderboards-title")}
            </p>
          }
        >
          {adminsError && (
            <Error
              className="h-full p-4"
              message={t("error-message")}
              onReset={mutateAdmins}
            />
          )}
          {adminsData && !adminsError && (
            <div className="flex flex-col h-full w-full gap-2 py-2">
              {adminsData?.map((admin, index) =>
                renderLeaderboardItem(admin, index),
              )}
            </div>
          )}
        </StatCard>
        <StatCard
          classNames={{
            root: "min-h-24 lg:min-h-64",
            header: "px-4",
            body: "flex items-center justify-center px-4",
          }}
          header={
            <p className={clsx(title({ className: "text-sm w-full" }))}>
              {t("admin-leaderboards-title")}
            </p>
          }
        >
          <div className="flex flex-col h-full w-full gap-2 py-2">
            {adminsData?.map((admin, index) =>
              renderLeaderboardItem(admin, index),
            )}
          </div>
        </StatCard>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
        <div>ajs</div>
        <div>ajk</div>
      </div>
    </Layout>
  );
}

DashboardPage.displayName = "DashboardPage";
