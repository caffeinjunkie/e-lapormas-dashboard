import { useState } from "react";
import { Input } from "@heroui/input";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface PasswordInputProps {
  label: string;
  isRequired?: boolean;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  validate?: (value: string) => string | null;
  ariaLabel?: string;
  errorMessage?: string | null;
}

export const PasswordInput = ({
  label,
  isRequired = false,
  variant = "flat",
  ariaLabel = "password",
  ...props
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label={label}
      aria-label={ariaLabel}
      name={ariaLabel}
      type={isVisible ? "text" : "password"}
      variant={variant}
      isRequired={isRequired}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashIcon className="w-6 h-6 text-default-400 pointer-events-none" />
          ) : (
            <EyeIcon className="w-6 h-6 text-default-400 pointer-events-none" />
          )}
        </button>
      }
      {...props}
    />
  );
};
