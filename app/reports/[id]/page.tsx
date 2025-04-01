"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";
import clsx from "clsx";
import { motion } from "framer-motion";
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
  const reportImages: { src: string; key: string }[] = data?.report.images.map(
    (src: string, index: number) => ({
      src,
      key: `image-${index + 1}`,
    }),
  );

  useEffect(() => {
    const bodyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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

  const onAcceptReport = () => {
    // TODO: Accept report
    // mutate();
  };

  const onFinishReport = () => {
    // TODO: Finish report
    // mutate();
  };

  const onSendUpdate = () => {
    // TODO: Send update
    // mutate();
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

  const renderTitle = () => (
    <div
      className={clsx(
        "flex flex-col gap-1 sticky top-0 z-30 md:z-40 w-full pt-2 bg-white transition-all duration-1000 ease-in-out",
      )}
    >
      <h1
        className={clsx(
          title({ size: "xs" }),
          "transition-all px-6 duration-200 ease-in-out text-md",
          !isIntersectingBody ? "pt-2 lg:pt-0" : "pt-0",
        )}
      >
        {data?.report?.title}
      </h1>
      <div
        className={clsx(
          "w-1 sm:h-2 transition-all duration-1000 ease-in-out bg-white",
          isIntersectingBody
            ? ""
            : "md:w-full lg:w-0 border-b-1 bg-white lg:border-transparent shadow-md lg:shadow-none",
        )}
      ></div>
    </div>
  );

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
        <div className="flex flex-col flex-grow">
          {renderTitle()}
          <div
            className={clsx(
              "flex flex-col lg:flex-row gap-2 lg:gap-6 flex-grow",
            )}
          >
            <div
              ref={bodyRef}
              className="flex flex-col w-full px-6 pb-0 lg:pb-6 lg:pr-6"
            >
              <ReportDetail report={data?.report} className="pb-5" />
            </div>
            <div
              ref={tabsRef}
              className={clsx(
                "flex flex-col flex-1 z-30 gap-4",
                "w-full py-4 lg:mt-[-28px] px-6 lg:px-4",
                "lg:w-[50vw] h-fit lg:sticky top-2",
                "transition-all duration-300 ease-in-out",
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
                    actions={{
                      onAcceptReport,
                      onFinishReport,
                      onSendUpdate,
                    }}
                    isIntersecting={isIntersectingTabs}
                    status={data?.report?.status}
                    data={data?.report?.progress}
                    onImagePress={onImagePress}
                    users={data?.admins || []}
                  />
                </Tab>
                <Tab value="attachments" title={t("attachments-tab-text")}>
                  {reportImages.length === 0 && (
                    <p className="flex justify-center w-full px-4 text-default-500 text-sm">
                      {t("no-attachments-text")}
                    </p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                    {reportImages.map(({ src }, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.2,
                          ease: "easeInOut",
                        }}
                      >
                        <Card
                          isPressable
                          onPress={() => onImagePress(reportImages, index)}
                          isFooterBlurred
                          className="border-none w-full"
                        >
                          <Image
                            removeWrapper
                            loading="lazy"
                            width={120}
                            height={120}
                            className="object-cover w-full"
                            src={src}
                            alt={src + index}
                          />
                          <CardFooter className="absolute h-6 bg-white/30 bottom-0 z-10 justify-between">
                            <p className="w-full text-xs text-center line-clamp-1">{`attachment ${index + 1}`}</p>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </Tab>
                <Tab value="curated-tasks" title={t("curated-tasks-tab-text")}>
                  {/* <CuratedTasks /> */}
                </Tab>
              </Tabs>
            </div>
          </div>
          <PhotoSlider
            images={sliderImages}
            index={imageIndex}
            visible={isPhotoSliderOpen}
            onIndexChange={setImageIndex}
            onClose={() => setPhotoSliderOpen(false)}
          />
        </div>
      )}
    </Layout>
  );
}

ReportDetailPage.displayName = "ReportDetailPage";
