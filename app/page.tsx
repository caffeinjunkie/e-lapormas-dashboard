"use client";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode, useState } from "react";
import useSWR from "swr";

import { swrConfig } from "./config";
import { fetchReports } from "./reports/handlers";
import { MetricFooter } from "./statistics/components/metric-footer";

import { fetchAdmins } from "@/api/admin";
import { fetchGeneralStatistics } from "@/api/statistics";
import Error from "@/components/error";
import {
  ChartIcon,
  DocumentIcon,
  KeyIcon,
  TrophyIcon,
} from "@/components/icons";
import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";
import { Report } from "@/types/report.types";
import { MainMetrics } from "@/types/statistics.types";
import { AdminData } from "@/types/user.types";
import { formatLocaleDate, formatMonthYearDate } from "@/utils/date";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  const [mainMetricTab, setMainMetricTab] = useState("0");
  const dateFormatter = useFormatter();

  const {
    data: adminsData,
    error: adminsError,
    isLoading: isAdminsLoading,
    mutate: mutateAdmins,
  } = useSWR(["admins-dashboard"], () => fetchAdmins(), swrConfig);

  const {
    data: mainMetricsData,
    error: mainMetricsError,
    isLoading: isMainMetricsLoading,
    mutate: mutateMainMetrics,
  } = useSWR(
    ["main-metrics-dashboard"],
    () => fetchGeneralStatistics(0, 3, "desc"),
    swrConfig,
  );

  const {
    data: reportsData,
    error: reportsError,
    isLoading: isReportsLoading,
    mutate: mutateReports,
  } = useSWR(
    ["reports-dashboard"],
    () =>
      fetchReports({
        offset: 0,
        limit: 6,
        status: "PENDING",
        sortBy: "newest",
      }),
    swrConfig,
  );

  const series1 =
    mainMetricsData?.map((item) => item.total_new_tasks).reverse() || [];
  const series2 =
    mainMetricsData?.map((item) => item.total_finished_tasks).reverse() || [];
  const xAxis =
    mainMetricsData
      ?.map((item) =>
        formatMonthYearDate(dateFormatter, item.month_year, false),
      )
      .reverse() || [];

  const combinedData = [
    {
      id: "new-tasks",
      color: "#0c64fc",
      label: t("development-metric-new-tasks"),
      data: series1,
    },
    {
      id: "finished-tasks",
      color: "#1cc47c",
      label: t("development-metric-finished-tasks"),
      data: series2,
    },
  ];

  const mainMetricItems = [
    {
      name: "new",
      withFooter: true,
      firstValue: mainMetricsData?.[0]?.total_new_tasks || 0,
      secondValue: mainMetricsData?.[1]?.total_new_tasks || 0,
      children: (
        <StatCard.Numbers
          size="lg"
          isEmpty={!mainMetricsData}
          value={mainMetricsData?.[0]?.total_new_tasks || 0}
        />
      ),
    },
    {
      name: "completed",
      withFooter: true,
      firstValue: mainMetricsData?.[0]?.total_finished_tasks || 0,
      secondValue: mainMetricsData?.[1]?.total_finished_tasks || 0,
      children: (
        <StatCard.Numbers
          size="lg"
          isEmpty={!mainMetricsData}
          value={mainMetricsData?.[0]?.total_finished_tasks || 0}
        />
      ),
    },
    {
      name: "user-satisfactions",
      withFooter: true,
      firstValue: mainMetricsData?.[0]?.user_satisfactions! * 10 || 0,
      secondValue: mainMetricsData?.[1]?.user_satisfactions! * 10 || 0,
      children: (
        <StatCard.Percentage
          isEmpty={!mainMetricsData}
          value={mainMetricsData?.[0]?.user_satisfactions! * 10 || 0}
        />
      ),
    },
  ];

  const renderLeaderboardItem = (admin: AdminData, index: number) => (
    <div
      key={admin.user_id}
      className={clsx(
        "flex items-center justify-between gap-8 rounded-xl px-2",
        index === 0 && "bg-success text-white py-2",
      )}
    >
      <div className="text-left flex flex-row gap-1 items-center">
        <span className="text-sm text-center font-semibold w-[24px]">
          {index + 1}
        </span>
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

  const renderCardTitle = (value: string, Icon: ReactNode, href?: string) => (
    <div className="flex flex-row w-full justify-between items-center">
      <div className="flex flex-row items-center gap-2 w-full">
        {Icon}
        <p
          className={clsx(
            title({
              className: "text-sm w-full text-left",
            }),
          )}
        >
          {value}
        </p>
      </div>
      {href && (
        <Link href={href} className="text-sm w-full text-right text-primary">
          {t("more-link-text")}
        </Link>
      )}
    </div>
  );

  const renderReportItem = (report: Report, index: number) => {
    const isOdd = (index + 1) % 2 !== 0;
    return (
      <div
        key={index}
        className={clsx(
          "flex flex-col w-full py-1 px-2 rounded-xl",
          isOdd ? "bg-default-100 py-2" : "",
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
          <div className="flex flex-col flex-1 max-w-full">
            <Link
              href={`/reports/${report.tracking_id}`}
              className="text-xs text-primary"
            >
              #{report.tracking_id}
            </Link>
            <p className="line-clamp-1 font-semibold text-sm">{report.title}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-fit items-start sm:items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-500">
              {formatLocaleDate(
                report.created_at,
                "long-relative",
                dateFormatter,
              )}
            </p>
            <Button
              variant="light"
              color="primary"
              className="w-full sm:w-fit"
              isIconOnly
              as={Link}
              href={`/reports/${report.tracking_id}`}
              size="sm"
              endContent={<ArrowRightIcon className="size-4" strokeWidth="2" />}
            >
              <p className="visible sm:hidden">{t("visit-link-text")}</p>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout
      title={t("title")}
      headerComponent={<p className="text-sm text-gray-500">{t("subtitle")}</p>}
      classNames={{
        body: "flex flex-col gap-4 px-4 sm:px-6 pb-6",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        <StatCard
          classNames={{
            root: "min-h-24 lg:min-h-64",
            header: "pl-4 pr-3",
            body: "flex items-center justify-center px-4",
          }}
          isLoading={isMainMetricsLoading}
          footer={
            <MetricFooter
              size="sm"
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
            <div className="flex flex-col justify-center items-center gap-4 w-full">
              <div className="flex flex-row w-full justify-between items-center">
                {renderCardTitle(
                  t("main-metrics-title"),
                  <KeyIcon height={24} width={24} />,
                  "/statistics",
                )}
              </div>
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
          header={renderCardTitle(
            t("admin-leaderboards-title"),
            <TrophyIcon height={24} width={24} />,
          )}
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
            root: "min-h-24 lg:min-h-64 lg:col-span-2 2xl:col-span-1",
            header: "px-4",
            body: "flex items-center justify-center px-4",
          }}
          isLoading={isReportsLoading}
          header={renderCardTitle(
            t("latest-report-title"),
            <DocumentIcon height={24} width={24} />,
            "/reports",
          )}
        >
          {reportsError && (
            <Error
              className="h-full p-4"
              message={t("error-message")}
              onReset={mutateReports}
            />
          )}
          {reportsData && !reportsError && (
            <div className="flex flex-col h-full w-full gap-2 py-2">
              {reportsData?.reports?.map((report, index) =>
                renderReportItem(report, index),
              )}
            </div>
          )}
        </StatCard>
      </div>
      <div className="w-full">
        <StatCard
          isLoading={isMainMetricsLoading}
          header={renderCardTitle(
            t("development-metrics-title"),
            <ChartIcon height={24} width={24} />,
            "/statistics",
          )}
          classNames={{
            body: "px-0 lg:px-2",
          }}
        >
          {mainMetricsError ? (
            <Error
              className="h-full p-4"
              message={t("error-message")}
              onReset={mutateMainMetrics}
            />
          ) : (
            <StatCard.Line
              labels={xAxis}
              height={300}
              data={combinedData}
              isEmpty={
                !mainMetricsData ||
                (mainMetricsData as MainMetrics[]).length < 2
              }
            />
          )}
        </StatCard>
      </div>
    </Layout>
  );
}

DashboardPage.displayName = "DashboardPage";
