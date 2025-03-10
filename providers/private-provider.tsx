"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/client";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const publicPaths = ["/login", "/error", "/auth/confirm"];

const PrivateContext = createContext<{ isPrivate: boolean } | undefined>(
  undefined,
);

export const usePrivate = () => {
  const context = useContext(PrivateContext);
  if (!context) {
    throw new Error("usePrivate must be used within a PrivateProvider");
  }
  return context;
};

export function PrivateProvider({ children }: PrivateLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isPublicPath = publicPaths.includes(pathname);
  const isCreatePasswordPath = pathname.includes("/create-password");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && !isPublicPath) {
          router.replace("/login");
        } else if (session && isPublicPath) {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.replace("/error");
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isPublicPath) {
        router.replace("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  return (
    <PrivateContext.Provider
      value={{ isPrivate: !isPublicPath && !isCreatePasswordPath }}
    >
      {!(isPublicPath || isCreatePasswordPath) && <Navbar />}
      {children}
    </PrivateContext.Provider>
  );
}
