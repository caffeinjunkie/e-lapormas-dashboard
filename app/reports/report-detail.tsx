import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  FolderOpenIcon,
  MapPinIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import { updatePriority } from "./[id]/handlers";

import {
  PriorityChipColor,
  StatusChipColor,
  priorityOptions,
} from "@/app/reports/config";
import { Description } from "@/app/reports/description";
import { Info } from "@/app/reports/info";
import { Report } from "@/types/report.types";
import { formatLocaleDate } from "@/utils/date";

interface ReportDetailProps {
  report: Report;
  className?: string;
  isEditable?: boolean;
  forceUpdate?: () => void;
  setLoading?: (loading: boolean) => void;
}

export const ReportDetail = ({
  report,
  className,
  isEditable = false,
  forceUpdate,
  setLoading,
}: ReportDetailProps) => {
  const t = useTranslations("ReportsPage");
  const [isEditActive, setIsEditActive] = useState(false);
  const followUpQuestions = report?.data?.follow_up_questions || [];
  const fullDate = formatLocaleDate(report?.created_at || "", "long");
  const [selectedPriority, setSelectedPriority] = useState<Set<string>>(
    new Set([report.priority.toLowerCase()]),
  );
  const { category, priority, status, address } = report || {};
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

  const savePriority = async () => {
    setLoading && setLoading(true);
    try {
      await updatePriority(
        report.tracking_id,
        selectedPriority.values().next().value?.toUpperCase() as string,
      );
      forceUpdate && forceUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading && setLoading(false);
      setIsEditActive(false);
    }
  };

  return (
    <>
      <div
        className={clsx(
          "flex flex-wrap space-x-0 gap-x-4 gap-y-2 sm:flex-col sm:gap-y-5 pb-3 pt-1 sm:pt-2",
          className,
        )}
      >
        <Info
          className="items-center"
          Icon={CalendarDaysIcon}
          label="created-at"
        >
          <p className="text-xs text-default-700 font-semibold md:font-normal">
            {fullDate}
          </p>
        </Info>
        <Info className="items-center" Icon={CheckBadgeIcon} label="status">
          <Chip
            size="sm"
            variant="dot"
            className="border-none -ml-2"
            classNames={{
              content: "text-default-700 font-semibold md:font-normal",
            }}
            color={StatusChipColor[status as keyof typeof StatusChipColor]}
          >
            {statusLabel}
          </Chip>
        </Info>
        <Info
          className="items-center"
          Icon={PresentationChartLineIcon}
          label="priority"
        >
          <div className="flex items-center flex-row">
            {isEditActive || (
              <Chip
                size="sm"
                variant="flat"
                classNames={{
                  content: "font-semibold",
                }}
                color={
                  PriorityChipColor[priority as keyof typeof PriorityChipColor]
                }
              >
                {priorityLabel}
              </Chip>
            )}
            {isEditActive && (
              <Select
                className="w-full"
                classNames={{
                  trigger: "h-fit pr-4",
                  popoverContent: "w-30",
                }}
                radius="lg"
                variant="bordered"
                size="sm"
                renderValue={(items) => {
                  const colorKey = (items[0].key as string).toUpperCase();
                  return (
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        size="sm"
                        key={items[0].key}
                        variant="flat"
                        color={
                          PriorityChipColor[
                            colorKey as keyof typeof PriorityChipColor
                          ]
                        }
                      >
                        {t(`priority-${items[0].key}`)}
                      </Chip>
                    </div>
                  );
                }}
                name="priority"
                selectionMode="single"
                isMultiline
                selectedKeys={selectedPriority}
                items={priorityOptions}
                onSelectionChange={(keys) =>
                  setSelectedPriority(keys as Set<string>)
                }
              >
                {(item) => <SelectItem>{t(item.labelKey)}</SelectItem>}
              </Select>
            )}
            {isEditable && (
              <Button
                isIconOnly
                size="sm"
                onPress={
                  isEditActive ? savePriority : () => setIsEditActive(true)
                }
                radius="lg"
                variant="solid"
                className="bg-white"
                startContent={
                  isEditActive ? (
                    <CheckCircleIcon className="size-6 text-primary" />
                  ) : (
                    <PencilIcon className="size-4 text-default-500" />
                  )
                }
              />
            )}
          </div>
        </Info>
        <Info Icon={FolderOpenIcon} className="items-center" label="category">
          <Chip
            classNames={{ content: "font-semibold md:font-normal" }}
            variant="bordered"
            size="sm"
          >
            {categoryLabel}
          </Chip>
        </Info>
        {!hasNoAddress && (
          <Info
            Icon={MapPinIcon}
            label="address"
            className="items-center sm:items-start"
          >
            <span className="text-xs flex flex-wrap gap-x-1 text-default-700">
              <p className="font-semibold md:font-normal">{fullAddress}</p>
              <Link
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 font-semibold hover:underline"
              >
                {t("visit-map-link-text")}
              </Link>
            </span>
          </Info>
        )}
      </div>
      <Description
        description={report?.description as string}
        followUpQuestions={followUpQuestions}
      />
    </>
  );
};
