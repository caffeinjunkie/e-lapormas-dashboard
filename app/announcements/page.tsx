"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { ModalBody, ModalHeader } from "@heroui/modal";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { AnnouncementCard } from "./announcement-card";
import { announcements } from "./mock-data";

import { Layout } from "@/components/layout";
import { Modal, ModalButtonProps } from "@/components/modal";
import { subtitle } from "@/components/primitives";

export default function AnnouncementsPage() {
  const t = useTranslations("AnnouncementsPage");
  const [selectedAnnonouncement, setSelectedAnnouncement] = useState<
    string | null
  >(null);
  const { modals, openModal, closeModal } = Modal.useMultipleModal();

  const onEditPress = (id: string) => {
    openModal("edit");
    setSelectedAnnouncement(id);
  };

  const onDeletePress = (id: string) => {
    openModal("delete");
    setSelectedAnnouncement(id);
  };

  const onDeleteConfirm = () => {
    closeModal();
    onDeletePress(selectedAnnonouncement!);
  };

  const modalConfig = {
    add: {
      title: t("add-announcement-title"),
      content: <></>,
      buttons: [],
    },
    edit: {
      title: t("edit-announcement-title"),
      content: <></>,
      buttons: [],
    },
    delete: {
      title: t("delete-announcement-title"),
      content: t("delete-announcement-confirmation-text"),
      buttons: [
        {
          color: "danger",
          variant: "light",
          onPress: onDeleteConfirm,
          title: t("delete-announcement-confirm-button-text"),
        },
        {
          color: "primary",
          variant: "solid",
          onPress: () => closeModal(),
          title: t("delete-announcement-cancel-button-text"),
        },
      ],
    },
  };

  console.log(modals, "tes");

  return (
    <Layout
      title={t("title")}
      classNames={{
        header: "gap-4",
        body: "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 px-6 pt-2 pb-6",
      }}
      headerComponent={
        <div className="flex flex-col md:flex-row gap-2 items-start justify-between w-full">
          <p
            className={clsx(subtitle({ className: "text-sm" }), "flex flex-1")}
          >
            {t("subtitle")}
          </p>
          <Button
            color="warning"
            onPress={() => openModal("add")}
            startContent={
              <div className="border-1.5 border-white rounded-md">
                <PlusIcon
                  className="w-4 h-4"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </div>
            }
            className="text-white w-full md:w-fit"
          >
            {t("add-announcement-button-text")}
          </Button>
        </div>
      }
    >
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          item={announcement}
          onEditPress={onEditPress}
          onDeletePress={onDeletePress}
        />
      ))}
      <Modal
        isOpen={modals.edit || modals.delete || modals.add}
        onClose={() => closeModal()}
        buttons={
          modalConfig[
            Object.keys(modals).find(
              (modal) => modals[modal] === true,
            ) as keyof typeof modalConfig
          ]?.buttons as ModalButtonProps[]
        }
      >
        <ModalHeader>
          {
            modalConfig[
              Object.keys(modals).find(
                (modal) => modals[modal] === true,
              ) as keyof typeof modalConfig
            ]?.title
          }
        </ModalHeader>
        <ModalBody>
          {
            modalConfig[
              Object.keys(modals).find(
                (modal) => modals[modal] === true,
              ) as keyof typeof modalConfig
            ]?.content
          }
        </ModalBody>
      </Modal>
    </Layout>
  );
}

AnnouncementsPage.displayName = "AnnouncementsPage";
