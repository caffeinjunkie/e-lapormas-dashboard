"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
// import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/icons";
import { logout } from "@/api/auth";
import { fetchUserData, generateFakeName, updateAuthUser } from "@/api/users";
import { useRouter } from "next/navigation";
import { Sidebar } from "./navbar-sidebar";
import { MobileNavbar } from "./navbar-mobile";
import { ProfileData } from "@/types/user";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { ModalHeader } from "@heroui/modal";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // const [isLogoutConfirmModalOpen, setIsLogoutConfirmModalOpen] =
  //   useState(false);
  // const closeLogoutConfirmModal = () => setIsLogoutConfirmModalOpen(false);
  // const openLogoutConfirmModal = () => setIsLogoutConfirmModalOpen(true);
  const { isOpen, openModal, closeModal } = useModal();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isNavbarFullyLoaded, setIsNavbarFullyLoaded] = useState(true);
  const [user, setUser] = useState<ProfileData | null>(null);

  const getUserData = async () => {
    setIsNavbarFullyLoaded(false);
    try {
      const { data } = await fetchUserData();
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
      <MobileNavbar onLogout={openModal}>{icon}</MobileNavbar>
      <div className="px-2 shadow-lg">
        <Sidebar
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
            title: "Ya, keluar",
            onPress: handleLogout,
            color: "danger",
            variant: "light",
            isLoading: isButtonLoading,
          },
          {
            title: "Tidak",
            onPress: closeModal,
            color: "primary",
            variant: "solid",
          },
        ]}
      >
        <ModalHeader className="text-black">
          Apakah anda yakin ingin keluar?
        </ModalHeader>
      </Modal>
    </>
  );
};
