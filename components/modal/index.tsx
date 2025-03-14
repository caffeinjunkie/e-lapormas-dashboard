import { PropsWithChildren } from "react";
import { Button, ButtonProps } from "@heroui/button";
import {
  Modal as HeroUIModal,
  ModalContent,
  ModalFooter,
  ModalProps as HeroUIModalProps,
} from "@heroui/modal";
import { useTranslations } from "next-intl";

interface ModalButtonProps extends ButtonProps {
  title: string;
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
      className="bg-white"
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {children}
            <ModalFooter className="p-4">
              {buttons?.length > 0 &&
                buttons?.map(({ title, ...props }, index) => (
                  <Button key={index} radius="sm" {...props}>
                    {title}
                  </Button>
                ))}
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
