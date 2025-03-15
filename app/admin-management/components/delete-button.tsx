import { Button } from "@heroui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/tooltip";

interface DeleteButtonProps {
  isDisabled?: boolean;
  onPress: () => void;
  tooltipContent: string;
}

export const DeleteButton = ({
  isDisabled = false,
  onPress,
  tooltipContent,
}: DeleteButtonProps) => (
  <div className="relative flex w-full justify-center items-center gap-2">
    <Tooltip isDisabled={isDisabled} color="danger" content={tooltipContent}>
      <Button
        isDisabled={isDisabled}
        isIconOnly
        size="sm"
        radius="full"
        variant="light"
        onPress={onPress}
      >
        <TrashIcon className="size-5 text-danger" />
      </Button>
    </Tooltip>
  </div>
);
