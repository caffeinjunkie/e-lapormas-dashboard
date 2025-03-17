import { useState } from "react";

export const useFilterSingleSelect = (defaultKeys: Set<string>) => {
  const [selected, setSelected] = useState<Set<string>>(defaultKeys);

  return {
    selected,
    setSelected,
  };
};
