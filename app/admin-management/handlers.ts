import { Dispatch, SetStateAction } from "react";

import { fetchAllAdmins } from "@/api/admin";
import { fetchUserData } from "@/api/users";
import { AdminData } from "@/types/user.types";

interface HandleToggleProps {
  user: AdminData;
  setAdmins: Dispatch<SetStateAction<AdminData[]>>;
  setUpdatedAdmins: Dispatch<SetStateAction<AdminData[]>>;
  originalAdmins: AdminData[];
}

export const fetchAdminsHandler = async () => {
  const { data: admins } = await fetchAllAdmins();
  const { data: userData } = await fetchUserData();
  return { admins, currentUserId: userData.user.id };
};

export const calculateRowNumber = (setRowsPerPage: (rows: number) => void) => {
  const height = window.innerHeight;
  const orientation = window.screen.orientation.type;

  if (
    orientation === "portrait-primary" ||
    orientation === "portrait-secondary"
  ) {
    setRowsPerPage(height >= 1100 ? 12 : height >= 1024 ? 6 : 5);
  } else {
    setRowsPerPage(height >= 1024 ? 8 : height > 884 ? 7 : 6);
  }
};

export const handleToggle = ({
  user,
  setAdmins,
  setUpdatedAdmins,
  originalAdmins,
}: HandleToggleProps) => {
  setAdmins((prevAdmins: AdminData[]) => {
    const updatedAdminsList = prevAdmins.map((admin) =>
      admin.user_id === user.user_id
        ? { ...admin, is_super_admin: !admin.is_super_admin }
        : admin,
    );

    const updatedUser = updatedAdminsList.find(
      (admin) => admin.user_id === user.user_id,
    );
    if (updatedUser) {
      setUpdatedAdmins((prevUpdatedAdmins: AdminData[]) => {
        const isReverted =
          originalAdmins.find((admin) => admin.user_id === user.user_id)
            ?.is_super_admin === updatedUser.is_super_admin;

        if (isReverted) {
          return prevUpdatedAdmins.filter(
            (admin) => admin.user_id !== updatedUser.user_id,
          );
        }

        if (
          !prevUpdatedAdmins.some(
            (admin) => admin.user_id === updatedUser.user_id,
          )
        ) {
          return [...prevUpdatedAdmins, updatedUser];
        }
        return prevUpdatedAdmins;
      });
    }

    return updatedAdminsList;
  });
};

export const filterUsers = (
  admins: AdminData[],
  hasSearchFilter: boolean,
  filterValue: string,
  selectedStatusFilterValue: string,
  selectedStatusFilterKeys: Set<string>,
) => {
  let filteredUsers = [...admins];

  if (hasSearchFilter) {
    filteredUsers = filteredUsers.filter((user) => {
      const email = user.email as string;
      const displayName = user.display_name as string;
      const userName = email.split("@")[0];
      return (
        displayName.toLowerCase().includes(filterValue.toLowerCase()) ||
        userName.toLowerCase().includes(filterValue.toLowerCase())
      );
    });
  }
  if (selectedStatusFilterValue !== "all") {
    filteredUsers = filteredUsers.filter((user) =>
      Array.from(selectedStatusFilterKeys).includes(
        user.is_verified ? "verified" : "pending",
      ),
    );
  }

  return filteredUsers;
};

export const setCookie = (value: string, id: string, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${id}=${value};expires=${expires.toUTCString()};path=/`;
};

export const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${seconds}s`;
};

export const getErrorToastProps = (
  t: (key: string) => string,
  key: string = "default",
) => {
  return {
    title: t(`${key}-error-toast-title`),
    description: t(`${key}-error-toast-description`),
    color: "danger",
  };
};
