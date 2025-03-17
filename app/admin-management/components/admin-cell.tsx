import { ChangeEventHandler } from "react";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { UserAva } from "@/components/user-ava";
import { DeleteButton } from "./delete-button";
import { AdminData } from "@/types/user.types";

interface AdminCellProps {
  columnKey: string;
  user: AdminData;
  selfId: string | null;
  isMobile: boolean;
  onSuperAdminToggle: ChangeEventHandler<HTMLInputElement>;
  onDeleteUser: () => void;
  isLast: boolean;
}

export const AdminCell = ({
  columnKey,
  user,
  isMobile,
  isLast,
  selfId,
  onSuperAdminToggle,
  onDeleteUser,
}: AdminCellProps) => {
  const t = useTranslations("AdminManagementPage");
  const cellValue = user[columnKey as keyof AdminData];

  switch (columnKey) {
    case "display_name":
      return isMobile ? (
        <div
          className={`border-b-1 border-default-200 ${isLast ? "border-b-0 pb-0" : "pb-4"}`}
        >
          <div className="flex items-center justify-between">
            <UserAva
              imageSrc={user?.profile_img}
              displayName={user?.display_name}
              description={user?.email}
              indicator={
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
              }
              classNames={{
                container: "gap-4",
              }}
            />
            <Switch
              isDisabled={selfId === user?.user_id || !user.is_verified}
              onChange={onSuperAdminToggle}
              isSelected={user.is_super_admin}
              size="sm"
            />
          </div>
          <div className="flex flex-row items-center pt-4 gap-2">
            <Button
              isDisabled={selfId === user?.user_id}
              size="sm"
              variant="solid"
              color="danger"
              className="w-full"
              startContent={<TrashIcon className="size-4" />}
              onPress={onDeleteUser}
            >
              {t("admin-management-delete-tooltip-text")}
            </Button>
          </div>
        </div>
      ) : (
        <UserAva
          imageSrc={user?.profile_img}
          displayName={user?.display_name}
          description={user?.email}
          classNames={{
            container: "gap-4",
          }}
        />
      );
    case "is_super_admin":
      return (
        <div className="flex flex-col items-center">
          <Switch
            isDisabled={selfId === user?.user_id || !user.is_verified}
            onChange={onSuperAdminToggle}
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
};
