"use client";

import { ModalHeader } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "../icons";
import { MobileNavbar } from "./navbar-mobile";
import { Sidebar } from "./navbar-sidebar";

import { fetchAdminById } from "@/api/admin";
import { fetchAppConfig } from "@/api/app-config";
import { logout } from "@/api/auth";
import { fetchUserData, generateFakeName, updateAuthUser } from "@/api/users";
import { Modal } from "@/components/modal";
import { siteConfig } from "@/config/site";
import { usePrivate } from "@/providers/private-provider";
import { ProfileData } from "@/types/user.types";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { shouldShowConfirmation, setShouldShowConfirmation, isRevalidated } =
    usePrivate()!;
  const t = useTranslations("Navbar");
  const { isOpen, openModal, closeModal } = Modal.useModal();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isNavbarFullyLoaded, setIsNavbarFullyLoaded] = useState(false);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [nextPath, setNextPath] = useState("");

  const getData = async () => {
    try {
      const { data } = await fetchUserData();
      const result = await fetchAdminById(data.user.id);
      const appConfig = await fetchAppConfig();

      let displayName = result.display_name as string;

      if (!result.display_name || result.display_name.trim() === "") {
        const fakeName = await generateFakeName();
        displayName = fakeName;

        await updateAuthUser({ data: { full_name: displayName } });
      }

      setOrgName(appConfig.org_name);

      setUser({
        id: result.user_id,
        email: result.email as string,
        fullName: displayName,
        imageSrc: result.profile_img,
      });
      setIsSuperAdmin(result.is_super_admin);
    } catch (error) {
      await handleLogout();
    } finally {
      setIsNavbarFullyLoaded(true);
    }
  };

  useEffect(() => {
    getData();
  }, [isRevalidated]);

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

  const handleNavigation = (href: string) => {
    if (href === "/logout") {
      handleLogout();
      return;
    }
    router.push(href);
    setShouldShowConfirmation(false);
    closeModal();
    setNextPath("");
  };

  const openSpecificModal = (href: string) => {
    openModal();
    setNextPath(href);
  };

  return (
    <>
      <MobileNavbar
        isSuperAdmin={isSuperAdmin}
        onNavigate={handleNavigation}
        shouldShowConfirmation={shouldShowConfirmation}
        openModal={openSpecificModal}
      >
        {mobileHeaderLabel}
      </MobileNavbar>
      <Sidebar
        isSuperAdmin={isSuperAdmin}
        pathname={pathname}
        isLoaded={isNavbarFullyLoaded}
        onNavigate={handleNavigation}
        shouldShowConfirmation={shouldShowConfirmation}
        user={user}
        openModal={openSpecificModal}
      >
        <div className="flex justify-center px-6 pt-4 w-full">
          <Skeleton
            className="rounded-full h-14"
            isLoaded={isNavbarFullyLoaded}
          >
            <div className="flex flex-col justify-center pb-4">
              <Logo
                color={siteConfig.sidebarTheme.secondary}
                fill={siteConfig.sidebarTheme.text}
              />
              <p className="text-[10px] mt-[-12px] mr-3 text-right">
                {orgName}
              </p>
            </div>
          </Skeleton>
        </div>
      </Sidebar>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        buttons={[
          {
            title: shouldShowConfirmation
              ? t("navigate-confirmation-button-text")
              : t("logout-confirmation-button-text"),
            onPress: shouldShowConfirmation
              ? () => handleNavigation(nextPath)
              : handleLogout,
            color: "danger",
            isLoading: isButtonLoading,
          },
          {
            title: shouldShowConfirmation
              ? t("navigate-cancellation-button-text")
              : t("logout-cancellation-button-text"),
            onPress: closeModal,
            color: "primary",
            variant: "solid",
          },
        ]}
      >
        <ModalHeader className="text-black">
          {shouldShowConfirmation
            ? t("navigate-confirmation-title")
            : t("logout-confirmation-title")}
        </ModalHeader>
      </Modal>
    </>
  );
};
