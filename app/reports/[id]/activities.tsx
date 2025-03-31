import { Avatar } from "@heroui/avatar";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { ImageAttachment } from "../image-attachment";

import { Report } from "@/types/report.types";
import { AdminData } from "@/types/user.types";
import { formatLocaleDate } from "@/utils/string";

interface ActivitiesProps {
  data: Report["progress"];
  users: AdminData[];
}

export const Activities = ({ data, users }: ActivitiesProps) => {
  const getUserById = (id: string) => {
    return users.find((user) => user.user_id === id);
  };
  const t = useTranslations("ReportsPage");
  return (
    <div className="flex flex-col px-2">
      {data?.reverse().map((activity, index) => (
        <div key={index} className="flex flex-row gap-4">
          <div className="flex flex-col gap-1 items-center">
            <Avatar
              size="sm"
              isBordered
              color={activity.status === "IN_PROGRESS" ? "default" : "success"}
              className="mt-1"
              showFallback
              src={getUserById(activity.updated_by)?.profile_img}
              name={getUserById(activity.updated_by)?.display_name}
            />
            <div
              className={clsx(
                "w-1 flex-1",
                index === data.length - 1 && "hidden",
                data?.[index + 1]?.status === "IN_PROGRESS" && "bg-default-300",
                data?.[index + 1]?.status === "COMPLETED" && "bg-gradient-to-b from-50% from-default-300 to-success-500",
              )}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 pb-4">
            <p className="text-xs text-default-500">
              {
                t.rich(
                  `activity-${activity.status.replaceAll("_", "-").toLowerCase()}-text`,
                  {
                    user: getUserById(activity.updated_by)
                      ?.display_name as string,
                    message: `"${activity.message}"`,
                    bold: (chunks) => (
                      <strong className="text-default-700">{chunks}</strong>
                    ),
                  },
                ) as string
              }
            </p>
            <p className="text-xs text-default-500 pb-1">
              {formatLocaleDate(activity.updated_at, "long-relative")}
            </p>
            {activity.img && (
              <ImageAttachment
                className="w-fit flex"
                src={activity.img}
                alt={activity.message}
                onPress={() => {}}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
