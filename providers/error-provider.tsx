"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect } from "react";

export const useError = () => {
  return useContext(ErrorContext);
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

const ErrorContext = createContext<ErrorProviderValue | undefined>(undefined);

interface ErrorProviderValue {
  clearError: () => void;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const router = useRouter();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const queryParams = new URLSearchParams(window.location.search);

    const errorParam = hashParams.get("error") || queryParams.get("error");
    const errorCodeParam =
      hashParams.get("error_code") || queryParams.get("error_code");

    if (errorParam && errorCodeParam) {
      router.push(`/error?errorCode=${errorCodeParam}`);
    }
  }, [router]);

  const clearError = () => {
    router.replace("/");
  };

  return (
    <ErrorContext.Provider value={{ clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};
