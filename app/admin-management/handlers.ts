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
      const userName = user.email.split("@")[0];
      return (
        user.display_name.toLowerCase().includes(filterValue.toLowerCase()) ||
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
