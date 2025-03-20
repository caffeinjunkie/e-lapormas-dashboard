import { fetchAllAdmins } from "@/api/admin";
import { fetchUserData } from "@/api/users";

export const fetchAdminsHandler = async () => {
  const { data: admins } = await fetchAllAdmins();
  const { data: userData } = await fetchUserData();
  return { admins, currentUserId: userData.user.id };
};
