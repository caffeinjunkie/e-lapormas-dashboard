"use client";

import {
  CheckCircleIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Textarea } from "@heroui/input";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ImageAttachment } from "../image-attachment";

import { FileUploader } from "@/components/file-uploader";
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
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files, "fils");
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const renderActions = () => {
    if (status === "COMPLETED") return null;
    if (status === "IN_PROGRESS") {
      return (
        <div
          className={clsx(
            "flex bg-white rounded-3xl flex-col w-full gap2",
            !isIntersecting
              ? "md:shadow-[rgba(5,5,5,0.1)_0_-1px_10px_0px] lg:shadow-none"
              : "",
          )}
        >
          <Form className="flex flex-col sm:flex-row lg:flex-col w-full gap-3">
            <div className="w-full">
              <Textarea
                variant="bordered"
                isClearable
                isRequired
                maxRows={5}
                rows={5}
                endContent={
                  <div className="flex w-full absolute bottom-1 right-1 justify-end">
                    <Button
                      color="default"
                      isIconOnly
                      size="sm"
                      onPress={() =>
                        setIsImageUploaderOpen(!isImageUploaderOpen)
                      }
                      variant="light"
                      startContent={<PaperClipIcon className="size-4" />}
                      className="w-fit"
                    />
                  </div>
                }
                label={t("activity-message-label")}
                classNames={{
                  inputWrapper: "flex-grow h-fit",
                  innerWrapper: "flex flex-col items-end",
                }}
                placeholder={t("activity-message-placeholder")}
              />
              <input
                id="selectImage"
                max="1"
                accept="image/*"
                hidden
                type="file"
                onChange={onSelectFiles}
              />
            </div>
            <div className="flex flex-col w-full sm:w-fit lg:w-full gap-2 sm:gap-0.5 lg:gap-2">
              <Button
                id="sendUpdate"
                color="warning"
                startContent={
                  <PaperAirplaneIcon className="size-4 -rotate-45 mb-1" />
                }
                className="w-full text-white"
              >
                {t("activity-follow-up-button-text")}
              </Button>
              <p className="text-xs text-center text-default-500">
                {t("activity-or-text")}
              </p>
              <Button
                id="finishReport"
                color="success"
                isDisabled={data.length < 2}
                startContent={<CheckCircleIcon className="size-5" />}
                className="w-full text-white"
              >
                {t("activity-finish-button-text")}
              </Button>
              {data.length < 2 && (
                <p className="text-xs text-center text-default-500 pt-0 sm:pt-1 lg:pt-0">
                  {t("activity-min-2-activity-text")}
                </p>
              )}
            </div>
          </Form>
        </div>
      );
    }
    return (
      <div className="flex bg-white flex-col px-4 gap-4 w-full justify-center items-center h-24 pb-12 md:pb-0 md:h-32 lg:h-96">
        <p className="text-center text-xs text-default-500">
          {t("activity-empty-text")}
        </p>
        <div
          className={clsx(
            "bg-white flex w-full transition-all duration-1000 ease-in-out animate-slide-up sm:animate-none py-4 px-6",
            "justify-center absolute md:static bottom-0",
            !isIntersecting
              ? "shadow-[rgba(5,5,5,0.1)_0_-1px_10px_0px] md:shadow-none"
              : "shadow-none",
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
    <div className="flex flex-col">
      {data?.length > 0 && (
        <div className="flex flex-col flex-grow px-2">
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
                    duration: 0.5,
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
