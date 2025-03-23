import { EyeIcon } from "@heroicons/react/24/outline";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { useTranslations } from "next-intl";

import {
  PriorityColor,
  PriorityLabel,
  StatusColor,
  StatusLabel,
} from "./config";

import { TooltipButton } from "@/components/tooltip-button";
import { ReportCellType } from "@/types/report.types";
import { formatLocaleDate } from "@/utils/string";

interface ReportCellProps {
  columnKey: string;
  report: any;
  isMobile: boolean;
  isLast: boolean;
}

export const ReportCell = ({
  columnKey,
  report,
  isMobile,
  isLast,
}: ReportCellProps) => {
  const t = useTranslations("ReportsPage");
  const cellValue = report[columnKey as keyof ReportCellType];

  switch (columnKey) {
    case "uid_name":
      return isMobile ? (
        <div
          className={`${isLast ? "border-b-0 pb-0" : "border-b-1 border-default-200 pb-4"}`}
        >
          <p className="flex items-center justify-between">{report.title}</p>
        </div>
      ) : (
        <div>
          <Link href={`/reports/${report.id}`} className="text-xs">
            #{report.id}
          </Link>
          <p className="flex items-center text-md font-medium justify-between">
            {report.title}
          </p>
        </div>
      );
    case "location":
      const village = report.address.village;
      const district = report.address.district;
      return <p className="text-sm">{village || district || "-"}</p>;
    case "created_at":
      const formattedDate = formatLocaleDate(report.createdDate);
      return <p className="text-sm">{formattedDate}</p>;
    case "priority":
      return (
        <Chip
          className={report.priority !== "MID" ? "text-white" : ""}
          color={PriorityColor[report.priority as keyof typeof PriorityColor]}
          size="sm"
          variant="shadow"
        >
          {t(PriorityLabel[report.priority as keyof typeof PriorityLabel])}
        </Chip>
      );
    case "status":
      return (
        <Chip
          className="border-none"
          color={StatusColor[report.status as keyof typeof StatusColor]}
          size="sm"
          variant="dot"
        >
          {t(StatusLabel[report.status as keyof typeof StatusLabel])}
        </Chip>
      );
    case "actions":
      return (
        <div className="flex flex-col items-center">
          <TooltipButton
            className="text-white"
            onPress={() => console.log(report.id)}
            color="foreground"
            content={t("detail-tooltip-text")}
            icon={<EyeIcon className="size-4" />}
          />
        </div>
      );
    default:
      return cellValue;
  }
};
