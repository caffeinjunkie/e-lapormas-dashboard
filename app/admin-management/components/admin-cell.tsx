import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { useTranslations } from "next-intl";
import {
  ChangeEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { TooltipButton } from "./tooltip-button";

import {
  deleteCookie,
  formatTime,
  getCookie,
  setCookie,
} from "@/app/admin-management/handlers";

import { UserAva } from "@/components/user-ava";

import { inviteByEmail } from "@/api/users";

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
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(false);
  const [timers, setTimers] = useState<Record<string, number>>({});
  const timersRef: MutableRefObject<
    Record<string, ReturnType<typeof setInterval> | undefined>
  > = useRef({});
  const cellValue = user[columnKey as keyof AdminData];

  useEffect(() => {
    const storedTimestamp = getCookie(user.user_id);
    if (storedTimestamp) {
      const elapsedTime = Date.now() - parseInt(storedTimestamp);
      const remainingTime = 60 * 1000 - elapsedTime;

      if (remainingTime > 0) {
        setIsResendButtonDisabled(true);
        setTimers((prev) => ({ ...prev, [user.user_id]: remainingTime }));

        timersRef.current[user.user_id] = setInterval(() => {
          setTimers((prev) => {
            const newTime = (prev[user.user_id] || 0) - 1000;
            if (newTime <= 0 && timersRef.current[user.user_id]) {
              clearInterval(timersRef.current[user.user_id]);
              setIsResendButtonDisabled(false);
              deleteCookie(user.user_id);
              return { ...prev, [user.user_id]: 0 };
            }
            return { ...prev, [user.user_id]: newTime };
          });
        }, 1000);
      } else {
        setIsResendButtonDisabled(false);
        setTimers((prev) => ({ ...prev, [user.user_id]: 0 }));
        deleteCookie(user.user_id);
      }
    }
    return () => {
      if (timersRef.current[user.user_id]) {
        clearInterval(timersRef.current[user.user_id]);
      }
    };
  }, []);

  const onResend = async (userId: string) => {
    await inviteByEmail(user.email as string);
    const timestamp = Date.now().toString();
    setCookie(timestamp, userId, 1);

    setIsResendButtonDisabled(true);
    setTimers((prev) => ({ ...prev, [userId]: 60 * 1000 }));

    if (timersRef.current[userId]) {
      clearInterval(timersRef.current[userId]);
    }

    timersRef.current[userId] = setInterval(() => {
      setTimers((prev) => {
        const currentTime = prev[userId] || 0;
        if (currentTime <= 1000 && timersRef.current[userId]) {
          clearInterval(timersRef.current[userId]);
          setIsResendButtonDisabled(false);
          deleteCookie(userId);
          return { ...prev, [userId]: 0 };
        }
        return { ...prev, [userId]: currentTime - 1000 };
      });
    }, 1000);
  };

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
              description={user?.email as string}
              indicator={
                <Chip
                  className="capitalize border-none"
                  color={user.is_verified ? "success" : "warning"}
                  size="sm"
                  variant="dot"
                />
              }
              classNames={{
                container: "gap-4",
              }}
            />
            <div className="flex flex-col items-end gap-2">
              <Switch
                isDisabled={selfId === user?.user_id || !user.is_verified}
                onChange={onSuperAdminToggle}
                isSelected={user.is_super_admin}
                size="sm"
              />
              <p className="text-default-500 text-xs">
                {t("table-is-super-admin-column-label")}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center pt-4 gap-2">
            <Button
              isDisabled={
                isResendButtonDisabled ||
                selfId === user?.user_id ||
                user.is_verified
              }
              onPress={() => onResend(user.user_id)}
              color="warning"
              size="sm"
              variant="bordered"
              className="w-full"
              startContent={
                <PaperAirplaneIcon className="size-4 -rotate-45 mb-1" />
              }
            >
              {isResendButtonDisabled
                ? formatTime(timers[user.user_id])
                : t("admin-management-invite-tooltip-text")}
            </Button>
            <Button
              isDisabled={selfId === user?.user_id}
              color="danger"
              size="sm"
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
          description={user?.email as string}
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
        <div className="flex flex-col items-center">
          <TooltipButton
            className="text-white"
            isDisabled={
              isResendButtonDisabled ||
              selfId === user?.user_id ||
              user.is_verified
            }
            onPress={() => onResend(user.user_id)}
            color="warning"
            content={t("admin-management-invite-tooltip-text")}
            icon={
              isResendButtonDisabled ? (
                <p>{formatTime(timers[user.user_id])}</p>
              ) : (
                <PaperAirplaneIcon className="size-5 text-warning -rotate-45" />
              )
            }
          />
          <TooltipButton
            isDisabled={selfId === user?.user_id}
            onPress={onDeleteUser}
            color="danger"
            content={t("admin-management-delete-tooltip-text")}
            icon={<TrashIcon className="size-5 text-danger" />}
          />
        </div>
      );
    default:
      return cellValue;
  }
};
