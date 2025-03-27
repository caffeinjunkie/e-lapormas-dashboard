import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Report } from "@/types/report.types";

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
  const isOnLargeDevice = window.matchMedia("(min-width: 640px)").matches;

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
                isOnLargeDevice && "pt-12",
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
              {selectedReport?.title}
            </DrawerHeader>
            <DrawerBody>body</DrawerBody>
            <DrawerFooter>
              <Button
                variant="light"
                color="warning"
                title={t("close-button-text")}
                onPress={onClose}
              />
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
