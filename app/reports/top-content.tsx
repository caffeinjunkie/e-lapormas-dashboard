import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
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
  onSearchPress: () => void;
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
  onSearchPress,
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
      <div className="flex flex-row gap-2 items-center w-full lg:max-w-[50%]">
        <SearchBar
          className="w-full"
          placeholder={t("search-placeholder")}
          value={searchValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearchPress();
            }
          }}
          onClear={onSearchClear}
          onValueChange={onSearchChange}
        />
        <Button
          color="primary"
          isIconOnly
          radius="md"
          className="text-white w-20"
          startContent={<MagnifyingGlassIcon className="size-5" />}
          onPress={onSearchPress}
        />
      </div>

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
