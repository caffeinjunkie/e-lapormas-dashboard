import { EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
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
  isWideScreen: boolean;
}

export const ReportCell = ({
  columnKey,
  report,
  isMobile,
  isWideScreen,
}: ReportCellProps) => {
  const t = useTranslations("ReportsPage");
  const cellValue = report[columnKey as keyof ReportCellType];
  const village = report.address?.village || "";
  const district = report.address?.district || "";
  const location = village || district || "-";

  switch (columnKey) {
    case "report":
      const formattedDate = formatLocaleDate(report.created_at);
      return isMobile ? (
        <Card>
          <CardBody>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col w-full">
                <div className="flex flex-row items-center gap-1 text-xs">
                  <Link
                    onClick={() => console.log(report.id, "te")}
                    className="text-xs hover:cursor-pointer"
                  >
                    #{report.tracking_id}
                  </Link>
                  <span className="text-default-500">|</span>
                  <p className="line-clamp-1 text-default-500">
                    {t(`category-${report.category}`)}
                  </p>
                </div>
                <p className="text-md font-semibold line-clamp-2">
                  {report.title}
                </p>
                <div className="flex flex-row items-center gap-1 pt-0.5 text-default-500 text-xs">
                  {location !== "-" && <p>{location}</p>}
                  {location !== "-" && (
                    <span className="text-default-500">|</span>
                  )}
                  <p>{formattedDate}</p>
                </div>
              </div>
              <div className="flex flex-row items-start gap-4  w-fit px-2 justify-end">
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xs">
                    {t("table-priority-column-label").toUpperCase()}
                  </p>
                  <Chip
                    color={
                      PriorityColor[
                        report.priority as keyof typeof PriorityColor
                      ]
                    }
                    radius="sm"
                    variant="solid"
                    className={report.priority !== "LOW" ? "text-white" : ""}
                  >
                    {t(
                      `${PriorityLabel[report.priority as keyof typeof PriorityLabel]}-short`,
                    )}
                  </Chip>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xs">
                    {t("table-status-column-label").toUpperCase()}
                  </p>
                  <Chip
                    color={
                      StatusColor[report.status as keyof typeof StatusColor]
                    }
                    radius="sm"
                    variant="flat"
                  >
                    {t(
                      `${StatusLabel[report.status as keyof typeof StatusLabel]}-short`,
                    )}
                  </Chip>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              className="w-full"
              variant="ghost"
              color="primary"
              startContent={<EyeIcon className="size-4" />}
              onPress={() => console.log(report.id)}
            >
              {t("detail-tooltip-text")}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <Link
            onClick={() => console.log(report.tracking_id)}
            className="text-xs hover:cursor-pointer"
          >
            #{report.tracking_id}
          </Link>
          <p className="text-md font-semibold line-clamp-2">{report.title}</p>
          {!isWideScreen && (
            <p className="text-xs pt-1 text-default-500">{formattedDate}</p>
          )}
        </div>
      );
    case "category":
      return <p className="text-sm">{t(`category-${cellValue}`)}</p>;
    case "location":
      return <p className="text-sm">{location}</p>;
    case "created_at":
      return <p className="text-sm">{formatLocaleDate(cellValue)}</p>;
    case "priority":
      return (
        <Chip
          className={report.priority !== "LOW" ? "text-white" : ""}
          color={PriorityColor[report.priority as keyof typeof PriorityColor]}
          size="sm"
          variant="solid"
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
