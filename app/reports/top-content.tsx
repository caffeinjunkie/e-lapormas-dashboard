import {
  ArrowDownOnSquareIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Tab, Tabs } from "@heroui/tabs";
import { Key } from "@react-types/shared";
import { useTranslations } from "next-intl";

import { sortOptions } from "./config";

import { SearchBar } from "@/components/search-bar";
import { SingleSelectDropdown } from "@/components/single-select-dropdown";

interface TopContentProps {
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onPressFilterButton: () => void;
  selectedTab: string;
  filters: string[];
  searchValue: string;
  onSelectTab: (key: string) => void;
  selectedSortValue: string;
  selectedSortKeys: Set<string>;
  onSortChange: (keys: Set<string>) => void;
  isMobile: boolean;
}

export const TopContent = ({
  onSearchChange,
  onSearchClear,
  selectedTab,
  filters,
  searchValue,
  onSelectTab,
  onPressFilterButton,
  selectedSortValue,
  selectedSortKeys,
  onSortChange,
  isMobile,
}: TopContentProps) => {
  const t = useTranslations("ReportsPage");
  const filterCount = filters.filter((f) => f !== "").length;

  const transformedSortOptions = sortOptions.map(({ id, labelKey }) => ({
    id,
    label: t(labelKey),
  }));

  const descending =
    selectedSortValue === "newest" ||
    selectedSortValue === "z-to-a" ||
    selectedSortValue === "higher-priority";

  return (
    <div
      className={`flex gap-3 bg-white ${isMobile ? "flex-col absolute top-16 pb-2 px-6 left-0 right-0 shadow-sm sm:shadow-none sm:sticky sm:top-0" : "flex-col-reverse"}`}
    >
      <div
        className={`flex flex-col bg-white lg:flex-row lg:justify-between gap-3 items-end`}
      >
        <SearchBar
          className="w-full lg:max-w-[50%]"
          placeholder={t("search-placeholder")}
          onClear={onSearchClear}
          defaultValue={searchValue}
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
            endContent={
              filterCount > 0 && (
                <div className="flex justify-center items-center rounded-full bg-white h-5 w-5 text-xs text-warning font-semibold">
                  {filterCount}
                </div>
              )
            }
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
                <BarsArrowDownIcon className="flex-none size-5" />
              ) : (
                <BarsArrowUpIcon className="flex-none size-5" />
              )
            }
            selectedKeys={selectedSortKeys}
            onSelectionChange={(keys) => onSortChange(keys as Set<string>)}
          >
            <p className="line-clamp-1">{t(`sort-${selectedSortValue}`)}</p>
          </SingleSelectDropdown>
          <Button
            color="success"
            isIconOnly={isMobile}
            radius="md"
            className="text-white w-full lg:w-fit"
            startContent={<ArrowDownOnSquareIcon className="size-5" />}
            onPress={() => {}}
          >
            {isMobile ? t("export-short-button-text") : t("export-button-text")}
          </Button>
        </div>
      </div>
      <Tabs
        size="md"
        fullWidth={isMobile}
        aria-label="Reports tabs"
        selectedKey={selectedTab}
        color="default"
        variant={isMobile ? "solid" : "underlined"}
        className="font-semibold"
        onSelectionChange={onSelectTab as (key: Key) => void}
      >
        <Tab key="PENDING" title={t("status-pending")} />
        <Tab key="IN_PROGRESS" title={t("status-in-progress")} />
        <Tab key="COMPLETED" title={t("status-completed")} />
      </Tabs>
    </div>
  );
};
