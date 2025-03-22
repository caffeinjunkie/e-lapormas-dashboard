"use client";

import { Modal, ModalContent } from "@heroui/modal";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import { getCookie } from "@/utils/cookie";
import { createClient } from "@/utils/supabase-auth/client";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const publicPaths = ["/login", "/create-password"];

const PrivateContext = createContext<
  | {
      isPrivate: boolean;
      isRevalidated: boolean;
      setIsRevalidated: (value: boolean) => void;
      shouldShowConfirmation: boolean;
      setShouldShowConfirmation: (value: boolean) => void;
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

export function PrivateProvider({ children }: PrivateLayoutProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRevalidated, setIsRevalidated] = useState<boolean>(false);
  const [shouldShowConfirmation, setShouldShowConfirmation] =
    useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isPublicPath = publicPaths.includes(pathname);
  const isErrorPath = pathname === "/error";

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUserId(session?.user.id as string);

        if (!session && !isPublicPath && !isErrorPath) {
          router.replace("/login");
        } else if (session && isPublicPath) {
          router.replace("/");
        }
      } catch (error) {
        router.replace("/error");
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
    if (userId === null) return;

    const visited = getCookie(userId as string);

    if (!visited) {
      setIsModalOpen(true);
    }

    function onComplete() {
      document.cookie = `${userId}=true;path=/`;
      setTimeout(() => {
        onCloseModal();
      }, 1500);
    }

    if (dotLottie) {
      dotLottie.addEventListener("complete", onComplete);
    }

    return () => {
      if (dotLottie) {
        dotLottie.removeEventListener("complete", onComplete);
      }
    };
  }, [dotLottie, userId]);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const dotLottieRefCallback = (dotLottie: DotLottie | null) => {
    setDotLottie(dotLottie);
  };

  return (
    <PrivateContext.Provider
      value={{
        isPrivate: !isPublicPath,
        isRevalidated,
        setIsRevalidated,
        shouldShowConfirmation,
        setShouldShowConfirmation,
      }}
    >
      {!isPublicPath && !isErrorPath && (
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
            <ModalContent>
              <DotLottieReact
                autoplay={isModalOpen}
                className="d-lg-block d-md-block d-sm-none d-none"
                src="https://lottie.host/9a57dcf3-865b-4c05-9135-93252148017c/cQDH4AffBr.lottie"
                dotLottieRefCallback={dotLottieRefCallback}
              />
            </ModalContent>
          </Modal>
        </>
      )}
      {children}
    </PrivateContext.Provider>
  );
}
