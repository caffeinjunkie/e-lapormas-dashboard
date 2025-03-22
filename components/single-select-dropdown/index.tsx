import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button, ButtonProps } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownMenuProps,
  DropdownTrigger,
} from "@heroui/dropdown";
import { PropsWithChildren } from "react";

import { useSingleSelectDropdown } from "./use-single-select-dropdown";

interface SingleSelectDropdownProps extends DropdownMenuProps {
  label: string;
  items: { id: string; label: string }[];
  radius?: ButtonProps["radius"];
  triggerClassname?: string;
}

const SingleSelectDropdown: React.FC<
  PropsWithChildren<SingleSelectDropdownProps>
> & { useDropdown: typeof useSingleSelectDropdown } = ({
  label,
  items,
  selectedKeys,
  children,
  radius = "md",
  triggerClassname,
  className,
  selectionMode = "single",
  ...props
}) => {
  return (
    <Dropdown>
      <DropdownTrigger className={`flex ${triggerClassname}`}>
        <Button
          className={`text-default-700 ${className}`}
          radius={radius}
          endContent={
            <ChevronDownIcon className="size-4 stroke-2 text-default-700" />
          }
          variant="flat"
        >
          {children}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={label}
        closeOnSelect
        disabledKeys={selectedKeys}
        selectionMode={selectionMode}
        {...props}
      >
        {items.map((item) => (
          <DropdownItem key={item.id}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

SingleSelectDropdown.useDropdown = useSingleSelectDropdown;

export { SingleSelectDropdown };
