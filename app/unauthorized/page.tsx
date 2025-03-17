import { Button } from "@heroui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";

export default function UnauthorizedPage() {
  const t = useTranslations("UnauthorizedPage");

  return (
    <Layout className="h-[calc(100vh-4rem)] md:h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-default-500">
          {t("unauthorized-tab-description")}
        </p>
        <Button as={Link} href="/" color="primary">
          {t("back-to-login-button")}
        </Button>
      </div>
    </Layout>
  );
}

UnauthorizedPage.displayName = "UnauthorizedPage";
