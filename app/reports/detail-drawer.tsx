import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  FolderOpenIcon,
  MapPinIcon,
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
import clsx from "clsx";
import { useTranslations } from "next-intl";
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
              <div className="flex flex-wrap space-x-0 gap-x-4 gap-y-2 sm:flex-col sm:gap-y-5 pb-1 sm:pb-4 pt-0 sm:pt-2">
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
