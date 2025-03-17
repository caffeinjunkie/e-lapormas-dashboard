import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownMenuProps,
  DropdownTrigger,
} from "@heroui/dropdown";
import { PropsWithChildren } from "react";

interface FilterDropdownProps extends DropdownMenuProps {
  label: string;
  items: { id: string; label: string }[];
  triggerClassname?: string;
}

export const FilterDropdown: React.FC<
  PropsWithChildren<FilterDropdownProps>
> = ({
  label,
  items,
  children,
  triggerClassname,
  selectionMode = "single",
  ...props
}) => {
  return (
    <Dropdown>
      <DropdownTrigger className={`flex ${triggerClassname}`}>
        <Button
          className="text-default-700"
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
        selectionMode={selectionMode}
        {...props}
      >
        {items.map((item) => (
          <DropdownItem key={item.id} className="capitalize">
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
