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

import { Description } from "./[id]/description";
import { Info } from "./[id]/info";
import { PriorityChipColor, StatusChipColor, StatusEnum } from "./config";

import { title } from "@/components/primitives";
import { Report } from "@/types/report.types";
import { formatLocaleDate } from "@/utils/string";

interface DetailDrawerProps {
  isOpen: boolean;
  isMobile: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedReport: Report | null;
}

export const DetailDrawer = ({
  isOpen,
  isMobile,
  onOpenChange,
  selectedReport,
}: DetailDrawerProps) => {
  const t = useTranslations("ReportsPage");
  const isPending = selectedReport?.status === StatusEnum.PENDING;
  const followUpQuestions = selectedReport?.data?.follow_up_questions || [];
  const fullDate = formatLocaleDate(selectedReport?.created_at || "", "long");
  const { category, priority, status, address } = selectedReport || {};
  const fullAddress =
    address?.full_address || address?.village || address?.district || "";
  const categoryLabel = t(`category-${category}`);
  const priorityLabel = t(`priority-${priority?.toLowerCase()}`);
  const statusLabel = t(`status-${status?.replaceAll("_", "-").toLowerCase()}`);
  const lat = address?.lat;
  const lng = address?.lng;
  const latLng = `${lat},${lng}`;
  const mapQuery = lat && lng ? latLng : address?.full_address || "";
  const hasNoAddress = !lat || !lng || !fullAddress || !mapQuery;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  //TODO: check on server side if it works
  const isOnLargeDevice = window.matchMedia("(min-width: 640px)").matches;

  const onActionPress = () => {
    if (!isPending) return;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={selectedReport?.title}
      className="rounded-t-lg sm:top-2 sm:bottom-2 sm:right-2 sm:rounded-xl"
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
                "flex flex-col gap-1",
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
              <h1 className={title({ size: "xs" })}>{selectedReport?.title}</h1>
            </DrawerHeader>
            <DrawerBody className="gap-3">
              <div className="flex flex-wrap space-x-0 gap-x-4 gap-y-2 sm:flex-col sm:gap-y-5 pb-3 pt-1 sm:pt-2">
                <Info
                  className="items-center"
                  Icon={CalendarDaysIcon}
                  label="created-at"
                >
                  <p className="text-xs text-default-700 font-semibold">
                    {fullDate}
                  </p>
                </Info>
                <Info
                  className="items-center"
                  Icon={CheckBadgeIcon}
                  label="status"
                >
                  <Chip
                    size="sm"
                    variant="dot"
                    className="border-none -ml-2"
                    classNames={{
                      content: "text-default-700 font-semibold",
                    }}
                    color={
                      StatusChipColor[status as keyof typeof StatusChipColor]
                    }
                  >
                    {statusLabel}
                  </Chip>
                </Info>
                <Info
                  className="items-center"
                  Icon={PresentationChartLineIcon}
                  label="priority"
                >
                  <Chip
                    size="sm"
                    variant="flat"
                    classNames={{
                      content: "font-semibold",
                    }}
                    color={
                      PriorityChipColor[
                        priority as keyof typeof PriorityChipColor
                      ]
                    }
                  >
                    {priorityLabel}
                  </Chip>
                </Info>
                <Info
                  Icon={FolderOpenIcon}
                  className="items-center"
                  label="category"
                >
                  <Chip variant="bordered" size="sm">
                    {categoryLabel}
                  </Chip>
                </Info>
                {!hasNoAddress && (
                  <Info
                    Icon={MapPinIcon}
                    label="address"
                    className="items-start"
                  >
                    <span className="text-xs flex flex-wrap gap-x-1 text-default-700">
                      <p>{fullAddress}</p>
                      <Link
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 font-semibold hover:underline"
                      >
                        (Lihat di peta)
                      </Link>
                    </span>
                  </Info>
                )}
              </div>
              <Description
                description={selectedReport?.description as string}
                followUpQuestions={followUpQuestions}
              />
              {/* place holder image for now */}
              <div className="flex flex-row justify-between w-full border-1 border-default-200 p-2 rounded-xl">
                <div className="flex flex-row items-center gap-3">
                  <Image
                    src="https://fastly.picsum.photos/id/1039/200/200.jpg?hmac=VpGJWDIq64ZdzDD5NAREaY7l5gX14vU5NBH84b5Fj-o"
                    alt={selectedReport?.title || ""}
                    as={NextImage}
                    fallbackSrc="https://app.requestly.io/delay"
                    width={80}
                    height={80}
                    className="w-24 h-16 sm:h-12 rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-1 text-xs">
                    <p className="font-semibold line-clamp-1">
                      Sometiinsf faoijm asfoijsakf ,talj jnaodk casuu bgsa.jpg
                    </p>
                    <p>1.4MB</p>
                  </div>
                </div>
                <PaperClipIcon className="w-4 h-4 stroke-2 text-default-500" />
              </div>
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
