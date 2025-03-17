"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useError = () => {
  return useContext(ErrorContext);
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

const ErrorContext = createContext<ErrorProviderValue | undefined>(undefined);

interface ErrorProviderValue {
  error: {
    errorParam: string;
    errorCodeParam: string;
    errorDescriptionParam: string;
  } | null;
  setError: (
    error: {
      errorParam: string;
      errorCodeParam: string;
      errorDescriptionParam: string;
    } | null,
  ) => void;
  clearError: () => void;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [error, setError] = useState<ErrorProviderValue["error"]>(null);
  const router = useRouter();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const queryParams = new URLSearchParams(window.location.search);

    const errorParam = hashParams.get("error") || queryParams.get("error");
    const errorCodeParam =
      hashParams.get("error_code") || queryParams.get("error_code");
    const errorDescriptionParam =
      hashParams.get("error_description") ||
      queryParams.get("error_description");

    if (errorParam && errorCodeParam && errorDescriptionParam) {
      setError({ errorParam, errorCodeParam, errorDescriptionParam });
      router.push(
        `/error?errorCode=${errorCodeParam}&errorDescription=${encodeURIComponent(errorDescriptionParam)}`,
      );
    }
  }, [router]);

  const clearError = () => {
    setError(null);
    router.push("/");
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};
