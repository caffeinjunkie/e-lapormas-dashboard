import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, PressEvent } from "@heroui/button";
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
import { redirect } from "next/navigation";

import { Description } from "./[id]/description";
import { StatusEnum, StatusLabel } from "./config";

import { title } from "@/components/primitives";
import { QuestionAnswer, Report } from "@/types/report.types";

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
            <DrawerBody>
              <Description
                description={selectedReport?.description as string}
                followUpQuestions={
                  selectedReport?.data?.follow_up_questions as
                    | QuestionAnswer[]
                    | null
                }
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
