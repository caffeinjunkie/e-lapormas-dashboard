import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { ToastProps, addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";
import {
  ChangeEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { TooltipButton } from "../../components/tooltip-button";

import { createAuthUser } from "@/api/auth";
import {
  formatTime,
  getErrorToastProps,
  setCookie,
} from "@/app/admin-management/utils";
import { UserAva } from "@/components/user-ava";
import { AdminData } from "@/types/user.types";
import { deleteCookie, getCookie } from "@/utils/cookie";

interface AdminCellProps {
  columnKey: string;
  user: AdminData;
  selfId: string | null;
  isMobile: boolean;
  onSuperAdminToggle: ChangeEventHandler<HTMLInputElement>;
  onDeleteUser: () => void;
  isSuperAdminSlotAvailable: boolean;
  isLast: boolean;
  admins: AdminData[];
}

export const AdminCell = ({
  columnKey,
  user,
  isMobile,
  isLast,
  selfId,
  isSuperAdminSlotAvailable,
  admins,
  onSuperAdminToggle,
  onDeleteUser,
}: AdminCellProps) => {
  const t = useTranslations("AdminManagementPage");
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(false);
  const [isResendButtonLoading, setIsResendButtonLoading] = useState(false);
  const [timers, setTimers] = useState<Record<string, number>>({});
  const timersRef: MutableRefObject<
    Record<string, ReturnType<typeof setInterval> | undefined>
  > = useRef({});
  const cellValue = user[columnKey as keyof AdminData];

  useEffect(() => {
    const userId = user.user_id as string;
    const storedTimestamp = getCookie(userId);
    if (storedTimestamp) {
      const elapsedTime = Date.now() - parseInt(storedTimestamp);
      const remainingTime = 60 * 1000 - elapsedTime;

      if (remainingTime > 0) {
        setIsResendButtonDisabled(true);
        setTimers((prev) => ({ ...prev, [userId]: remainingTime }));

        timersRef.current[userId] = setInterval(() => {
          setTimers((prev) => {
            const newTime = (prev[userId] || 0) - 1000;
            if (newTime <= 0 && timersRef.current[userId]) {
              clearInterval(timersRef.current[userId]);
              setIsResendButtonDisabled(false);
              deleteCookie(userId);
              return { ...prev, [userId]: 0 };
            }
            return { ...prev, [userId]: newTime };
          });
        }, 1000);
      } else {
        setIsResendButtonDisabled(false);
        setTimers((prev) => ({ ...prev, [userId]: 0 }));
        deleteCookie(userId);
      }
    }
    return () => {
      if (timersRef.current[userId]) {
        clearInterval(timersRef.current[userId]);
      }
    };
  }, [admins]);

  const onResend = async (userId: string) => {
    setIsResendButtonLoading(true);
    try {
      await createAuthUser(user.email as string);
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
    } catch (error) {
      const toastProps = getErrorToastProps(t, "invite");
      addToast(toastProps as ToastProps);
    } finally {
      setIsResendButtonLoading(false);
    }
  };

  switch (columnKey) {
    case "display_name":
      return isMobile ? (
        <div
          className={`${isLast ? "border-b-0 pb-0" : "border-b-1 border-default-200 pb-4"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-72 sm:max-w-96 overflow-hidden">
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
            </div>

            <div className="flex flex-col items-end gap-2">
              <Switch
                isDisabled={
                  selfId === user?.user_id ||
                  !user.is_verified ||
                  (!isSuperAdminSlotAvailable && !user.is_super_admin)
                }
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
              isLoading={isResendButtonLoading}
              onPress={() => onResend(user.user_id as string)}
              color="warning"
              size="sm"
              variant="bordered"
              className="w-full"
              startContent={
                isResendButtonLoading || (
                  <PaperAirplaneIcon className="size-4 -rotate-45 mb-1" />
                )
              }
            >
              {isResendButtonDisabled
                ? formatTime(timers[user.user_id as string])
                : t("invite-tooltip-text")}
            </Button>
            <Button
              isDisabled={selfId === user?.user_id}
              color="danger"
              size="sm"
              className="w-full"
              startContent={<TrashIcon className="size-4" />}
              onPress={onDeleteUser}
            >
              {t("delete-tooltip-text")}
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
            isDisabled={
              selfId === user?.user_id ||
              !user.is_verified ||
              (!isSuperAdminSlotAvailable && !user.is_super_admin)
            }
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
          {user.is_verified ? t("status-verified") : t("status-pending")}
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
            isLoading={isResendButtonLoading}
            onPress={() => onResend(user.user_id as string)}
            color="warning"
            content={t("invite-tooltip-text")}
            icon={
              isResendButtonDisabled ? (
                <p>{formatTime(timers[user.user_id as string])}</p>
              ) : (
                <PaperAirplaneIcon className="size-5 text-warning -rotate-45" />
              )
            }
          />
          <TooltipButton
            isDisabled={selfId === user?.user_id}
            onPress={onDeleteUser}
            color="danger"
            content={t("delete-tooltip-text")}
            icon={<TrashIcon className="size-5 text-danger" />}
          />
        </div>
      );
    default:
      return cellValue;
  }
};
