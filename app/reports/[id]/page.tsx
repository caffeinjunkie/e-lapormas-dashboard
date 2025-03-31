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
  const tabsRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const [isIntersectingBody, setIsIntersectingBody] = useState(false);
  const [isIntersectingTabs, setIsIntersectingTabs] = useState(false);
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
    const bodyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.9) {
            setIsIntersectingBody(true);
          } else {
            setIsIntersectingBody(false);
          }
        });
      },
      { threshold: 0.9 },
    );

    const tabsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersectingTabs(true);
          } else {
            setIsIntersectingTabs(false);
          }
          console.log(entry);
        });
      },
      { threshold: 0.85 },
    );

    if (bodyRef.current) {
      bodyObserver.observe(bodyRef.current);
    }
    if (tabsRef.current) {
      tabsObserver.observe(tabsRef.current);
    }

    return () => {
      if (bodyRef.current) {
        bodyObserver.unobserve(bodyRef.current);
      }
      if (tabsRef.current) {
        tabsObserver.unobserve(tabsRef.current);
      }
    };
  }, [report]);

  return (
    <Layout
      classNames={{
        header: clsx("gap-4"),
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
                "flex flex-col gap-1 z-50 w-full pt-2 bg-white transition-all duration-1000 ease-in-out",
                isIntersectingTabs ? "absolute top-0" : "sticky top-0",
              )}
            >
              <h1
                className={clsx(
                  title({ size: "xs" }),
                  "transition-all px-6 duration-200 ease-in-out",
                  !isIntersectingBody ? "sm:text-sm pt-2" : "",
                )}
              >
                {report?.title}
              </h1>
              <div
                className={clsx(
                  "w-1 sm:h-2 transition-all duration-1000 ease-in-out bg-white",
                  !isIntersectingBody && !isIntersectingTabs
                    ? "sm:w-full border-b-1 border-white sm:shadow-md"
                    : "w-1",
                )}
              ></div>
            </div>
            <div ref={bodyRef} className="flex flex-col gap-1 w-full px-6">
              <ReportDetail report={report} className="pb-5" />
            </div>
          </div>
          <div
            ref={tabsRef}
            className={clsx(
              "flex flex-col sticky top-0 pt-4 z-50 lg:static gap-4",
              "lg:border-l-1 border-default-300 w-full py-4 lg:py-0 px-6 lg:px-4 lg:w-[50vw] h-[100vh] lg:h-[80vh]",
              "transition-all duration-300 ease-in-out",
              isIntersectingTabs ? "pt-16" : "pt-0",
            )}
          >
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
