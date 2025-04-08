import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";
import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";

export default function StatisticsPage() {
  const t = useTranslations("StatisticsPage");
  return (
    <Layout title={t("title")} classNames={{ body: "px-6 md:px-8 pt-2 pb-6" }}>
      <div className="flex flex-col gap-5 lg:gap-3">
        <div className="grid gap-5 lg:gap-3 lg:grid-cols-2 border-b-0 lg:border-b-1 border-default-200">
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
              <StatCard header="Metric 1" footer="Details" className="">
                Content 1
              </StatCard>
              <StatCard header="Metric 2" footer="Details" className="">
                Content 2
              </StatCard>
              <StatCard header="Metric 3" footer="Details">
                Content 3
              </StatCard>
              <StatCard header="Metric 4" footer="Details">
                Content 4
              </StatCard>
            </div>
          </div>
          {/* Right column - 1 column 2 rows */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col lg:min-h-16">
              <p className={clsx(title({ className: "text-md" }))}>
                {t("demography-metric-title")}
              </p>
              <p className={clsx(subtitle({ className: "text-sm" }))}>
                {t("demography-metric-description")}
              </p>
            </div>
            <div className="grid gap-4 md:grid-rows-2 lg:h-[50vh]">
              <StatCard header="Metric 5" footer="Details">
                Content 5
              </StatCard>
              <StatCard header="Metric 6" footer="Details">
                Content 6
              </StatCard>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className={clsx(title({ className: "text-md" }))}>
              {t("development-metric-title")}
            </p>
            <p className={clsx(subtitle({ className: "text-sm" }))}>
              {t("development-metric-description")}
            </p>
          </div>
          <StatCard header="Metric 7" footer="Details">
            Content 7
          </StatCard>
        </div>
      </div>
    </Layout>
  );
}

StatisticsPage.displayName = "StatisticsPage";
