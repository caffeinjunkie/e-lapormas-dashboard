import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  return <Layout title={t("title")}></Layout>;
}

DashboardPage.displayName = "DashboardPage";
