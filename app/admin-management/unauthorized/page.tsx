"use client";

import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Layout } from "@/components/layout";

export default function UnauthorizedPage() {
  const t = useTranslations("UnauthorizedPage");

  return (
    <Layout>
      <div className="flex flex-col items-center px-6 justify-center gap-6 h-[calc(100vh-5rem)] md:h-[calc(100vh-4rem)]">
        <p className="text-sm text-default-500 text-center">
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
