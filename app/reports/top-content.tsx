import { FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { sortOptions } from "./config";

import { SearchBar } from "@/components/search-bar";
import { SingleSelectDropdown } from "@/components/single-select-dropdown";

interface TopContentProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  selectedSortValue: string;
  selectedSortKeys: Set<string>;
  onSortChange: (keys: Set<string>) => void;
  isMobile: boolean;
}

export const TopContent = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  selectedSortValue,
  selectedSortKeys,
  onSortChange,
  isMobile,
}: TopContentProps) => {
  const t = useTranslations("ReportsPage");

  const transformedSortOptions = sortOptions.map(({ id, labelKey }) => ({
    id,
    label: t(labelKey),
  }));

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between gap-3 items-end">
      <SearchBar
        className="w-full lg:max-w-[44%]"
        placeholder={t("search-placeholder")}
        value={searchValue}
        onClear={onSearchClear}
        onValueChange={onSearchChange}
      />
      <div className="flex gap-2 items-center w-full lg:w-fit">
        <SingleSelectDropdown
          label={t("sort-label")}
          items={transformedSortOptions}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          buttonEndContent={
            <FunnelIcon className="size-3 stroke-2 text-default-700" />
          }
          selectedKeys={selectedSortKeys}
          onSelectionChange={(keys) => onSortChange(keys as Set<string>)}
        >
          <p>{t(`sort-${selectedSortValue}`)}</p>
        </SingleSelectDropdown>
        <SingleSelectDropdown
          label={t("sort-label")}
          items={transformedSortOptions}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          buttonEndContent={
            <FunnelIcon className="size-3 stroke-2 text-default-700" />
          }
          selectedKeys={selectedSortKeys}
          onSelectionChange={(keys) => onSortChange(keys as Set<string>)}
        >
          <p>{t(`sort-${selectedSortValue}`)}</p>
        </SingleSelectDropdown>
        <SingleSelectDropdown
          label={t("sort-label")}
          items={transformedSortOptions}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          buttonEndContent={
            <FunnelIcon className="size-3 stroke-2 text-default-700" />
          }
          selectedKeys={selectedSortKeys}
          onSelectionChange={(keys) => onSortChange(keys as Set<string>)}
        >
          <p>{t(`sort-${selectedSortValue}`)}</p>
        </SingleSelectDropdown>
        <SingleSelectDropdown
          label={t("sort-label")}
          items={transformedSortOptions}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          buttonEndContent={
            <FunnelIcon className="size-3 stroke-2 text-default-700" />
          }
          selectedKeys={selectedSortKeys}
          onSelectionChange={(keys) => onSortChange(keys as Set<string>)}
        >
          <p>{t(`sort-${selectedSortValue}`)}</p>
        </SingleSelectDropdown>
      </div>
    </div>
  );
};
