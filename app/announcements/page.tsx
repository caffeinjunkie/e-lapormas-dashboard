"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

import { swrConfig } from "../config";
import { AnnouncementCard } from "./announcement-card";
import { AnnouncementForm } from "./announcement-form";
import {
  createNewAnnouncement,
  deleteAnnouncementById,
  editAnnouncementById,
} from "./handlers";

import { fetchAnnouncements } from "@/api/announcements";
import Error from "@/components/error";
import { Layout } from "@/components/layout";
import { Modal, ModalButtonProps } from "@/components/modal";
import { subtitle } from "@/components/primitives";
import { SearchBar } from "@/components/search-bar";
import { buildFormData } from "@/utils/form";

export default function AnnouncementsPage() {
  const t = useTranslations("AnnouncementsPage");

  const [selectedAnnonouncement, setSelectedAnnouncement] = useState<
    string | null
  >(null);
  const { modals, openModal, closeModal } = Modal.useMultipleModal();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const limit = 8;
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchValue(value);
  }, 500);
  const {
    data: announcements,
    error: announcementsError,
    isLoading: isAnnouncementsLoading,
    mutate: mutateAnnouncements,
  } = useSWR(
    ["announcements-dashboard", page, searchValue],
    () => fetchAnnouncements(page - 1, limit, searchValue),
    swrConfig,
  );

  const onSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const onEditPress = (id: string) => {
    openModal("edit");
    setSelectedAnnouncement(id);
  };

  const onDeletePress = (id: string) => {
    openModal("delete");
    setSelectedAnnouncement(id);
  };

  const onConfirmDelete = async () => {
    closeModal();
    const imagePath = announcements?.data
      ?.find((item) => item.id === selectedAnnonouncement)
      ?.img.split("announcements/")[1]
      .split("?c")[0];

    await deleteAnnouncementById(
      selectedAnnonouncement!,
      imagePath,
      setIsSubmitLoading,
      closeModal,
    );
    await mutateAnnouncements();
    setSelectedAnnouncement(null);
  };

  const onSubmitCreateAnnouncement = async (
    e: FormEvent<HTMLFormElement>,
    startDate: string,
    endDate: string,
    files: File[],
  ) => {
    e.preventDefault();

    const formData = buildFormData(e);

    const data = {
      startDate,
      endDate,
      images: files,
      isAutoDelete: formData.get("is_auto_delete_switch") as unknown as boolean,
      title: formData.get("title") as string,
      url: formData.get("url") as string,
    };
    await createNewAnnouncement(data, setIsSubmitLoading, closeModal);
    await mutateAnnouncements();
  };

  const onSubmitEditAnnouncement = async (
    e: FormEvent<HTMLFormElement>,
    startDate: string,
    endDate: string,
    files: File[],
  ) => {
    e.preventDefault();

    const formData = buildFormData(e);

    const updatedData = {
      startDate,
      endDate,
      images: files,
      title: formData.get("title") as string,
      isAutoDelete: formData.get("is_auto_delete_switch") as unknown as boolean,
      url: formData.get("url") as string,
    };
    const oldData = announcements?.data?.find(
      (item) => item.id === selectedAnnonouncement,
    );
    await editAnnouncementById(
      updatedData,
      oldData,
      setIsSubmitLoading,
      closeModal,
    );
    await mutateAnnouncements();
    setSelectedAnnouncement(null);
  };

  const modalConfig = {
    add: {
      title: t("add-announcement-title"),
      content: (
        <AnnouncementForm
          id="create-announcement"
          isSubmitLoading={isSubmitLoading}
          onCancel={() => closeModal()}
          onSubmitAnnouncement={onSubmitCreateAnnouncement}
        />
      ),
      withButton: false,
      buttons: [],
    },
    edit: {
      title: t("edit-announcement-title"),
      content: (
        <AnnouncementForm
          id="edit-announcement"
          isSubmitLoading={isSubmitLoading}
          onCancel={() => closeModal()}
          onSubmitAnnouncement={onSubmitEditAnnouncement}
          selectedAnnouncement={announcements?.data?.find(
            (item) => item.id === selectedAnnonouncement,
          )}
        />
      ),
      withButton: false,
      buttons: [],
    },
    delete: {
      title: t("delete-announcement-title"),
      content: t("delete-announcement-confirmation-text"),
      withButton: true,
      buttons: [
        {
          color: "danger",
          variant: "light",
          className: "w-full md:w-fit",
          onPress: onConfirmDelete,
          title: t("delete-announcement-confirm-button-text"),
        },
        {
          color: "primary",
          variant: "solid",
          className: "w-full md:w-fit",
          onPress: () => closeModal(),
          title: t("delete-announcement-cancel-button-text"),
        },
      ],
    },
  };

  return (
    <Layout
      title={t("title")}
      classNames={{
        header: "gap-4",
        body: "pb-16 sm:pb-14 lg:pb-4 flex flex-col gap-4 w-full items-center",
      }}
      headerComponent={
        <div className="flex flex-col gap-4 items-start justify-between w-full">
          <p
            className={clsx(subtitle({ className: "text-sm" }), "flex flex-1")}
          >
            {t("subtitle")}
          </p>
          <div className="flex flex-col md:flex-row gap-2 items-start justify-between w-full">
            <SearchBar
              className="w-full flex-1 lg:max-w-[50%]"
              placeholder={t("search-placeholder")}
              onClear={() => setSearchValue("")}
              onValueChange={(value) => onSearchChange(value)}
            />
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
              className="text-white w-full md:w-fit outline-none"
            >
              {t("add-announcement-button-text")}
            </Button>
          </div>
        </div>
      }
    >
      {announcementsError && !isAnnouncementsLoading && (
        <Error
          message={t("error-message")}
          onReset={() => mutateAnnouncements()}
        />
      )}
      {isAnnouncementsLoading && (
        <div className="flex items-center justify-center w-full h-full min-h-64 p-6">
          <Spinner />
        </div>
      )}
      {announcements?.data?.length === 0 &&
        !isAnnouncementsLoading &&
        !announcementsError && (
          <div className="flex items-center justify-center w-full h-full min-h-64 p-6">
            <p className="text-default-500 text-center">
              {t("no-announcements-text")}
            </p>
          </div>
        )}
      {!isAnnouncementsLoading && !announcementsError && announcements && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 px-6 pt-2 pb-6">
          {announcements.data.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              item={announcement}
              onEditPress={onEditPress}
              onDeletePress={onDeletePress}
            />
          ))}
        </div>
      )}
      {Number(announcements?.count) > 0 && (
        <div
          className={clsx(
            "flex w-full justify-center pt-4 md:pt-2 pb-4 bg-white",
            "shadow-[rgba(5,5,5,0.1)_0_-1px_1px_0px] absolute bottom-0 z-10 lg:shadow-none lg:sticky lg:bottom-auto",
          )}
        >
          <Pagination
            showControls
            showShadow
            color="primary"
            page={page}
            total={Math.ceil(Number(announcements?.count) / limit)}
            onChange={setPage}
          />
        </div>
      )}

      <Modal
        isOpen={modals.edit || modals.delete || modals.add}
        onClose={() => closeModal()}
        withButton={
          modalConfig[
            Object.keys(modals).find(
              (modal) => modals[modal] === true,
            ) as keyof typeof modalConfig
          ]?.withButton
        }
        buttons={
          (modalConfig[
            Object.keys(modals).find(
              (modal) => modals[modal] === true,
            ) as keyof typeof modalConfig
          ]?.buttons as ModalButtonProps[]) || []
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
