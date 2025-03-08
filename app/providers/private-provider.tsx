"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "./supabase-provider";
import { Navbar } from "@/components/navbar";

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
  const supabase = useSupabase();
  const [isLoading, setIsLoading] = useState(true);

  const isPublicPath = publicPaths.includes(pathname);

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
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <PrivateContext.Provider value={{ isPrivate: !isPublicPath }}>
      {!isPublicPath && <Navbar />}
      {children}
    </PrivateContext.Provider>
  );
}
