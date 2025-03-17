import { Button } from "@heroui/button";
import { Tooltip, TooltipProps } from "@heroui/tooltip";

interface TooltipButtonProps extends TooltipProps {
  onPress: () => void;
  icon?: React.ReactNode;
}

export const TooltipButton = ({
  isDisabled = false,
  onPress,
  icon,
  ...props
}: TooltipButtonProps) => (
  <div className="relative flex w-full justify-center items-center gap-2">
    <Tooltip isDisabled={isDisabled} {...props}>
      <Button
        isDisabled={isDisabled}
        isIconOnly
        size="sm"
        radius="full"
        variant="light"
        onPress={onPress}
      >
        {icon}
      </Button>
    </Tooltip>
  </div>
);
