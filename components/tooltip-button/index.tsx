import { Button } from "@heroui/button";
import { Tooltip, TooltipProps } from "@heroui/tooltip";

interface TooltipButtonProps extends TooltipProps {
  onPress: () => void;
  icon?: React.ReactNode;
  isLoading?: boolean;
  variant?:
    | "light"
    | "ghost"
    | "shadow"
    | "solid"
    | "bordered"
    | "flat"
    | "faded"
    | undefined;
}

export const TooltipButton = ({
  isDisabled = false,
  onPress,
  isLoading = false,
  icon,
  variant = "light",
  ...props
}: TooltipButtonProps) => (
  <div className="relative flex w-full justify-center items-center gap-2">
    <Tooltip delay={1000} isDisabled={isDisabled} {...props}>
      <Button
        isDisabled={isDisabled}
        isLoading={isLoading}
        isIconOnly
        size="sm"
        radius="full"
        variant={variant}
        onPress={onPress}
      >
        {isLoading || icon}
      </Button>
    </Tooltip>
  </div>
);
