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
import { ToastProps, addToast } from "@heroui/toast";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FormEvent, useRef, useState } from "react";

import { ImageAttachment } from "../image-attachment";
import { checkUpdatedProgressToday } from "./utils";

import { AchievementIcon, BellIcon, ClockIcon } from "@/components/icons";
import { Progress } from "@/types/report.types";
import { AdminData } from "@/types/user.types";
import { buildFormData } from "@/utils/form";
import { formatLocaleDate } from "@/utils/string";

interface ActivitiesProps {
  data: Progress[];
  status: string;
  isIntersecting: boolean;
  actions: {
    onAcceptReport: () => void;
    onFinishReport: (message: string, files: File[]) => void;
    onSendUpdate: (message: string, files: File[]) => void;
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isMarkedAsCompleted, setIsMarkedAsCompleted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [messageCounter, setMessageCounter] = useState(0);

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
    if (selectedFiles[0].size > 1000000) {
      setFileError(t("activity-file-size-error-message"));
    }
    if (!selectedFiles[0].type.includes("image")) {
      setFileError(t("activity-file-type-error-message"));
    }
    setFiles(selectedFiles);
  };

  const onClearFiles = () => {
    setFiles([]);
    setFileError(null);
    textAreaRef.current!.checkValidity();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);
    const message = formData.get("message") as string;
    const hasUpdatedTwiceToday = checkUpdatedProgressToday(data);
    if (files.length < 1) {
      setFileError(t("activity-files-error-message"));
      return;
    }
    if (isMarkedAsCompleted) {
      actions.onFinishReport(message, files);
    } else if (hasUpdatedTwiceToday) {
      const toastProps = {
        title: t("activity-update-error-title"),
        description: t("activity-update-error-message"),
        color: "danger",
      };
      addToast(toastProps as ToastProps);
    } else {
      actions.onSendUpdate(message, files);
    }
  };

  const onAcceptButtonPress = () => {
    actions.onAcceptReport();
  };

  const renderActions = () => {
    if (status === "COMPLETED") return null;
    if (status === "IN_PROGRESS") {
      return (
        <div className={clsx("flex bg-white flex-col w-full gap2")}>
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
              className={clsx(
                "w-fit shadow-md z-40",
                isIntersecting && "hidden",
              )}
            />
          </div>
          <Form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row items-start lg:flex-col w-full gap-3"
          >
            <div className="w-full">
              <Textarea
                variant="bordered"
                ref={textAreaRef}
                isClearable
                name="message"
                isRequired
                maxLength={100}
                onClear={() => {
                  textAreaRef.current!.value = "";
                  textAreaRef.current!.checkValidity();
                  setFileError(null);
                }}
                isInvalid={!!fileError}
                errorMessage={fileError}
                validate={(value) => {
                  if (!value) {
                    return t("activity-message-error-message");
                  }
                  return null;
                }}
                onChange={(e) => {
                  setMessageCounter(e.target.value.length);
                }}
                maxRows={2}
                rows={2}
                endContent={
                  <div className="flex flex-row items-center absolute bottom-1 right-1 justify-end">
                    {files.length > 0 && (
                      <Chip
                        size="sm"
                        variant="bordered"
                        color={fileError ? "danger" : "default"}
                        startContent={<PaperClipIcon className="size-4" />}
                        onClose={onClearFiles}
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
              <p className="text-xs text-right pt-1 text-default-500">
                {messageCounter || 0}/100
              </p>
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
            onPress={onAcceptButtonPress}
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
          {data?.map((activity, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.1 * index,
                ease: "easeInOut",
              }}
              key={index}
              className="flex flex-row gap-4"
            >
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.2 * index,
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
                    duration: 0.3 + index / 10,
                    delay: 0.3 * index,
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

Activities.displayName = "Activities";
