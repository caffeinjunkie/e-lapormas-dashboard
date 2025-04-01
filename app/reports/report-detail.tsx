import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  FolderOpenIcon,
  MapPinIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { Chip } from "@heroui/chip";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { PriorityChipColor, StatusChipColor } from "@/app/reports/config";
import { Description } from "@/app/reports/description";
import { Info } from "@/app/reports/info";
import { Report } from "@/types/report.types";
import { formatLocaleDate } from "@/utils/string";

interface ReportDetailProps {
  report: Report;
  className?: string;
}

export const ReportDetail = ({ report, className }: ReportDetailProps) => {
  const t = useTranslations("ReportsPage");
  const followUpQuestions = report?.data?.follow_up_questions || [];
  const fullDate = formatLocaleDate(report?.created_at || "", "long");
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
