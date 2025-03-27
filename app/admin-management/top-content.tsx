import { ChevronDownIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { SharedSelection } from "@heroui/system";
import { useTranslations } from "next-intl";

import { statusOptions } from "@/app/admin-management/config";
import { FloppyIcon } from "@/components/icons";
import { SearchBar } from "@/components/search-bar";
import { SingleSelectDropdown } from "@/components/single-select-dropdown";

interface TopContentProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  selectedStatusFilterValue: string;
  selectedStatusFilterKeys: Set<string>;
  onStatusFilterChange: (keys: SharedSelection) => void;
  isSaveButtonLoading: boolean;
  isSaveButtonDisabled: boolean;
  onInviteUser: () => void;
  onSave: () => void;
  isMobile: boolean;
}

export const TopContent = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  selectedStatusFilterValue,
  selectedStatusFilterKeys,
  onStatusFilterChange,
  isMobile,
  isSaveButtonLoading,
  isSaveButtonDisabled,
  onInviteUser,
  onSave,
}: TopContentProps) => {
  const t = useTranslations("AdminManagementPage");

  const transformedStatusOptions = statusOptions.map(({ id, labelKey }) => ({
    id,
    label: t(labelKey),
  }));

  const statusFilterValue = t(
    `status-${selectedStatusFilterValue === "all" ? "filter-label" : selectedStatusFilterValue}`,
  );
  const abbreviatedStatusFilterValue = t(
    `status-${selectedStatusFilterValue === "all" ? "filter-label" : selectedStatusFilterValue}`,
  )
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      className={`flex flex-col bg-white ${isMobile ? "absolute top-16 pb-2 px-6 left-0 right-0 shadow-sm sm:shadow-none sm:sticky sm:top-0" : ""} lg:flex-row lg:justify-between gap-3 items-end`}
    >
      <SearchBar
        className="w-full lg:max-w-[44%]"
        placeholder={t("search-placeholder")}
        value={searchValue}
        onClear={onSearchClear}
        onValueChange={onSearchChange}
      />
      <div className="flex gap-2 items-center w-full lg:w-fit">
        <SingleSelectDropdown
          label={t("status-filter-label")}
          items={transformedStatusOptions}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          buttonEndContent={
            <ChevronDownIcon className="size-4 stroke-2 text-default-700" />
          }
          selectedKeys={selectedStatusFilterKeys}
          onSelectionChange={onStatusFilterChange}
        >
          <p>{isMobile ? abbreviatedStatusFilterValue : statusFilterValue}</p>
        </SingleSelectDropdown>
        <Button
          color="warning"
          isIconOnly={isMobile}
          radius="md"
          className="text-white w-full lg:w-fit"
          startContent={<UserPlusIcon className="size-5" />}
          onPress={onInviteUser}
        >
          {isMobile ? null : t("invite-button-text")}
        </Button>
        <Button
          color="success"
          isLoading={isSaveButtonLoading}
          isIconOnly={isMobile}
          radius="md"
          isDisabled={isSaveButtonDisabled}
          className="text-white w-full lg:w-fit"
          startContent={
            !isSaveButtonLoading && <FloppyIcon color="white" size={21} />
          }
          onPress={onSave}
        >
          {isMobile ? null : t("save-button-text")}
        </Button>
      </div>
    </div>
  );
};
