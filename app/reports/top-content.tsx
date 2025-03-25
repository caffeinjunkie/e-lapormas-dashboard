import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { sortOptions } from "./config";

import { SearchBar } from "@/components/search-bar";
import { SingleSelectDropdown } from "@/components/single-select-dropdown";

interface TopContentProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onPressFilterButton: () => void;
  selectedSortValue: string;
  selectedSortKeys: Set<string>;
  onSortChange: (keys: Set<string>) => void;
  isMobile: boolean;
}

export const TopContent = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  onPressFilterButton,
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

  const descending =
    selectedSortValue === "newest" ||
    selectedSortValue === "z-to-a" ||
    selectedSortValue === "higher-priority";

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
        <Button
          color="warning"
          isIconOnly={isMobile}
          radius="md"
          className="text-white w-full lg:w-fit"
          startContent={<FunnelIcon className="size-5" />}
          onPress={onPressFilterButton}
        >
          {t("filter-button-text")}
        </Button>
        <SingleSelectDropdown
          label={t("sort-label")}
          items={transformedSortOptions}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          buttonStartContent={
            descending ? (
              <BarsArrowDownIcon className="size-5" />
            ) : (
              <BarsArrowUpIcon className="size-5" />
            )
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
