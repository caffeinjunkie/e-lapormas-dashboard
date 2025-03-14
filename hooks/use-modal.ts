import { useState } from "react";

export const useModal = (defaultOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
