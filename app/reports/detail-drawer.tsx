import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  FolderOpenIcon,
  MapPinIcon,
  PaperClipIcon,
  PresentationChartLineIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Image } from "@heroui/image";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PhotoSlider } from "react-photo-view";

import { PriorityChipColor, StatusChipColor, StatusEnum } from "./config";
import { Description } from "./description";
import { Info } from "./info";
import { ReportDetail } from "./report-detail";

import { title } from "@/components/primitives";
import { Report } from "@/types/report.types";
import { formatLocaleDate } from "@/utils/string";

interface DetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedReport: Report;
}

export const DetailDrawer = ({
  isOpen,
  onOpenChange,
  selectedReport,
}: DetailDrawerProps) => {
  const t = useTranslations("ReportsPage");
  const isPending = selectedReport?.status === StatusEnum.PENDING;
  const images = selectedReport?.images || [];
  const [isPhotoSliderOpen, setPhotoSliderOpen] = useState(false);

  //TODO: check on server side if it works
  const isOnLargeDevice = window.matchMedia("(min-width: 640px)").matches;

  const onActionPress = () => {
    if (!isPending) return;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isPhotoSliderOpen}
      title={selectedReport?.title}
      className="rounded-t-lg sm:top-2 sm:bottom-2 sm:right-2 sm:rounded-xl"
      classNames={{
        header: "p-0",
        closeButton: "z-20 text-white hover:bg-white/20 active:bg-white/30",
      }}
      radius="none"
      size={isOnLargeDevice ? "md" : "3xl"}
      hideCloseButton={isOnLargeDevice}
      placement={isOnLargeDevice ? "right" : "bottom"}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader
              className={clsx(
                "flex flex-col gap-1 overflow-hidden",
                isOnLargeDevice && "pt-14",
              )}
            >
              {isOnLargeDevice && (
                <div className="absolute top-0 left-0 p-1 w-full border-b-1 border-default-200">
                  <Button
                    variant="light"
                    radius="full"
                    className=""
                    size="sm"
                    isIconOnly
                    startContent={
                      <XMarkIcon className="w-4 h-4 stroke-2 text-default-500" />
                    }
                    onPress={onClose}
                  />
                </div>
              )}
              <Card
                className="block sm:hidden data-[pressed=true]:scale-[1.05]"
                isPressable={images.length > 0}
                onPress={() => setPhotoSliderOpen(true)}
                radius="none"
              >
                <Image
                  src={
                    images.length > 0
                      ? images[0]
                      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/broken-image.png`
                  }
                  alt={selectedReport?.title || ""}
                  as={NextImage}
                  width={800}
                  height={200}
                  radius="none"
                  className={`w-full h-48 object-cover ${images.length > 0 ? "" : "object-contain p-6 bg-default-200"}`}
                />
              </Card>
              <h1 className={clsx(title({ size: "xs" }), "px-6 pt-4 sm:pt-0")}>
                {selectedReport?.title}
              </h1>
            </DrawerHeader>
            <DrawerBody className="gap-3">
              <ReportDetail report={selectedReport} className="pb-3" />
              {images.length > 0 && (
                <Card
                  isPressable
                  onPress={() => setPhotoSliderOpen(true)}
                  className="hidden sm:flex flex-row justify-between w-full p-2 shadow-none border-1 border-default-200 hover:bg-default-100 rounded-xl"
                >
                  <div className="flex flex-row items-center justify-start gap-3">
                    <Image
                      src={images[0]}
                      alt={selectedReport?.title || ""}
                      as={NextImage}
                      fallbackSrc={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/broken-image.png`}
                      width={80}
                      height={80}
                      className="w-24 h-16 sm:h-12 rounded-md object-cover"
                    />
                    <div className="flex flex-col gap-1 text-xs">
                      <p className="font-semibold text-start line-clamp-1">
                        Sometiinsf faoijm asfoijsakf ,talj jnaodk casuu bgsa.jpg
                      </p>
                      <p className="text-start">1.4MB</p>
                    </div>
                  </div>
                  <PaperClipIcon className="w-4 h-4 stroke-2 text-default-500" />
                </Card>
              )}
              <PhotoSlider
                images={
                  selectedReport?.images?.map((image) => ({
                    src: image,
                    key: image,
                  })) || []
                }
                visible={isPhotoSliderOpen}
                onClose={() => setPhotoSliderOpen(false)}
              />
            </DrawerBody>
            <DrawerFooter>
              <Button
                variant="light"
                className="w-full sm:w-fit"
                onPress={onClose}
              >
                {t("close-button-text")}
              </Button>
              <Button
                color={isPending ? "danger" : "primary"}
                variant={isPending ? "ghost" : "solid"}
                className="w-full sm:w-fit"
                as={isPending ? "button" : Link}
                href={
                  isPending
                    ? undefined
                    : `/reports/${selectedReport?.tracking_id}`
                }
                onPress={onActionPress}
              >
                {isPending ? t("accept-button-text") : t("more-button-text")}
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
