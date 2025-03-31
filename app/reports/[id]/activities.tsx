"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { ImageAttachment } from "../image-attachment";

import { AchievementIcon, BellIcon, ClockIcon } from "@/components/icons";
import { Progress } from "@/types/report.types";
import { AdminData } from "@/types/user.types";
import { formatLocaleDate } from "@/utils/string";

interface ActivitiesProps {
  data: Progress[];
  status: string;
  isIntersecting: boolean;
  actions: {
    onAcceptReport: () => void;
    onFinishReport: () => void;
    onSendUpdate: () => void;
  };
  users: AdminData[];
  onImagePress: (images: { src: string; key: string }[], index: number) => void;
}

export const Activities = ({
  data,
  status,
  isIntersecting,
    actions,
  users,
  onImagePress,
}: ActivitiesProps) => {
  const getUserById = (id: string) => {
    return users.find((user) => user.user_id === id);
  };
  const t = useTranslations("ReportsPage");

  const avaIcon = {
    IN_PROGRESS: <ClockIcon size={20} />,
    COMPLETED: <AchievementIcon size={20} />,
  };

  const onPressAttachment = (img: string) => {
    onImagePress([{ src: img, key: "0" }], 0);
  };

  const renderActions = () => {
    if (status === "COMPLETED") return null;
    if (status === "IN_PROGRESS") {
      return <div>message</div>;
    }
    return (
      <div className="flex bg-white flex-col px-4 gap-4 w-full justify-center items-center h-24 pb-12 md:pb-0 md:h-32 lg:h-96 rounded-xl">
        <p className="text-center text-xs text-default-500">
          {t("activity-empty-text")}
        </p>
        <div
          className={clsx("bg-white flex w-full transition-all duration-1000 ease-in-out animate-slide-up sm:animate-none py-4 px-6",
            "justify-center absolute md:static bottom-0",
            !isIntersecting ? "shadow-[rgba(5,5,5,0.1)_0_-1px_10px_0px] md:shadow-none" : "shadow-none"
          )}
        >
          <Button
            color="primary"
            className="w-full md:w-fit"
            onPress={actions.onAcceptReport}
          >
            {t("activity-accept-button-text")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col px-2">
      {data?.length > 0 && (
        <div className="flex flex-col flex-grow">
          {data?.reverse().map((activity, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 * (index + 1), ease: "easeInOut" }}
              key={index}
              className="flex flex-row gap-4"
            >
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.3 * (index + 1),
                  ease: "easeInOut",
                }}
                className="flex flex-col gap-1 items-center"
              >
                <Avatar
                  size="sm"
                  isBordered
                  color={
                    activity.status === "IN_PROGRESS" ? "default" : "success"
                  }
                  className="mt-1"
                  showFallback
                  fallback={
                    index === 0 ? (
                      <BellIcon size={20} />
                    ) : (
                      avaIcon[activity.status]
                    )
                  }
                  name={getUserById(activity.updated_by)?.display_name}
                />
                <motion.div
                  initial={{ flex: 0 }}
                  animate={{ flex: 1 }}
                  transition={{
                    duration: 0.5 * (index + 1),
                    delay: 0.3 * (index + 1),
                    ease: "easeInOut",
                  }}
                  className={clsx(
                    "border-l-1 border-r-1 border-dashed border-default-300",
                    index === data.length - 1 && "hidden",
                  )}
                />
              </motion.div>
              <div className="flex flex-1 flex-col gap-1 pb-4">
                <p className="text-xs text-default-500">
                  {index === 0
                    ? t.rich("activity-accepted-text", {
                        user: getUserById(activity.updated_by)
                          ?.display_name as string,
                        bold: (chunks) => (
                          <strong className="text-default-700">{chunks}</strong>
                        ),
                      })
                    : (t.rich(
                        `activity-${activity.status.replaceAll("_", "-").toLowerCase()}-text`,
                        {
                          user: getUserById(activity.updated_by)
                            ?.display_name as string,
                          message: `"${activity.message}"`,
                          bold: (chunks) => (
                            <strong className="text-default-700">
                              {chunks}
                            </strong>
                          ),
                        },
                      ) as string)}
                </p>
                <p className="text-xs text-default-500 pb-1">
                  {formatLocaleDate(activity.updated_at, "long-relative")}
                </p>
                {activity.img && (
                  <ImageAttachment
                    className="w-fit flex"
                    onPress={() => onPressAttachment(activity.img || "")}
                    src={activity.img}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {renderActions()}
    </div>
  );
};
