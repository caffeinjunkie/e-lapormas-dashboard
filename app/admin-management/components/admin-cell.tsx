import { ChangeEventHandler } from "react";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { useTranslations } from "next-intl";

import { UserAva } from "@/components/user-ava";
import { DeleteButton } from "./delete-button";
import { AdminData } from "@/types/user.types";

interface AdminCellProps {
  columnKey: string;
  user: AdminData;
  selfId: string | null;
  onSuperAdminToggle: ChangeEventHandler<HTMLInputElement>;
  onDeleteUser: () => void;
}

export const AdminCell = ({
  columnKey,
  user,
  selfId,
  onSuperAdminToggle,
  onDeleteUser,
}: AdminCellProps) => {
  const t = useTranslations("AdminManagementPage");
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
