import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";
import { StatCard } from "@/components/stat-card";

export default function StatisticsPage() {
  const t = useTranslations("StatisticsPage");
  return (
    <Layout title={t("title")}>
      <StatCard header="te" footer="gg">
        ya
      </StatCard>
    </Layout>
  );
}

StatisticsPage.displayName = "StatisticsPage";
