import { useState } from "react";

export const useSingleSelectDropdown = (defaultKeys: Set<string>) => {
  const [selected, setSelected] = useState<Set<string>>(defaultKeys);

  return {
    selected,
    setSelected,
  };
};
