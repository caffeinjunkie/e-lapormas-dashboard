"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import {
  TrashIcon,
  UserPlusIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@heroui/spinner";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableColumn,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { Layout } from "@/components/layout";
import { fetchAllAdmins } from "@/api/admin";
import { FloppyIcon } from "@/components/icons";
import { AdminData } from "@/types/user.types";
import { fetchUserData } from "@/api/users";
import { upsertAdmins } from "@/api/admin";
import { UserAva } from "@/components/user-ava";
import { SearchBar } from "@/components/search-bar";

export const columns = [
  { name: "NAME", uid: "display_name" },
  { name: "SUPER ADMIN", uid: "is_super_admin" },
  { name: "STATUS", uid: "is_verified" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { translationKey: "admin-management-table-status-all", uid: "all" },
  { translationKey: "admin-management-table-status-verified", uid: "verified" },
  {
    translationKey: "admin-management-table-status-pending",
    uid: "pending",
  },
];

export default function AdminManagementPage() {
  const t = useTranslations("AdminManagementPage");
  const [page, setPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedStatusFilterKeys, setSelectedStatusFilterKeys] =
    React.useState<Set<string>>(new Set(["all"]));
  const hasSearchFilter = Boolean(filterValue);

  const selectedStatusFilterValue = React.useMemo(
    () => Array.from(selectedStatusFilterKeys).join(", ").replace(/_/g, ""),
    [selectedStatusFilterKeys],
  );

  const fetchAdmins = async () => {
    setIsDataLoading(true);
    try {
      const { data: admins, count } = await fetchAllAdmins();
      const { data: userData } = await fetchUserData();

      setSelfId(userData.user.id);
      setAdmins(admins as AdminData[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();

    const calculateRowNumber = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      const orientation = window.screen.orientation.type;

      if (
        orientation === "portrait-primary" ||
        orientation === "portrait-secondary"
      ) {
        setRowsPerPage(height >= 800 ? 15 : height >= 600 ? 6 : 5);
      } else {
        setRowsPerPage(width >= 800 ? 8 : 7);
      }
    };

    calculateRowNumber();
    window.addEventListener("resize", calculateRowNumber);

    return () => {
      window.removeEventListener("resize", calculateRowNumber);
    };
  }, []);

  const deepEqual = (arr1: AdminData[], arr2: AdminData[]) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...admins];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.display_name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      selectedStatusFilterValue !== "all" &&
      Array.from(selectedStatusFilterKeys).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(selectedStatusFilterKeys).includes(
          user.is_verified ? "verified" : "pending",
        ),
      );
    }

    return filteredUsers;
  }, [admins, filterValue, selectedStatusFilterKeys]);

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

  const handleToggle = (user: AdminData) => {
    const originalAdmins = [...admins];

    // setUnsavedChanges(true);
    setAdmins((prevAdmins) => {
      return prevAdmins.map((admin) =>
        admin.user_id === user.user_id
          ? { ...admin, is_super_admin: !admin.is_super_admin }
          : admin,
      );
    });

    // console.log(deepEqual(admins, originalAdmins));
  };

  const handleSave = async () => {
    setIsSaveLoading(true);
    try {
      await upsertAdmins(admins);
    } catch (error) {
      console.error(error); // TODO: toast error
    } finally {
      setUnsavedChanges(false);
      setIsSaveLoading(false);
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-3 items-end">
          <SearchBar
            className="w-full lg:max-w-[44%]"
            placeholder={t("admin-management-search-placeholder")}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-2 items-center w-full lg:w-fit">
            <Dropdown>
              <DropdownTrigger className="flex w-full lg:w-fit">
                <Button
                  className="text-default-700"
                  endContent={
                    <ChevronDownIcon className="size-4 stroke-2 text-default-700" />
                  }
                  variant="flat"
                >
                  {t(
                    `admin-management-table-status-${selectedStatusFilterValue}`,
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={selectedStatusFilterKeys}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  console.log(keys);
                  setSelectedStatusFilterKeys(keys as Set<string>);
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {t(status.translationKey)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="warning"
              className="text-white w-full lg:w-fit"
              startContent={<UserPlusIcon className="size-5" />}
              onPress={() => console.log("Add admin")}
            >
              {t("admin-management-invite-button-text")}
            </Button>
            <Button
              color="success"
              isLoading={isSaveLoading}
              isDisabled={!unsavedChanges}
              className="text-white w-full lg:w-fit"
              startContent={
                !isSaveLoading && <FloppyIcon color="white" size={21} />
              }
              onPress={handleSave}
            >
              {t("admin-management-save-button-text")}
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, selectedStatusFilterKeys, onSearchChange, hasSearchFilter]);

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
                isDisabled={selfId === user?.user_id}
                onChange={() => handleToggle(user)}
                isSelected={user.is_super_admin}
                size="sm"
              />
            </div>
          );
        case "is_verified":
          return (
            <Chip
              className="capitalize"
              color={user.is_verified ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {user.is_verified
                ? t("admin-management-table-status-verified")
                : t("admin-management-table-status-pending")}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex w-full justify-center items-center gap-2">
              <Tooltip
                isDisabled={selfId === user?.user_id}
                color="danger"
                content={t("admin-management-table-delete-tooltip-text")}
              >
                <Button
                  isDisabled={selfId === user?.user_id}
                  isIconOnly
                  variant="light"
                  onPress={() => console.log("Delete user")}
                >
                  <TrashIcon className="size-5 text-danger" />
                </Button>
              </Tooltip>
            </div>
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
      <div className="flex flex-col-reverse md:flex-col gap-4 py-4 md:pt-9">
        <Table
          topContent={topContent}
          layout="fixed"
          bottomContentPlacement="outside"
          topContentPlacement="outside"
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => {
                    // setUnsavedChanges(false);
                    setPage(page);
                  }}
                />
              </div>
            ) : null
          }
          aria-label="Tabel admin"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                aria-label={column.name}
                align={column.uid === "display_name" ? "start" : "center"}
              >
                {t(
                  `admin-management-table-${column.uid.replaceAll("_", "-")}-column-label`,
                )}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={items}
            isLoading={isDataLoading}
            emptyContent={
              <div className="text-center">
                {t("admin-management-table-empty-content")}
              </div>
            }
            loadingContent={<Spinner />}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
