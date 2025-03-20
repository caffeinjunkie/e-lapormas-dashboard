"use client";

import { ModalHeader } from "@heroui/modal";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "../icons";
import { MobileNavbar } from "./navbar-mobile";
import { Sidebar } from "./navbar-sidebar";

import { fetchAdminById } from "@/api/admin";
import { logout } from "@/api/auth";
import { fetchUserData, generateFakeName, updateAuthUser } from "@/api/users";
import { Modal } from "@/components/modal";
import { ProfileData } from "@/types/user.types";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { isOpen, openModal, closeModal } = Modal.useModal();
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

        await updateAuthUser({ data: { full_name: displayName } });
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

  const mobileHeaderLabel = (
    <NextLink className="flex justify-start items-center gap-1" href="/">
      <p className="font-bold text-inherit">
        {t(
          `navbar-${pathname === "/" ? "dashboard" : pathname.split("/")[1]}-label`,
        )}
      </p>
    </NextLink>
  );

  return (
    <>
      <MobileNavbar isSuperAdmin={isSuperAdmin} onLogout={openModal}>
        {mobileHeaderLabel}
      </MobileNavbar>
      <Sidebar
        isSuperAdmin={isSuperAdmin}
        pathname={pathname}
        isLoaded={isNavbarFullyLoaded}
        user={user}
        onLogout={openModal}
      >
        <div className="flex justify-center px-6 pt-4 w-full">
          <div className="flex-col justify-center">
            <Logo />
            <p className="text-[10px] mt-[-12px] mr-3 text-end"></p>
          </div>
        </div>
      </Sidebar>
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
