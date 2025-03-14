"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/icons";
import { logout } from "@/api/auth";
import { fetchUserData, generateFakeName, updateAuthUser } from "@/api/users";
import { useRouter } from "next/navigation";
import { Sidebar } from "./navbar-sidebar";
import { MobileNavbar } from "./navbar-mobile";
import { ProfileData } from "@/types/user.types";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { ModalHeader } from "@heroui/modal";
import { fetchAdmins } from "@/api/admin";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { isOpen, openModal, closeModal } = useModal();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isNavbarFullyLoaded, setIsNavbarFullyLoaded] = useState(true);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const getUserData = async () => {
    setIsNavbarFullyLoaded(false);
    try {
      const { data } = await fetchUserData();
      const admins = await fetchAdmins();

      const admin = admins.find((admin) => admin.user_id === data.user.id);

      setIsSuperAdmin(Boolean(admin?.is_super_admin));

      const {
        id,
        email,
        user_metadata: { fullName },
      } = data.user;

      let displayName = fullName;

      if (!fullName) {
        displayName = await generateFakeName();
        await updateAuthUser({ data: { fullName: displayName } });
      }

      setUser({
        id,
        email: email as string,
        fullName: displayName,
      });
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
      <div className="px-2 shadow-lg">
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
            variant: "light",
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
