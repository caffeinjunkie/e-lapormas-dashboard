import { useTranslations } from "next-intl";

import { DemographyMetrics } from "./demography-metrics";
import { DevelopmentMetrics } from "./development-metrics";
import { MainMetrics } from "./main-metrics";

import {
  categoryMetrics,
  locationMetrics,
  mainMetrics,
} from "@/app/statistics/mock-data";
import { Layout } from "@/components/layout";

export default function StatisticsPage() {
  const t = useTranslations("StatisticsPage");
  const mockData = {
    mainMetrics,
    locationMetrics,
    categoryMetrics,
  };

  return (
    <Layout title={t("title")} classNames={{ body: "px-6 md:px-8 pt-2 pb-6" }}>
      <div className="flex flex-col gap-5 lg:gap-3">
        <div className="grid gap-5 lg:gap-3 lg:grid-cols-2 border-b-0 lg:border-b-1 border-default-200">
          <MainMetrics data={mockData.mainMetrics} />
          <DemographyMetrics data={{ locationMetrics, categoryMetrics }} />
        </div>
        <DevelopmentMetrics data={mockData.mainMetrics} />
      </div>
    </Layout>
  );
}

StatisticsPage.displayName = "StatisticsPage";
