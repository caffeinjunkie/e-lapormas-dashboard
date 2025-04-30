"use client";

import { Modal, ModalContent } from "@heroui/modal";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { Logo } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { privatePaths } from "@/config/site";
import { getCookie } from "@/utils/cookie";
import { createClient } from "@/utils/supabase-auth/client";

interface PrivateLayoutProps {
  children: React.ReactNode;
  locale: string;
}

const publicPaths = ["/login", "/create-password"];

const PrivateContext = createContext<
  | {
      isPrivate: boolean;
      isRevalidated: boolean;
      setIsRevalidated: (value: boolean) => void;
      shouldShowConfirmation: boolean;
      setShouldShowConfirmation: (value: boolean) => void;
      locale: string;
    }
  | undefined
>(undefined);

export const usePrivate = () => {
  const context = useContext(PrivateContext);
  if (!context) {
    throw new Error("usePrivate must be used within a PrivateProvider");
  }
  return context;
};

export function PrivateProvider({ children, locale }: PrivateLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRevalidated, setIsRevalidated] = useState<boolean>(false);
  const [shouldShowConfirmation, setShouldShowConfirmation] =
    useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isPrivatePath =
    [...privatePaths, "/admin-management/unauthorized"].includes(pathname) ||
    pathname.includes("/reports");
  const isPublicPath = publicPaths.includes(pathname);
  const isErrorPath = pathname.includes("/error");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && isPrivatePath && !isErrorPath) {
          router.replace("/login");
        }

        if (session && !isPrivatePath && !isErrorPath) {
          router.replace("/");
        }

        if (session && !isPublicPath && !isPrivatePath && !isErrorPath) {
          router.replace("/error?errorCode=404");
        }
      } catch (error) {
        router.replace("/error?errorCode=unexpected-failure");
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isPublicPath && !isErrorPath) {
        router.replace("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  useEffect(() => {
    const visited = getCookie("visited");

    if (!visited) {
      setIsModalOpen(true);
      document.cookie = "visited=true;path=/";
    }

    setTimeout(() => {
      onCloseModal();
    }, 5000);
  }, []);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PrivateContext.Provider
      value={{
        isPrivate: !isPublicPath,
        isRevalidated,
        setIsRevalidated,
        shouldShowConfirmation,
        setShouldShowConfirmation,
        locale,
      }}
    >
      {isPrivatePath && !isErrorPath && (
        <>
          <Navbar />
          <Modal
            isOpen={isModalOpen}
            hideCloseButton
            placement="center"
            backdrop="blur"
            onClose={onCloseModal}
            className="bg-transparent shadow-none"
          >
            <ModalContent className="flex w-full justify-center items-center">
              <Logo animated={true} width={320} height={128} />
            </ModalContent>
          </Modal>
        </>
      )}
      {children}
    </PrivateContext.Provider>
  );
}
