"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";
import { AdminTable } from "@/app/admin-management/components/admin-table";
import {
  fetchAdminsHandler,
  calculateRowNumber,
  handleToggle,
  filterUsers,
} from "@/app/admin-management/handlers";
import { AdminData } from "@/types/user.types";
import { upsertAdmins } from "@/api/admin";
import { UserAva } from "@/components/user-ava";
import { columns } from "@/app/admin-management/config";
import { TopContent } from "./components/top-content";
import { DeleteButton } from "./components/delete-button";
import { useFilterSingleSelect } from "@/components/filter-dropdown/use-filter-single-select";

export default function AdminManagementPage() {
  const t = useTranslations(AdminManagementPage.displayName);
  const [page, setPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [originalAdmins, setOriginalAdmins] = useState<AdminData[]>([]);
  const [updatedAdmins, setUpdatedAdmins] = useState<AdminData[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [filterValue, setFilterValue] = React.useState("");
  const {
    selected: selectedStatusFilterKeys,
    setSelected: setSelectedStatusFilterKeys,
  } = useFilterSingleSelect(new Set(["all"]));
  const hasSearchFilter = Boolean(filterValue);

  const selectedStatusFilterValue = React.useMemo(
    () => Array.from(selectedStatusFilterKeys).join(", ").replace(/_/g, ""),
    [selectedStatusFilterKeys],
  );

  const fetchAdmins = async () => {
    try {
      const { admins, userId } = await fetchAdminsHandler();

      setSelfId(userId);
      setAdmins(admins as AdminData[]);
      setOriginalAdmins(admins as AdminData[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    setIsDataLoading(true);
    fetchAdmins();

    const handleResize = () => calculateRowNumber(setRowsPerPage);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredItems = React.useMemo(
    () =>
      filterUsers(
        admins,
        hasSearchFilter,
        filterValue,
        selectedStatusFilterValue,
        selectedStatusFilterKeys,
      ),
    [admins, filterValue, selectedStatusFilterKeys],
  );

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onSave = async () => {
    setIsSaveLoading(true);
    try {
      const result = await upsertAdmins(updatedAdmins);
      if (result) {
        await fetchAdmins();
      }

      addToast({
        title: t("admin-management-save-success-toast-title"),
        description: t("admin-management-save-success-toast-description", {
          label:
            updatedAdmins.length > 1
              ? t("admin-management-users-count-text", {
                  count: updatedAdmins.length,
                })
              : updatedAdmins[0].email,
        }),
        timeout: 3000,
        color: "success",
      });

      setUpdatedAdmins([]);
    } catch (error) {
      addToast({
        title: t("admin-management-error-toast-title"),
        description: t("admin-management-error-toast-description"),
        timeout: 3000,
        color: "danger",
      });
      console.error(error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const onInviteUser = () => {
    console.log("Invite user");
    // TODO: open invite modal
    // then create sendInvite function
  };

  const onDeleteUser = () => {
    console.log("Delete user");
    // TODO: open confirm delete modal
    // then create onConfirmDelete function
  };

  const topContent = React.useMemo(() => {
    return (
      <TopContent
        searchValue={filterValue}
        onSearchChange={onSearchChange}
        onSearchClear={onClear}
        selectedStatusFilterValue={selectedStatusFilterValue}
        selectedStatusFilterKeys={selectedStatusFilterKeys}
        onStatusFilterChange={(keys) => {
          setSelectedStatusFilterKeys(keys as Set<string>);
        }}
        isSaveButtonLoading={isSaveLoading}
        isSaveButtonDisabled={updatedAdmins.length === 0}
        onInviteUser={onInviteUser}
        onSave={onSave}
      />
    );
  }, [
    filterValue,
    selectedStatusFilterKeys,
    onSearchChange,
    hasSearchFilter,
    updatedAdmins,
    isSaveLoading,
  ]);

  const renderCell = useCallback(
    (user: AdminData, columnKey: string) => {
      const cellValue = user[columnKey as keyof AdminData];

      switch (columnKey) {
        case "display_name":
          return (
            <UserAva
              imageSrc={user?.profile_img}
              displayName={user?.display_name}
              description={user?.email}
              classNames={{
                container: "gap-4",
                avatar: "hidden sm:block",
                description: "hidden sm:block",
              }}
            />
          );
        case "is_super_admin":
          return (
            <div className="flex flex-col items-center">
              <Switch
                isDisabled={selfId === user?.user_id || !user.is_verified}
                onChange={() =>
                  handleToggle({
                    user,
                    setAdmins,
                    setUpdatedAdmins,
                    originalAdmins,
                  })
                }
                isSelected={user.is_super_admin}
                size="sm"
              />
            </div>
          );
        case "is_verified":
          return (
            <Chip
              className="capitalize border-none"
              color={user.is_verified ? "success" : "warning"}
              size="sm"
              variant="dot"
            >
              {user.is_verified
                ? t("admin-management-status-verified")
                : t("admin-management-status-pending")}
            </Chip>
          );
        case "actions":
          return (
            <DeleteButton
              isDisabled={selfId === user?.user_id}
              onPress={onDeleteUser}
              tooltipContent={t("admin-management-delete-tooltip-text")}
            />
          );
        default:
          return cellValue;
      }
    },
    [admins, selfId],
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center md:text-left">
        {t("admin-management-title")}
      </h1>
      <div className="flex py-4 md:pt-9">
        <AdminTable
          columns={columns}
          items={items}
          isLoading={isDataLoading}
          renderCell={renderCell}
          topContent={topContent}
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }
          translationKey={AdminManagementPage.displayName}
        />
      </div>
    </Layout>
  );
}

AdminManagementPage.displayName = "AdminManagementPage";
