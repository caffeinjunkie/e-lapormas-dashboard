import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";

export default function SettingsPage() {
  const t = useTranslations("SettingsPage");
  return (
    <Layout title={t("settings-title")}>

    </Layout>
  );
}

SettingsPage.displayName = "SettingsPage";
