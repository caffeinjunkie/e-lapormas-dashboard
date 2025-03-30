"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";

export default function ReportDetailPage() {
  const t = useTranslations("ReportsPage");
  const router = useRouter();
  const { id } = useParams();
  const isOnLargeDevice = window.matchMedia("(min-width: 640px)").matches;

  const mockData = {
    id: "76a4293e-e926-434c-b788-ee0ba7fd7f87",
    tracking_id: "XOXO5212",
    title: "Kebijakan Pendidikan Baru",
    description: "Implementasi kebijakan baru dalam dunia pendidikan.",
    address: {
      lat: "10.1234",
      lng: "50.6789",
      village: "Tamsis",
      district: "Jogja",
      full_address: "Jl. Pendidikan No. 12, Jogja",
    },
    created_at: "2025-03-13T10:05:00+00:00",
    category: "kebijakan-publik",
    images: ["cdn.example.com/images/jalan1.jpg"],
    data: null,
    rating: 0,
    status: "PENDING",
    priority: "HIGH",
    progress: null,
  };

  return (
    <Layout
      classNames={{
        header: "gap-4",
        body: "px-6",
      }}
      headerComponent={
        <Breadcrumbs
          size="md"
          className="animate-appear"
          color="primary"
          variant={isOnLargeDevice ? "solid" : "light"}
        >
          <BreadcrumbItem onClick={() => router.back()}>
            {t("title")}
          </BreadcrumbItem>
          <BreadcrumbItem>{id}</BreadcrumbItem>
        </Breadcrumbs>
      }
    >
      <div className="flex flex-col gap-4">
        <h1 className={clsx(title({ size: "xs" }))}>{mockData.title}</h1>
        <div className="flex flex-col gap-1 w-full bg-default-500">
          <p className="text-xs font-bold text-default-500">
            {t("description-text")}
          </p>
          <p className="text-sm text-default-700">{mockData.description}</p>
        </div>
      </div>
    </Layout>
  );
}

ReportDetailPage.displayName = "ReportDetailPage";
