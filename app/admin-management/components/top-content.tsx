import { UserPlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { SharedSelection } from "@heroui/system";
import { useTranslations } from "next-intl";

import { statusOptions } from "@/app/admin-management/config";
import { FilterDropdown } from "@/components/filter-dropdown";
import { FloppyIcon } from "@/components/icons";
import { SearchBar } from "@/components/search-bar";

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

  const transformedStatusOptions = statusOptions.map((status) => ({
    id: status.uid,
    label: t(status.translationKey),
  }));

  const statusFilterValue = t(
    `admin-management-status-${selectedStatusFilterValue === "all" ? "filter-label" : selectedStatusFilterValue}`,
  );
  const abbreviatedStatusFilterValue = t(
    `admin-management-status-${selectedStatusFilterValue === "all" ? "filter-label" : selectedStatusFilterValue}`,
  )
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between gap-3 items-end">
      <SearchBar
        className="w-full lg:max-w-[44%]"
        placeholder={t("admin-management-search-placeholder")}
        value={searchValue}
        onClear={onSearchClear}
        onValueChange={onSearchChange}
      />
      <div className="flex gap-2 items-center w-full lg:w-fit">
        <FilterDropdown
          label={t("admin-management-status-filter-label")}
          items={transformedStatusOptions}
          triggerClassname="w-full lg:w-fit"
          closeOnSelect
          selectedKeys={selectedStatusFilterKeys}
          onSelectionChange={onStatusFilterChange}
        >
          <p>{isMobile ? abbreviatedStatusFilterValue : statusFilterValue}</p>
        </FilterDropdown>
        <Button
          color="warning"
          isIconOnly={isMobile}
          className="text-white w-full lg:w-fit"
          startContent={<UserPlusIcon className="size-5" />}
          onPress={onInviteUser}
        >
          {isMobile ? null : t("admin-management-invite-button-text")}
        </Button>
        <Button
          color="success"
          isLoading={isSaveButtonLoading}
          isIconOnly={isMobile}
          isDisabled={isSaveButtonDisabled}
          className="text-white w-full lg:w-fit"
          startContent={
            !isSaveButtonLoading && <FloppyIcon color="white" size={21} />
          }
          onPress={onSave}
        >
          {isMobile ? null : t("admin-management-save-button-text")}
        </Button>
      </div>
    </div>
  );
};
