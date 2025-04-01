"use client";

import {
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Form } from "@heroui/form";
import { Textarea } from "@heroui/input";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { forwardRef, useRef, useState } from "react";

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
    onFinishReport: (e: React.FormEvent, files: File[]) => void;
    onSendUpdate: (e: React.FormEvent, files: File[]) => void;
  };
  users: AdminData[];
  onImagePress: (images: { src: string; key: string }[], index: number) => void;
}

export const Activities = forwardRef<HTMLDivElement, ActivitiesProps>(
  ({ data, status, isIntersecting, actions, users, onImagePress }, ref) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isMarkedAsCompleted, setIsMarkedAsCompleted] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
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
      setFileError(null);
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 1) {
        return;
      }
      if (selectedFiles[0].size > 2000000) {
        console.log(selectedFiles[0].size, "error");
        setFileError(t("activity-file-size-error-message"));
        return;
      }
      if (!selectedFiles[0].type.includes("image")) {
        setFileError(t("activity-file-type-error-message"));
        return;
      }
      setFiles(selectedFiles);
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
            <div className="absolute bottom-4 right-4">
              <Button
                color="warning"
                isIconOnly
                onPress={() => {
                  textAreaRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  textAreaRef.current?.focus({ preventScroll: true });
                }}
                startContent={
                  <ChatBubbleBottomCenterTextIcon className="size-5 text-white" />
                }
                className={clsx("w-fit shadow-md", isIntersecting && "hidden")}
              />
            </div>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (isMarkedAsCompleted) {
                  actions.onFinishReport(e, files);
                } else {
                  actions.onSendUpdate(e, files);
                }
              }}
              className="flex flex-col sm:flex-row items-center lg:flex-col w-full gap-3"
            >
              <div className="w-full">
                <Textarea
                  variant="bordered"
                  ref={textAreaRef}
                  isClearable
                  isRequired
                  isInvalid={!!fileError}
                  errorMessage={fileError}
                  maxRows={2}
                  rows={2}
                  endContent={
                    <div className="flex flex-row items-center absolute bottom-1 right-1 justify-end">
                      {files.length > 0 && (
                        <Chip
                          size="sm"
                          color="default"
                          startContent={<PaperClipIcon className="size-4" />}
                          onClose={() => setFiles([])}
                        >
                          {files[0].name.length > 20
                            ? `${files[0].name.slice(0, 20)}...`
                            : files[0].name}
                        </Chip>
                      )}
                      <Button
                        color="default"
                        isIconOnly
                        size="sm"
                        onPress={() => imageInputRef.current?.click()}
                        variant="light"
                        startContent={<PaperClipIcon className="size-4" />}
                        className="w-fit"
                      />
                    </div>
                  }
                  label={t("activity-message-label")}
                  classNames={{
                    inputWrapper: "flex-grow h-fit overflow-hidden",
                    innerWrapper: "flex flex-col items-end pb-2",
                  }}
                  placeholder={t("activity-message-placeholder")}
                />
                <input
                  id="selectImage"
                  max={1}
                  accept="image/*"
                  hidden
                  ref={imageInputRef}
                  value=""
                  type="file"
                  onChange={onSelectFiles}
                />
              </div>
              <div className="flex flex-col w-full sm:w-fit lg:w-full gap-2 sm:gap-0.5 lg:gap-2">
                <Button
                  type="submit"
                  color={isMarkedAsCompleted ? "success" : "warning"}
                  isDisabled={isMarkedAsCompleted ? data.length < 2 : false}
                  startContent={
                    isMarkedAsCompleted ? (
                      <CheckCircleIcon className="size-5" />
                    ) : (
                      <PaperAirplaneIcon className="size-4 -rotate-45 mb-1" />
                    )
                  }
                  className="w-full text-white"
                >
                  {isMarkedAsCompleted
                    ? t("activity-finish-button-text")
                    : t("activity-follow-up-button-text")}
                </Button>
                <Checkbox
                  size="sm"
                  checked={isMarkedAsCompleted}
                  onChange={(e) => setIsMarkedAsCompleted(e.target.checked)}
                  color="success"
                  classNames={{ icon: "text-white" }}
                >
                  {t("activity-mark-as-completed-text")}
                </Checkbox>
              </div>
            </Form>
            {isMarkedAsCompleted && data.length < 2 && (
              <p className="text-xs text-center text-default-500 pt-2">
                {t("activity-min-2-activity-text")}
              </p>
            )}
          </div>
        );
      }
      return (
        <div className="flex bg-white flex-col px-4 gap-4 w-full justify-center items-center h-24 pb-12 lg:pb-0 md:h-32 lg:h-96">
          <p className="text-center text-xs text-default-500">
            {t("activity-empty-text")}
          </p>
          <div
            className={clsx(
              "flex w-full transition-all duration-1000 ease-in-out animate-slide-up sm:animate-none py-4 px-6",
              "justify-center absolute lg:static bottom-0",
              !isIntersecting
                ? "bg-white shadow-[rgba(5,5,5,0.1)_0_-1px_10px_0px] lg:shadow-none"
                : "shadow-none",
            )}
          >
            <Button
              color="primary"
              className={clsx("w-full lg:w-fit")}
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
                            <strong className="text-default-700">
                              {chunks}
                            </strong>
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
  },
);

Activities.displayName = "Activities";
