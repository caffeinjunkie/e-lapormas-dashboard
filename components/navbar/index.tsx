"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/icons";
import { logout } from "@/api/auth";
import { updateAdmin } from "@/api/admin";
import { fetchUserData, generateFakeName, updateAuthUser } from "@/api/users";
import { useRouter } from "next/navigation";
import { Sidebar } from "./navbar-sidebar";
import { MobileNavbar } from "./navbar-mobile";
import { ProfileData } from "@/types/user.types";
import { useModal } from "@/components/modal/use-modal";
import { Modal } from "@/components/modal";
import { ModalHeader } from "@heroui/modal";
import { fetchAdminById } from "@/api/admin";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { isOpen, openModal, closeModal } = useModal();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isNavbarFullyLoaded, setIsNavbarFullyLoaded] = useState(false);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const getUserData = async () => {
    try {
      const { data } = await fetchUserData();
      const result = await fetchAdminById(data.user.id);

      let displayName = result.display_name as string;

      if (!result.display_name || result.display_name.trim() === "") {
        const fakeName = await generateFakeName();
        displayName = fakeName;

        await updateAuthUser({ data: { fullName: displayName } });
        await updateAdmin({
          display_name: displayName as string,
          user_id: result.user_id as string,
        });
      }

      setUser({
        id: result.user_id,
        email: result.email as string,
        fullName: displayName,
      });
      setIsSuperAdmin(result.is_super_admin);
    } catch (error) {
      await handleLogout();
    } finally {
      setIsNavbarFullyLoaded(true);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogout = async () => {
    setIsButtonLoading(true);
    try {
      const result = await logout();
      if (result.success) {
        router.push("/login");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsButtonLoading(false);
      closeModal();
    }
  };

  const icon = (
    <NextLink className="flex justify-start items-center gap-1" href="/">
      <Logo />
      <p className="font-bold text-inherit">e-lapormas jakarta</p>
    </NextLink>
  );

  return (
    <>
      <MobileNavbar isSuperAdmin={isSuperAdmin} onLogout={openModal}>
        {icon}
      </MobileNavbar>
      <div className="ml-2">
        <Sidebar
          isSuperAdmin={isSuperAdmin}
          pathname={pathname}
          isLoaded={isNavbarFullyLoaded}
          user={user}
          onLogout={openModal}
        >
          {icon}
        </Sidebar>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        buttons={[
          {
            title: t("logout-confirmation-button-text"),
            onPress: handleLogout,
            color: "danger",
            isLoading: isButtonLoading,
          },
          {
            title: t("logout-cancellation-button-text"),
            onPress: closeModal,
            color: "primary",
            variant: "solid",
          },
        ]}
      >
        <ModalHeader className="text-black">
          {t("logout-confirmation-title")}
        </ModalHeader>
      </Modal>
    </>
  );
};
