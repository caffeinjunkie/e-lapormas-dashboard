"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/avatar";
import { Spinner } from "@heroui/spinner";
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
import { fetchPaginatedAdmins } from "@/api/admin";
import { FloppyIcon } from "@/components/icons";
import { AdminData } from "@/types/user.types";
import { fetchUserData } from "@/api/users";
import { upsertAdmins } from "@/api/admin";

export const columns = [
  { name: "NAME", uid: "display_name" },
  { name: "SUPER ADMIN", uid: "is_super_admin" },
  { name: "STATUS", uid: "is_verified" },
  { name: "ACTIONS", uid: "actions" },
];

export default function AdminManagementPage() {
  const t = useTranslations("AdminManagementPage");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setIsDataLoading(true);
    try {
      const { data: admins, count } = await fetchPaginatedAdmins(page, 9);
      const { data: userData } = await fetchUserData();

      setSelfId(userData.user.id);
      setAdmins(admins as AdminData[]);
      setPages(Math.ceil((count as number) / 9));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const handleToggle = (user: AdminData) => {
    setAdmins((prevAdmins) => {
      return prevAdmins.map((admin) =>
        admin.user_id === user.user_id
          ? { ...admin, is_super_admin: !admin.is_super_admin }
          : admin,
      );
    });
    setUnsavedChanges(true);
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

  const renderCell = useCallback(
    (user: AdminData, columnKey: string) => {
      const cellValue = user[columnKey as keyof AdminData];

      switch (columnKey) {
        case "display_name":
          return (
            <div className="flex items-center gap-4">
              <Avatar
                src=""
                showFallback
                name={user?.display_name}
                className="hidden sm:block size-10"
              />
              <div className="flex-1 flex-col overflow-hidden whitespace-nowrap">
                <p className="text-sm">{user?.display_name || "-"}</p>
                <p className="hidden sm:block text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
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
      <div className="md:fixed">
        <p className="text-2xl font-bold text-center md:text-left">
          {t("admin-management-title")}
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-col gap-4 py-4 md:py-0">
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            color="warning"
            className="text-white mt-2 md:mt-4 w-full md:w-fit md:self-end"
            startContent={<UserPlusIcon className="size-5" />}
            onPress={() => console.log("Add admin")}
          >
            {t("admin-management-invite-button-text")}
          </Button>
          <Button
            color="success"
            isLoading={isSaveLoading}
            isDisabled={!unsavedChanges}
            className="text-white mt-2 md:mt-4 w-full md:w-fit md:self-end"
            startContent={
              !isSaveLoading && <FloppyIcon color="white" size={21} />
            }
            onPress={handleSave}
          >
            {t("admin-management-save-button-text")}
          </Button>
        </div>
        <Table
          layout="fixed"
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
                    setUnsavedChanges(false);
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
            items={admins}
            isLoading={isDataLoading}
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
