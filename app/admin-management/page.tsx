"use client";

import React from "react";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/avatar";
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

const statusColorMap: Record<string, string> = {
  verified: "success",
  pending: "warning",
};

export const columns = [
  { name: "USER", uid: "user" },
  { name: "SUPER ADMIN", uid: "isSuperAdmin" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "",
    role: "Technical Lead",
    team: "Development",
    status: "pending",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 4,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 5,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 6,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 7,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 8,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 9,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "verified",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
];

export default function AdminManagementPage() {
  const t = useTranslations("AdminManagementPage");
  const [page, setPage] = React.useState(1);
  const [admins, setAdmins] = React.useState([]);
  const [pages, setPages] = React.useState(0);

  const fetchAdmins = async () => {
    const { data, count } = await fetchPaginatedAdmins(page, 9);
    setAdmins(data as (typeof admins)[0][]);
    setPages(Math.ceil((count as number) / 9));
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const renderCell = React.useCallback(
    (user: (typeof users)[0], columnKey: string) => {
      const cellValue = user[columnKey as keyof (typeof users)[0]];

      switch (columnKey) {
        case "user":
          return (
            <div className="flex items-center gap-4">
              <Avatar
                src=""
                showFallback
                name={user?.name}
                className="hidden sm:block size-10"
              />
              <div className="flex-1 flex-col overflow-hidden whitespace-nowrap">
                <p className="text-sm">{user?.name || "-"}</p>
                <p className="hidden sm:block text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          );
        case "isSuperAdmin":
          return (
            <div className="flex flex-col items-center">
              <Switch isDisabled isSelected size="sm" />
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status] as "success" | "warning"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex w-full justify-center items-center gap-2">
              <Tooltip
                isDisabled
                onClick={() => console.log("Delete user")}
                color="danger"
                content="Delete user"
              >
                <Button
                  isDisabled
                  isIconOnly
                  variant="light"
                  onClick={() => console.log("Delete user")}
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
    [],
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
            onClick={() => console.log("Add admin")}
          >
            {t("admin-management-invite-button-text")}
          </Button>
          <Button
            color="success"
            className="text-white mt-2 md:mt-4 w-full md:w-fit md:self-end"
            startContent={<FloppyIcon color="white" size={21} />}
            onClick={() => console.log("Save changes")}
          >
            {t("admin-management-save-button-text")}
          </Button>
        </div>
        <Table
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
          aria-label="Example table with custom cells"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "user" ? "start" : "center"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
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
