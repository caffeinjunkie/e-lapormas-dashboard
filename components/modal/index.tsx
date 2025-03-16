import { PropsWithChildren } from "react";
import { Button, ButtonProps, PressEvent } from "@heroui/button";
import {
  Modal as HeroUIModal,
  ModalContent,
  ModalFooter,
  ModalProps as HeroUIModalProps,
} from "@heroui/modal";
import { useTranslations } from "next-intl";

export interface ModalButtonProps extends ButtonProps {
  title: string;
  formId?: string;
}

interface ModalProps extends HeroUIModalProps {
  onClose: () => void;
  isOpen: boolean;
  buttons?: ModalButtonProps[];
}

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  onClose,
  isOpen,
  children,
  buttons = [],
  ...props
}) => {
  const t = useTranslations("Modal");

  return (
    <HeroUIModal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-white focus:outline-none"
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {children}
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
          </>
        )}
      </ModalContent>
    </HeroUIModal>
  );
};
