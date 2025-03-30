"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { swrConfig } from "../config";
import { ReportDetail } from "../report-detail";

import { fetchTaskByTrackingId } from "@/api/tasks";
import Error from "@/components/error";
import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";

export default function ReportDetailPage() {
  const t = useTranslations("ReportsPage");
  const router = useRouter();
  const bodyRef = useRef<HTMLHeadingElement>(null);
  const { id } = useParams();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const {
    data: report,
    error,
    isLoading,
    mutate,
  } = useSWR(
    ["report-detail", id],
    () => fetchTaskByTrackingId(id as string),
    swrConfig,
  );

  if (error) {
    <Layout
      classNames={{
        header: "gap-4",
        body: "px-6",
      }}
    >
      <Error message={t("page-error-message")} onReset={mutate} />
      <Button onPress={() => router.back()}>
        {t("back-to-previous-page-button-text")}
      </Button>
    </Layout>;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.9) {
            setIsIntersecting(true);
          } else {
            setIsIntersecting(false);
          }
          console.log(entry);
        });
      },
      { threshold: 0.9 },
    );

    if (bodyRef.current) {
      observer.observe(bodyRef.current);
    }

    return () => {
      if (bodyRef.current) {
        observer.unobserve(bodyRef.current);
      }
    };
  }, [report]);

  return (
    <Layout
      classNames={{
        header: "gap-4 sticky top-[-14px]",
      }}
      headerComponent={
        <Breadcrumbs
          size="md"
          className="animate-appear"
          color="primary"
          variant="light"
        >
          <BreadcrumbItem onClick={() => router.back()}>
            {t("title")}
          </BreadcrumbItem>
          <BreadcrumbItem>{id}</BreadcrumbItem>
        </Breadcrumbs>
      }
    >
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-col w-full lg:pr-6">
            <div
              className={clsx(
                "flex flex-col gap-1 sticky top-9 z-50 w-full bg-white",
              )}
            >
              <h1
                className={clsx(
                  title({ size: "xs" }),
                  "transition-all px-6 duration-200 ease-in-out",
                  !isIntersecting ? "sm:text-sm" : "",
                )}
              >
                {report?.title}
              </h1>
              <div
                className={clsx(
                  "w-1 sm:h-2 transition-all duration-1000 ease-in-out bg-white",
                  !isIntersecting
                    ? "sm:w-full border-b-1 border-white sm:shadow-md"
                    : "w-1",
                )}
              ></div>
            </div>
            <div ref={bodyRef} className="flex flex-col gap-1 w-full px-6">
              <ReportDetail report={report} className="pb-5" />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:border-l-1 border-default-300 w-full py-4 lg:py-0 px-6 lg:px-4 lg:w-[50vw] h-[85vh]">
            <Tabs
              size="md"
              aria-label="Report detail tabs"
              color="default"
              variant="underlined"
              className="font-semibold"
            >
              <Tab value="activities">{t("activities-tab-text")}</Tab>
              <Tab value="curated-tasks">{t("curated-tasks-tab-text")}</Tab>
            </Tabs>
          </div>
        </div>
      )}
    </Layout>
  );
}

ReportDetailPage.displayName = "ReportDetailPage";
