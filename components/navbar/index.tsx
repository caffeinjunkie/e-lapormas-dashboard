"use client";

import { Image } from "@heroui/image";
import { ModalHeader } from "@heroui/modal";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoSquare } from "../icons";
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
import { getCookie } from "@/utils/cookie";

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
  const [orgName, setOrgName] = useState("");
  const [nextPath, setNextPath] = useState("");

  const getData = async () => {
    try {
      const { data } = await fetchUserData();
      const result = await fetchAdminById(data.user.id);
      let orgName = getCookie("org_name");

      if (!orgName) {
        const appConfig = await fetchAppConfig();
        orgName = appConfig.org_name;
        document.cookie = `org_name=${orgName}; path=/`;
      }

      setOrgName(orgName!);

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
        imageSrc: result.profile_img,
      });
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
      <p className="font-bold text-black">
        {t(
          `navbar-${pathname === "/" ? "dashboard" : pathname.split("/")[1]}-label`,
        )}
      </p>
    </NextLink>
  );

  const handleNavigation = (href: string) => {
    setShouldShowConfirmation(false);
    setNextPath("");
    if (href === "/logout") {
      handleLogout();
      return;
    }
    router.push(href);

    closeModal();
  };

  const openSpecificModal = (href: string) => {
    openModal();
    setNextPath(href);
  };

  return (
    <>
      <MobileNavbar
        pathname={pathname}
        onNavigate={handleNavigation}
        shouldShowConfirmation={shouldShowConfirmation}
        openModal={openSpecificModal}
      >
        {mobileHeaderLabel}
      </MobileNavbar>
      <Sidebar
        pathname={pathname}
        isLoaded={isNavbarFullyLoaded}
        onNavigate={handleNavigation}
        shouldShowConfirmation={shouldShowConfirmation}
        user={user}
        openModal={openSpecificModal}
      >
        <div className="flex justify-center px-6 pt-4 w-full">
          <div className="flex flex-col justify-center animate-drop">
            <div className="flex items-center gap-2 mt-4">
              <Image
                src={`${siteConfig.storagePath}/app-assets//kabmimika.png`}
                height={60}
                className="object-contain rounded-none"
                alt="Logo"
              />
              <LogoSquare
                color={siteConfig.sidebarTheme.secondary}
                fill="#eadec4"
              />
            </div>
            <p
              className={clsx(
                "text-[10px] mt-1 text-center transition-opacity duration-3000 ease-in-out",
                !isNavbarFullyLoaded ? "opacity-0 h-[15px]" : "animate-appear",
              )}
            >
              {orgName}
            </p>
          </div>
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
        <ModalHeader>
          {shouldShowConfirmation
            ? t("navigate-confirmation-title")
            : t("logout-confirmation-title")}
        </ModalHeader>
      </Modal>
    </>
  );
};
