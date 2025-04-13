"use client";

import { useTranslations } from "next-intl";
import useSWR from "swr";

import { swrConfig } from "./config";
import { DemographyMetrics } from "./demography-metrics";
import { DevelopmentMetrics } from "./development-metrics";
import { MainMetrics } from "./main-metrics";

import {
  fetchCategoryStatistics,
  fetchGeneralStatistics,
  fetchLocationStatistics,
} from "@/api/statistics";
import { Layout } from "@/components/layout";

export default function StatisticsPage() {
  const t = useTranslations("StatisticsPage");
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
    mutate: mutateCategory,
  } = useSWR(["category-metrics"], () => fetchCategoryStatistics(), swrConfig);

  const {
    data: locationData,
    error: locationError,
    isLoading: locationLoading,
    mutate: mutateLocation,
  } = useSWR(["location-metrics"], () => fetchLocationStatistics(), swrConfig);

  const {
    data: mainMetricsData,
    error: mainMetricsError,
    isLoading: mainMetricsLoading,
    mutate: mutateMainMetrics,
  } = useSWR(["main-metrics"], () => fetchGeneralStatistics(), swrConfig);

  return (
    <Layout
      title={t("title")}
      classNames={{ body: "px-6 md:px-8 pt-2 pb-6 flex flex-col gap-4" }}
    >
      {mainMetricsLoading || (
        <MainMetrics
          data={mainMetricsData ?? []}
          error={mainMetricsError}
          mutate={mutateMainMetrics}
          isLoading={mainMetricsLoading}
        />
      )}
      <DemographyMetrics
        data={{
          locationData: locationData ?? [],
          categoryData: categoryData ?? [],
        }}
        error={{
          category: categoryError,
          location: locationError,
        }}
        mutate={{
          category: mutateCategory,
          location: mutateLocation,
        }}
        isLoading={{
          category: categoryLoading,
          location: locationLoading,
        }}
      />
      <DevelopmentMetrics
        data={mainMetricsData?.slice(-12) ?? []}
        isLoading={mainMetricsLoading}
        error={mainMetricsError}
        mutate={mutateMainMetrics}
      />
    </Layout>
  );
}

StatisticsPage.displayName = "StatisticsPage";
