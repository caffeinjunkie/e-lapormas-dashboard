import { CalendarDate } from "@heroui/calendar";
import { Chip } from "@heroui/chip";
import { DateRangePicker } from "@heroui/date-picker";
import { Form } from "@heroui/form";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import {
  CalendarDateTime,
  ZonedDateTime,
  parseDate,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { RangeValue } from "@react-types/shared";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import useSWR from "swr";

import { categoryOptions, priorityOptions } from "./config";
import { appendParam } from "./handlers";

import { fetchAllAdmins } from "@/api/admin";
import { Modal, ModalButtonProps } from "@/components/modal";
import { UserAva } from "@/components/user-ava";
import { usePrivate } from "@/providers/private-provider";
import { AdminData } from "@/types/user.types";

interface FilterModalProps {
  onClose: () => void;
  isOpen: boolean;
  onApplyFilter: (filterPrams: string) => void;
  queryParams: Record<string, string | number | string[] | undefined>;
  withFilterByUser?: boolean;
  isWideScreen?: boolean;
}

interface SelectItem {
  labelKey: string;
  id: string;
}

export const FilterModal = ({
  isOpen,
  onClose,
  queryParams,
  onApplyFilter,
  withFilterByUser = false,
  isWideScreen = false,
}: FilterModalProps) => {
  const {
    data: result,
    error,
    isValidating,
  } = useSWR(["admins", withFilterByUser], fetchAllAdmins);
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(
    new Set(queryParams.category?.toString().split(",") || []),
  );
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
    new Set(queryParams.pic?.toString().split(",") || []),
  );
  const [selectedPriority, setSelectedPriority] = useState<Set<string>>(
    new Set(queryParams.priority?.toString().split(",") || []),
  );
  const startDate = queryParams.startDate;
  const endDate = queryParams.endDate;
  const [dateRange, setDateRange] = useState<RangeValue<
    CalendarDate | CalendarDateTime | ZonedDateTime
  > | null>(
    startDate && endDate
      ? {
          start: parseDate(startDate as string),
          end: parseDate(endDate as string),
        }
      : null,
  );
  const { locale } = usePrivate();

  const adminItems =
    result?.data.map((admin: AdminData) => ({
      id: admin.user_id as string,
      labelKey: admin.display_name as string,
    })) || ([] as SelectItem[]);

  const onClear = () => {
    setSelectedCategory(new Set());
    setSelectedPriority(new Set());
    setSelectedUsers(new Set());
    setDateRange(null);
  };

  const t = useTranslations("ReportsPage");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filterParams = appendParam({
      ...queryParams,
      page: "1",
      category: Array.from(selectedCategory).join(","),
      priority: Array.from(selectedPriority).join(","),
      startDate: dateRange?.["start"].toString() || "",
      endDate: dateRange?.["end"].toString() || "",
      pic: Array.from(selectedUsers).join(","),
    });
    onApplyFilter(filterParams);
    onClose();
  };

  const renderSelect = (
    name: string,
    items: SelectItem[],
    selectedItems: Set<string>,
    setItems: (keys: Set<string>) => void,
  ) => {
    return (
      <Select
        className="w-full"
        classNames={{
          trigger: "h-fit",
        }}
        radius="md"
        renderValue={(items) => {
          if (name === "user") {
            const userData = result?.data.find(
              (item) => item.user_id === items[0].key,
            );
            return userData?.display_name || userData.email;
          }
          return (
            <div className="flex flex-wrap gap-2">
              {items.map(({ key }) => (
                <Chip size="sm" key={key}>
                  {t(`${name}-${key}`)}
                </Chip>
              ))}
            </div>
          );
        }}
        name={name}
        selectionMode={name === "user" ? "single" : "multiple"}
        isMultiline
        label={t(`reports-modal-${name}-select-label`)}
        selectedKeys={selectedItems}
        items={items}
        variant="bordered"
        placeholder={t(`reports-modal-${name}-placeholder-text`)}
        onSelectionChange={(keys) => setItems(keys as Set<string>)}
      >
        {(item) => (
          <SelectItem>
            {name === "user" ? (
              <UserAva
                description={
                  result?.data.find(
                    (admin: AdminData) => admin.user_id === item.id,
                  )?.email
                }
                displayName={item.labelKey || "-"}
                imageSrc={
                  result?.data.find(
                    (admin: AdminData) => admin.user_id === item.id,
                  )?.profile_img
                }
              />
            ) : (
              t(item.labelKey)
            )}
          </SelectItem>
        )}
      </Select>
    );
  };

  const modalButtons = [
    {
      title: t("clear-button-text"),
      className: "w-full sm:w-fit",
      formId: "filter-form",
      type: "reset",
      isDisabled:
        !selectedCategory.size &&
        !selectedPriority.size &&
        !dateRange &&
        !selectedUsers.size,
    },
    {
      title: t("apply-button-text"),
      className: "w-full sm:w-fit text-white",
      color: "warning",
      variant: "solid",
      formId: "filter-form",
      type: "submit",
    },
  ];

  return (
    <Modal
      className="focus:outline-none"
      onClose={onClose}
      isOpen={isOpen}
      buttons={modalButtons as ModalButtonProps[]}
    >
      <ModalHeader>
        <p>{t("filter-button-text")}</p>
      </ModalHeader>
      <ModalBody>
        <Form
          method="post"
          id="filter-form"
          onReset={onClear}
          onSubmit={onSubmit}
        >
          {renderSelect(
            "category",
            categoryOptions,
            selectedCategory,
            setSelectedCategory,
          )}
          {renderSelect(
            "priority",
            priorityOptions,
            selectedPriority,
            setSelectedPriority,
          )}
          {(withFilterByUser || error) && (
            <Skeleton isLoaded={!isValidating} className="w-full rounded-xl">
              {renderSelect(
                "user",
                adminItems,
                selectedUsers,
                setSelectedUsers,
              )}
            </Skeleton>
          )}
          <I18nProvider locale={locale}>
            <DateRangePicker
              label={t("reports-modal-date-range-label")}
              pageBehavior="single"
              aria-label="Date Range Picker"
              firstDayOfWeek="mon"
              value={dateRange}
              variant="bordered"
              onChange={setDateRange}
              visibleMonths={isWideScreen ? 2 : 1}
            />
          </I18nProvider>
        </Form>
      </ModalBody>
    </Modal>
  );
};
