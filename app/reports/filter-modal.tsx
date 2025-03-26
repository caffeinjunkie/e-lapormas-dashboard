import { XCircleIcon } from "@heroicons/react/24/solid";
import { CalendarDate } from "@heroui/calendar";
import { Chip } from "@heroui/chip";
import { DateRangePicker } from "@heroui/date-picker";
import { Form } from "@heroui/form";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { CalendarDateTime, ZonedDateTime } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { RangeValue } from "@react-types/shared";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { categoryOptions, priorityOptions } from "./config";

import { FilterType } from "@/api/tasks";
import { Modal, ModalButtonProps } from "@/components/modal";
import { usePrivate } from "@/providers/private-provider";

interface FilterModalProps {
  onClose: () => void;
  isOpen: boolean;
  onApplyFilter: (filters: FilterType[]) => void;
}

interface SelectItem {
  labelKey: string;
  id: string;
}

export const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilter,
}: FilterModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(
    new Set(),
  );
  const [selectedPriority, setSelectedPriority] = useState<Set<string>>(
    new Set(),
  );
  const [dateRange, setDateRange] = useState<RangeValue<
    CalendarDate | CalendarDateTime | ZonedDateTime
  > | null>(null);
  const { locale } = usePrivate();

  const onClear = () => {
    setSelectedCategory(new Set());
    setSelectedPriority(new Set());
    setDateRange(null);
  };

  const t = useTranslations("ReportsPage");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filters: FilterType[] = [];
    if (selectedCategory.size > 0) {
      filters.push({
        field: "category",
        operator: "in",
        value: Array.from(selectedCategory),
      });
    }
    if (selectedPriority.size > 0) {
      filters.push({
        field: "priority",
        operator: "in",
        value: Array.from(selectedPriority).map((item) => item.toUpperCase()),
      });
    }
    if (dateRange) {
      filters.push({
        field: "created_at",
        operator: "gte",
        value: dateRange["start"].toString(),
      });
      filters.push({
        field: "created_at",
        operator: "lte",
        value: dateRange["end"].toString(),
      });
    }
    onApplyFilter(filters);
    onClose();
  };

  const renderSelect = (
    name: string,
    items: SelectItem[],
    selectedItems: Set<string>,
    setItems: (keys: Set<string>) => void,
  ) => {
    const count = selectedItems.size;
    return (
      <Select
        className="w-full"
        classNames={{
          trigger: "h-fit",
        }}
        radius="md"
        renderValue={(items) => {
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
        selectionMode="multiple"
        isMultiline
        label={t(`reports-modal-${name}-select-label`)}
        selectedKeys={selectedItems}
        items={items}
        variant="bordered"
        placeholder={t(`reports-modal-${name}-placeholder-text`)}
        onSelectionChange={(keys) => setItems(keys as Set<string>)}
      >
        {(item) => <SelectItem>{t(item.labelKey)}</SelectItem>}
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
        !selectedCategory.size && !selectedPriority.size && !dateRange,
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
          <I18nProvider locale={locale}>
            <DateRangePicker
              label={t("reports-modal-date-range-label")}
              pageBehavior="single"
              aria-label="Date Range Picker"
              firstDayOfWeek="mon"
              value={dateRange}
              variant="bordered"
              onChange={setDateRange}
              visibleMonths={2}
            />
          </I18nProvider>
        </Form>
      </ModalBody>
    </Modal>
  );
};
