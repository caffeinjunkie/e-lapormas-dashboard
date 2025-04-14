"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { ModalBody, ModalFooter, ModalHeader } from "@heroui/modal";
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
import { acceptReport, updateReport } from "./handlers";
import LongPressButton from "./long-press-button";

import Error from "@/components/error";
import { Layout } from "@/components/layout";
import { Modal } from "@/components/modal";
import { title } from "@/components/primitives";

export default function ReportDetailPage() {
  const t = useTranslations("ReportsPage");
  const router = useRouter();
  const bodyRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const {
    isOpen: isFinishConfirmOpen,
    openModal: openFinishConfirm,
    closeModal: closeFinishConfirm,
  } = Modal.useModal();
  const [isIntersectingBody, setIsIntersectingBody] = useState(false);
  const [isIntersectingTabs, setIsIntersectingTabs] = useState(false);
  const [isPhotoSliderOpen, setPhotoSliderOpen] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState<{
    files: File[];
    message: string;
  }>({ files: [], message: "" });
  const [sliderImages, setSliderImages] = useState<
    {
      src: string;
      key: string;
    }[]
  >([]);
  const [imageIndex, setImageIndex] = useState(0);
  const { data, error, isValidating, mutate } = useSWR(
    ["report-detail", id],
    () => fetchReportAndAdmins(id as string),
    swrConfig,
  );
  const reportImages: { src: string; key: string }[] =
    data?.report.images.map((src: string, index: number) => ({
      src,
      key: `image-${index + 1}`,
    })) || [];

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

  const onAcceptReport = async () => {
    const result = await acceptReport(
      id as string,
      data?.report,
      setIsUpdateLoading,
      t,
    );
    if (!result.error) {
      mutate();
    }
  };

  const handleFinishReport = async () => {
    setIsUpdateLoading(true);
    const result = await updateReport(
      id as string,
      data?.report,
      setIsUpdateLoading,
      t,
      "COMPLETED",
      updatedData.message,
      updatedData.files,
    );

    closeFinishConfirm();
    if (!result.error) {
      mutate();
    }
  };

  const onFinishReport = (message: string, files: File[]) => {
    setUpdatedData({ files, message });
    openFinishConfirm();
  };

  const onSendUpdate = async (message: string, files: File[]) => {
    const result = await updateReport(
      id as string,
      data?.report,
      setIsUpdateLoading,
      t,
      "IN_PROGRESS",
      message,
      files,
    );
    if (!result.error) {
      mutate();
    }
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
        "flex flex-col gap-1 sticky top-0 z-30 md:z-40 lg:max-w-[50vw] w-full pt-2 bg-white transition-all duration-1000 ease-in-out",
      )}
    >
      <h1
        className={clsx(
          title({ size: "xs" }),
          "transition-all px-6 duration-200 ease-in-out text-base",
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

  const renderLoading = () => (
    <motion.div
      initial={{ opacity: 0, flex: 0 }}
      animate={{ opacity: 1, flex: isUpdateLoading || isValidating ? 1 : 0 }}
      exit={{ opacity: 0, flex: 0 }}
      transition={{
        duration: isUpdateLoading ? 0.3 : 0.5,
        delay: isUpdateLoading ? 0.3 : 0.75,
        ease: "easeInOut",
      }}
      className="absolute top-0 bottom-0 flex z-50 bg-white/70 items-center justify-center w-full"
    >
      <Spinner />
    </motion.div>
  );

  return (
    <Layout
      classNames={{
        header: "gap-4",
        layout: "overflow-y-clip",
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
      {(isUpdateLoading || isValidating) && renderLoading()}
      {!isValidating && (
        <div className="flex flex-col">
          {renderTitle()}
          <div className={clsx("flex flex-col lg:flex-row gap-2 lg:gap-4")}>
            <div
              ref={bodyRef}
              className="flex flex-col flex-1 max-h-[90vh] px-6 pb-0 lg:pb-6 lg:pr-6"
            >
              <ReportDetail report={data?.report} className="pb-5" />
            </div>
            <div
              ref={tabsRef}
              className={clsx(
                "flex flex-col z-30 gap-4 w-full lg:w-[43vh]",
                "transition-all duration-300 ease-in-out",
                "lg:max-h-[84vh]",
              )}
            >
              <Tabs
                size="md"
                aria-label="Report detail tabs"
                color="default"
                variant="underlined"
                classNames={{
                  tabList: "px-4 lg:px-0 mt-4 lg:mt-[-12px]",
                  panel: "overflow-y-scroll px-6 lg:pl-4 lg:pr-10 pb-4",
                }}
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
                          className="border-none w-full shadow-sm hover:scale-105"
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
              </Tabs>
            </div>
          </div>
          <Modal
            isOpen={isFinishConfirmOpen}
            onClose={closeFinishConfirm}
            withButton={false}
          >
            <ModalHeader>{t("finish-confirm-title")}</ModalHeader>
            <ModalBody>
              <p>
                {t.rich("finish-confirm-description", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("finish-confirm-long-press-text", {
                  button: `"${t("confirm-button-text")}"`,
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                className="w-full md:w-fit"
                variant="light"
                radius="sm"
                color="danger"
                isDisabled={isUpdateLoading}
                onPress={closeFinishConfirm}
              >
                {t("cancel-button-text")}
              </Button>
              <LongPressButton
                className="w-full md:w-fit data-[hover=true]:text-white"
                variant="ghost"
                radius="sm"
                color="success"
                onPressFinished={handleFinishReport}
                isLoading={isUpdateLoading}
              >
                {t("confirm-button-text")}
              </LongPressButton>
            </ModalFooter>
          </Modal>
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
