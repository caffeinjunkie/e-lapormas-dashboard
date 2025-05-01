import { Button } from "@heroui/button";
import { CalendarDate, RangeValue } from "@heroui/calendar";
import { DateRangePicker } from "@heroui/date-picker";
import { Form, FormProps } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import {
  CalendarDateTime,
  ZonedDateTime,
  parseDate,
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

type DefaultValues = {
  title: string;
  description: string;
  period: RangeValue<CalendarDate | CalendarDateTime | ZonedDateTime>;
  images: File[];
};

export const AnnouncementForm = ({
  onSubmitAnnouncement,
  id,
  isSubmitLoading = false,
  selectedAnnouncement,
  onCancel,
}: AnnouncementFormProps) => {
  const t = useTranslations("AnnouncementsPage");
  const [files, setFiles] = useState<File[]>([]);
  const [defaultValues, setDefaultValues] = useState<DefaultValues | null>(
    null,
  );
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
          setDefaultValues(transformedAnnouncement as unknown as DefaultValues);
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
          <Textarea
            label={t("announcement-form-description-input-label")}
            isDisabled={isLoadLoading || isSubmitLoading}
            name="description"
            isRequired
            isClearable
            maxRows={3}
            maxLength={250}
            validate={(value) => validateIsRequired(t, value, "description")}
            defaultValue={selectedAnnouncement?.description}
            classNames={{
              inputWrapper: "flex-grow h-fit overflow-hidden",
              innerWrapper: "flex flex-col items-end pb-2",
            }}
          />
        </Skeleton>
        <Skeleton className="w-full rounded-xl" isLoaded={!isLoadLoading}>
          <DateRangePicker
            label={t("announcement-form-period-input-label")}
            pageBehavior="single"
            aria-label="Announcement Period"
            firstDayOfWeek="mon"
            value={dateRange}
            isDisabled={isLoadLoading || isSubmitLoading}
            onChange={setDateRange}
            errorMessage={t("required-period-error-message")}
            visibleMonths={1}
            isRequired
          />
        </Skeleton>
        <Skeleton className="w-full rounded-xl" isLoaded={!isLoadLoading}>
          <FileUploader
            files={files}
            imageType="announcement"
            isDisabled={isLoadLoading || isSubmitLoading}
            className="h-[225px]"
            isRequired
            setFiles={onSelectFiles}
            legend={t("upload-profile-picture-disclaimer-label")}
          />
          {filesError && (
            <p className="text-danger text-sm text-center pt-2">{filesError}</p>
          )}
        </Skeleton>

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
