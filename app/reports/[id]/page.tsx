"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PhotoSlider } from "react-photo-view";
import useSWR from "swr";

import { swrConfig } from "../config";
import { fetchReportAndAdmins } from "../handlers";
import { ReportDetail } from "../report-detail";
import { Activities } from "./activities";

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
  const [isPhotoSliderOpen, setPhotoSliderOpen] = useState(false);
  const [sliderImages, setSliderImages] = useState<
    {
      src: string;
      key: string;
    }[]
  >([]);
  const [imageIndex, setImageIndex] = useState(0);
  const { data, error, isLoading, mutate } = useSWR(
    ["report-detail", id],
    () => fetchReportAndAdmins(id as string),
    swrConfig,
  );

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
  }, [data?.report]);

  const onImagePress = (
    images: { src: string; key: string }[],
    index: number = 0,
  ) => {
    setSliderImages(images);
    setPhotoSliderOpen(true);
    setImageIndex(index);
  };

  if (error) {
    return (
      <Layout
        classNames={{
          header: "gap-4",
          body: "px-6",
        }}
      >
        <Error message={t("page-error-message")} onReset={mutate}>
          <Button
            color="primary"
            startContent={<ArrowLeftIcon className="size-4 md:size-5" />}
            onPress={() => router.back()}
          >
            {t("back-to-previous-page-button-text")}
          </Button>
        </Error>
      </Layout>
    );
  }

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
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:pr-6">
            <div
              className={clsx(
                "flex flex-col gap-1 sticky top-0 z-30 w-full pt-2 bg-white transition-all duration-1000 ease-in-out",
              )}
            >
              <h1
                className={clsx(
                  title({ size: "xs" }),
                  "transition-all px-6 duration-200 ease-in-out",
                  !isIntersectingBody ? "sm:text-sm pt-2" : "",
                )}
              >
                {data?.report?.title}
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
              <ReportDetail report={data?.report} className="pb-5" />
            </div>
          </div>
          <div
            ref={tabsRef}
            className={clsx(
              "flex flex-col sticky top-0 z-30 lg:static gap-4 bottom-0",
              "w-full py-4 lg:py-0 px-6 lg:px-4",
              "lg:w-[50vw] h-[100vh] lg:h-fit",
              "transition-all duration-300 ease-in-out",
              isIntersectingTabs ? "pt-14 md:pt-8" : "pt-4",
            )}
          >
            <Tabs
              size="md"
              aria-label="Report detail tabs"
              color="default"
              variant="underlined"
              className="font-semibold"
            >
              <Tab value="activities" title={t("activities-tab-text")}>
                <Activities
                  data={data?.report?.progress}
                  onImagePress={onImagePress}
                  users={data?.admins || []}
                />
              </Tab>
              <Tab value="curated-tasks" title={t("curated-tasks-tab-text")}>
                {/* <CuratedTasks /> */}
              </Tab>
            </Tabs>
          </div>
          <PhotoSlider
            images={sliderImages}
            index={imageIndex}
            visible={isPhotoSliderOpen}
            onClose={() => setPhotoSliderOpen(false)}
          />
        </div>
      )}
    </Layout>
  );
}

ReportDetailPage.displayName = "ReportDetailPage";
