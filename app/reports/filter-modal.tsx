"use client";

import { Form } from "@heroui/form";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { categoryOptions, priorityOptions } from "./config";

import { FilterType } from "@/api/tasks";
import { Modal, ModalButtonProps } from "@/components/modal";

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

  const onClear = () => {
    setSelectedCategory(new Set());
    setSelectedPriority(new Set());
  };

  const t = useTranslations("ReportsPage");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filters: FilterType[] = [];
    if (selectedCategory.size > 0) {
      filters.push({ field: "category", value: Array.from(selectedCategory) });
    }
    if (selectedPriority.size > 0) {
      filters.push({
        field: "priority",
        value: Array.from(selectedPriority).map((item) => item.toUpperCase()),
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
        radius="md"
        endContent={
          count > 0 && (
            <div className="rounded-full bg-primary w-5 h-4.5 flex items-center justify-center">
              <p className="text-[12px] text-white">{count}</p>
            </div>
          )
        }
        name={name}
        selectionMode="multiple"
        label={t(`reports-modal-${name}-select-label`)}
        selectedKeys={selectedItems}
        items={items}
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
      isDisabled: !selectedCategory.size && !selectedPriority.size,
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
        </Form>
      </ModalBody>
    </Modal>
  );
};
