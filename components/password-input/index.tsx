import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Input, InputProps } from "@heroui/input";
import { useState } from "react";

interface PasswordInputProps extends InputProps {
  ariaLabel?: string;
}

export const PasswordInput = ({
  label,
  isRequired = false,
  radius = "sm",
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
      radius={radius}
      isRequired={isRequired}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          disabled={props.disabled}
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
