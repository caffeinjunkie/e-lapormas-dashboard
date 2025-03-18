"use client";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import { ErrorProvider } from "@/providers/error-provider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider
        placement="top-right"
        toastOffset={10}
        toastProps={{ timeout: 3000 }}
      />
      <ErrorProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </ErrorProvider>
    </HeroUIProvider>
  );
}
