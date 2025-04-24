import { Button, ButtonProps } from "@heroui/button";
import {
  Modal as HeroUIModal,
  ModalProps as HeroUIModalProps,
  ModalContent,
  ModalFooter,
} from "@heroui/modal";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";

import { useModal, useMultipleModal } from "@/components/modal/use-modal";

export interface ModalButtonProps extends ButtonProps {
  title: string;
  formId?: string;
}

interface ModalProps extends HeroUIModalProps {
  onClose: () => void;
  isOpen: boolean;
  withButton?: boolean;
  buttons?: ModalButtonProps[];
}

const Modal: React.FC<PropsWithChildren<ModalProps>> & {
  useModal: typeof useModal;
  useMultipleModal: typeof useMultipleModal;
} = ({
  onClose,
  isOpen,
  children,
  withButton = true,
  buttons = [],
  className,
  ...props
}) => {
  const t = useTranslations("Modal");

  return (
    <HeroUIModal
      isOpen={isOpen}
      onClose={onClose}
      className={`focus:outline-none ${className}`}
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {children}
            {withButton && (
              <ModalFooter className="p-4">
                {buttons?.length > 0 &&
                  buttons?.map(
                    ({ title, variant = "light", formId, ...props }, index) => (
                      <Button
                        key={index}
                        radius="sm"
                        form={formId}
                        variant={variant}
                        {...props}
                      >
                        {title}
                      </Button>
                    ),
                  )}
                {buttons?.length === 0 && (
                  <Button
                    className="w-full"
                    variant="light"
                    radius="sm"
                    color="primary"
                    onPress={onClose}
                  >
                    {t("default-button-text")}
                  </Button>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </HeroUIModal>
  );
};

Modal.useModal = useModal;
Modal.useMultipleModal = useMultipleModal;

export { Modal };
