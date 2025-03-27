import { EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

import { PriorityChipColor, PriorityLabel } from "./config";

import { TooltipButton } from "@/components/tooltip-button";
import { Report } from "@/types/report.types";
import { formatLocaleDate } from "@/utils/string";

interface ReportCellProps {
  columnKey: string;
  report: Report;
  isMobile: boolean;
  isWideScreen: boolean;
  onPressPeek: () => void;
}

export const ReportCell = ({
  columnKey,
  report,
  isMobile,
  isWideScreen,
  onPressPeek,
}: ReportCellProps) => {
  const t = useTranslations("ReportsPage");
  const cellValue = report[columnKey as keyof Report];
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
                    onClick={() => redirect(`/reports/${report.tracking_id}`)}
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
              <div
                className={`flex flex-col items-center gap-1 w-24 p-1 rounded-lg justify-end bg-default-50`}
              >
                <p className="text-[10px]">
                  {t("table-priority-column-label")}
                </p>
                <Chip
                  color={
                    PriorityChipColor[
                      report.priority as keyof typeof PriorityChipColor
                    ]
                  }
                  size="sm"
                  variant="flat"
                  className={clsx("min-w-full text-center rounded-md")}
                >
                  <p className="font-medium">
                    {t(
                      `${PriorityLabel[report.priority as keyof typeof PriorityLabel]}`,
                    ).toUpperCase()}
                  </p>
                </Chip>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              className="w-full"
              variant="ghost"
              color="primary"
              startContent={<EyeIcon className="size-4" />}
              onPress={onPressPeek}
            >
              {t("peek-tooltip-text")}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <Link
            onClick={() => redirect(`/reports/${report.tracking_id}`)}
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
      return <p className="text-sm">{formatLocaleDate(report.created_at)}</p>;
    case "priority":
      return (
        <Chip
          color={
            PriorityChipColor[report.priority as keyof typeof PriorityChipColor]
          }
          variant="flat"
          size="sm"
        >
          <p className="font-medium">
            {t(
              PriorityLabel[report.priority as keyof typeof PriorityLabel],
            ).toUpperCase()}
          </p>
        </Chip>
      );
    case "actions":
      return (
        <div className="flex flex-col items-center">
          <TooltipButton
            className="text-white"
            onPress={onPressPeek}
            color="foreground"
            content={t("peek-tooltip-text")}
            icon={<EyeIcon className="size-4" />}
          />
        </div>
      );
    default:
      return null;
  }
};
