"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/icons";
import { logout } from "@/api/auth";
import { fetchUserData } from "@/api/users";
import { useRouter } from "next/navigation";
import { Sidebar } from "./navbar-sidebar";
import { MobileNavbar } from "./navbar-mobile";
import { ProfileData } from "@/types/user";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isLogoutConfirmModalOpen, setIsLogoutConfirmModalOpen] =
    useState(false);
  const closeLogoutConfirmModal = () => setIsLogoutConfirmModalOpen(false);
  const openLogoutConfirmModal = () => setIsLogoutConfirmModalOpen(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isNavbarFullyLoaded, setIsNavbarFullyLoaded] = useState(true);
  const [user, setUser] = useState<ProfileData | null>(null);

  const getUserData = async () => {
    setIsNavbarFullyLoaded(false);
    try {
      const { data } = await fetchUserData();
      const {
        id,
        user_metadata: { fullName, email },
      } = data.user;
      setUser({
        id,
        email,
        fullName,
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
      closeLogoutConfirmModal();
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
      <MobileNavbar onLogout={openLogoutConfirmModal}>{icon}</MobileNavbar>
      <div className="px-2 shadow-lg">
        <Sidebar
          pathname={pathname}
          isLoaded={isNavbarFullyLoaded}
          user={user}
          onLogout={openLogoutConfirmModal}
        >
          {icon}
        </Sidebar>
      </div>
      <Modal
        backdrop="opaque"
        isOpen={isLogoutConfirmModalOpen}
        onClose={closeLogoutConfirmModal}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Apakah anda yakin ingin keluar?
              </ModalHeader>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  isLoading={isButtonLoading}
                  onPress={handleLogout}
                >
                  Ya, keluar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Tidak
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
