import { Button } from "@heroui/button";
import { CalendarDate, RangeValue } from "@heroui/calendar";
import { DateRangePicker } from "@heroui/date-picker";
import { Form, FormProps } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { Switch } from "@heroui/switch";
import {
  CalendarDateTime,
  ZonedDateTime,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";

import { transformAnnouncementToDefaultValues } from "./utils";

import { FileUploader } from "@/components/file-uploader";
import { Announcement } from "@/types/announcement.types";
import { validateIsRequired } from "@/utils/string";

interface AnnouncementFormProps extends FormProps {
  isSubmitLoading: boolean;
  selectedAnnouncement?: Announcement;
  onCancel?: () => void;
  onSubmitAnnouncement: (
    e: FormEvent<HTMLFormElement>,
    startDate: string,
    endDate: string,
    files: File[],
  ) => void;
}

export const AnnouncementForm = ({
  onSubmitAnnouncement,
  id,
  isSubmitLoading = false,
  selectedAnnouncement,
  onCancel,
}: AnnouncementFormProps) => {
  const t = useTranslations("AnnouncementsPage");
  const [files, setFiles] = useState<File[]>([]);
  const [dateRange, setDateRange] = useState<RangeValue<
    CalendarDate | CalendarDateTime | ZonedDateTime
  > | null>(null);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [isLoadLoading, setIsLoadLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      setFilesError(t("required-image-error-message"));
      return;
    }
    const startDate = dateRange?.["start"].toString() || "";
    const endDate = dateRange?.["end"].toString() || "";
    setFilesError(null);
    onSubmitAnnouncement(e, startDate, endDate, files);
  };

  useEffect(() => {
    async function transformAnnouncement() {
      if (selectedAnnouncement) {
        setIsLoadLoading(true);
        try {
          const transformedAnnouncement =
            await transformAnnouncementToDefaultValues(selectedAnnouncement);
          setDateRange({
            start: parseDate(transformedAnnouncement.period.start),
            end: parseDate(transformedAnnouncement.period.end),
          });
          setFiles(transformedAnnouncement.images);
        } catch (error) {
          console.error("Error transforming announcement:", error);
        } finally {
          setIsLoadLoading(false);
        }
      }
    }
    transformAnnouncement();
  }, [selectedAnnouncement]);

  const onSelectFiles = (files: File[]) => {
    setFilesError(null);
    setFiles(files);
  };

  return (
    <div>
      <Form
        className="flex flex-col gap-3"
        id={id}
        method="post"
        onSubmit={onSubmit}
      >
        <Skeleton className="w-full rounded-xl" isLoaded={!isLoadLoading}>
          <Input
            label={t("announcement-form-title-input-label")}
            type="text"
            isDisabled={isLoadLoading || isSubmitLoading}
            name="title"
            isRequired
            maxLength={100}
            validate={(value) => validateIsRequired(t, value, "title")}
            defaultValue={selectedAnnouncement?.title}
          />
        </Skeleton>
        <Skeleton className="w-full rounded-xl" isLoaded={!isLoadLoading}>
          <Input
            label={t("announcement-form-url-input-label")}
            type="text"
            isDisabled={isLoadLoading || isSubmitLoading}
            name="url"
            defaultValue={selectedAnnouncement?.url}
          />
        </Skeleton>
        <Skeleton className="w-full rounded-xl" isLoaded={!isLoadLoading}>
          <DateRangePicker
            label={t("announcement-form-period-input-label")}
            pageBehavior="single"
            aria-label="Announcement Period"
            firstDayOfWeek="mon"
            value={dateRange}
            minValue={today(getLocalTimeZone())}
            isDisabled={isLoadLoading || isSubmitLoading}
            onChange={setDateRange}
            errorMessage={t("required-period-error-message")}
            visibleMonths={1}
            isRequired
          />
        </Skeleton>
        <Switch
          isDisabled={isLoadLoading || isSubmitLoading}
          name="is_auto_delete_switch"
          size="sm"
          defaultSelected={
            id === "edit-announcement"
              ? selectedAnnouncement?.is_auto_delete
              : true
          }
        >
          {t("announcement-form-auto-delete-switch-label")}
        </Switch>
        <div className="flex flex-col gap-2 items-center justify-center">
          <FileUploader
            files={files}
            imageType="announcement"
            isLoading={isLoadLoading}
            isDisabled={isLoadLoading || isSubmitLoading}
            className="h-[225px]"
            isRequired
            setFiles={onSelectFiles}
            legend={t("upload-profile-picture-disclaimer-label")}
          />
          {filesError && (
            <p className="text-danger text-xs text-center pt-1">{filesError}</p>
          )}
        </div>
        <div className="flex gap-2 justify-center md:justify-end w-full py-2">
          <Button
            variant="light"
            color="default"
            className="w-full md:w-fit"
            onPress={onCancel}
            title={t("annoucement-form-cancel-button-text")}
          >
            {t("annoucement-form-cancel-button-text")}
          </Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            isLoading={isSubmitLoading}
            className="w-full md:w-fit"
            title={t("annoucement-form-submit-button-text")}
          >
            {t("annoucement-form-submit-button-text")}
          </Button>
        </div>
      </Form>
    </div>
  );
};
