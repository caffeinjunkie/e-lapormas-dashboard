import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";
import { StatCard } from "@/components/stat-card";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  return (
    <Layout
      title={t("title")}
      classNames={{
        body: "flex flex-col gap-2",
      }}
    >
      <div className="bg-red-500 w-full flex flex-col lg:flex-row gap2">
        <StatCard
          classNames={{
            root: "min-h-24 lg:min-h-64",
            header: "px-4",
            body: "flex items-center justify-center",
          }}
        >
          tes
        </StatCard>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2">
          <div>ajs</div>
          <div>ajk</div>
        </div>
      </div>
    </Layout>
  );
}

DashboardPage.displayName = "DashboardPage";
