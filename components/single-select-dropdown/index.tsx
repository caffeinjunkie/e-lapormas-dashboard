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
  size?: ButtonProps["size"];
  buttonEndContent?: React.ReactNode;
  buttonStartContent?: React.ReactNode;
}

const SingleSelectDropdown: React.FC<
  PropsWithChildren<SingleSelectDropdownProps>
> & { useDropdown: typeof useSingleSelectDropdown } = ({
  label,
  items,
  selectedKeys,
  children,
  buttonEndContent,
  buttonStartContent,
  radius = "md",
  size = "md",
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
          size={size}
          startContent={buttonStartContent}
          endContent={buttonEndContent}
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
