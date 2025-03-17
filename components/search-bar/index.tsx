import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Input, InputProps } from "@heroui/input";

interface SearchBarProps extends InputProps {
  onClear: () => void;
  onValueChange: (value: string) => void;
}

export const SearchBar = ({
  onClear,
  onValueChange,
  labelPlacement = "outside",
  ...props
}: SearchBarProps) => (
  <Input
    aria-label="Search"
    classNames={{
      inputWrapper: "bg-default-100",
      input: "text-sm",
    }}
    endContent={<XCircleIcon className="size-4 text-default-500" />}
    isClearable
    onClear={onClear}
    onValueChange={onValueChange}
    labelPlacement={labelPlacement}
    startContent={
      <MagnifyingGlassIcon className="size-4 text-default-400 pointer-events-none flex-shrink-0" />
    }
    type="search"
    {...props}
  />
);
