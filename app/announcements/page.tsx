import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";

export default function AnnouncementsPage() {
  const t = useTranslations("AnnouncementsPage");
  return <Layout title={t("title")} classNames={{ header: "gap-4" }}></Layout>;
}

AnnouncementsPage.displayName = "AnnouncementsPage";
