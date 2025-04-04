import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";

export default function StatisticsPage() {
  const t = useTranslations("StatisticsPage");
  return <Layout title={t("title")}></Layout>;
}

StatisticsPage.displayName = "StatisticsPage";
