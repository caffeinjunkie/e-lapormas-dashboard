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

export const useMultipleModal = () => {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const toggleModal = (modalName: string) => {
    setModals((prevModals) => ({
      ...prevModals,
      [modalName]: !prevModals[modalName],
    }));
  };

  const openModal = (modalName: string) => {
    setModals((prevModals) => ({
      ...prevModals,
      [modalName]: true,
    }));
  };

  const closeModal = (modalName: string = "") => {
    if (modalName === "") {
      setModals((prevModals) => ({
        ...prevModals,
        ...Object.keys(prevModals).reduce(
          (acc, key) => {
            acc[key] = false;
            return acc;
          },
          {} as Record<string, boolean>,
        ),
      }));
    } else {
      setModals((prevModals) => ({
        ...prevModals,
        [modalName]: false,
      }));
    }
  };

  return {
    modals,
    toggleModal,
    openModal,
    closeModal,
  };
};
