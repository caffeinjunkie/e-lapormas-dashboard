import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";

export default function SettingsPage() {
  const t = useTranslations("SettingsPage");

  return <Layout title={t("settings-title")}></Layout>;
}

SettingsPage.displayName = "SettingsPage";
