import {
  Input as HeroInput,
  InputProps as HeroInputProps,
} from "@heroui/input";

interface InputProps extends HeroInputProps {
  label: string;
}

export const Input = ({
  label,
  name,
  isRequired = false,
  radius = "sm",
  variant = "flat",
  ...props
}: InputProps) => (
  <HeroInput
    label={label}
    radius={radius}
    variant={variant}
    aria-label={name}
    name={name}
    {...props}
  />
);
