"use client";

import { KeyIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { SharedSelection } from "@heroui/system";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";

import {
  fetchProfile,
  handleSendResetPasswordRequest,
  saveAllSettings,
  saveImageToAdmin,
} from "./handlers";
import { ProfilePicture } from "./profile-picture";

import { fetchAppConfig, fetchTimezones } from "@/api/app-config";
import Error from "@/components/error/error";
import { FloppyIcon } from "@/components/icons";
import { Input } from "@/components/input";
import { Layout } from "@/components/layout";
import { Modal } from "@/components/modal";
import { usePrivate } from "@/providers/private-provider";
import { AppConfig } from "@/types/app-config.types";
import { Timezone } from "@/types/timezone.types";
import { ProfileData } from "@/types/user.types";
import { getCookie } from "@/utils/cookie";
import { buildFormData } from "@/utils/form";
import { validateIsRequired } from "@/utils/string";

export default function SettingsPage() {
  const t = useTranslations("SettingsPage");
  const { setShouldShowConfirmation, setIsRevalidated } = usePrivate();
  const [image, setImage] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isResetLoading, setIsResetLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPageError, setIsPageError] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [appSettings, setAppSettings] = useState<AppConfig | null>(null);
  const [timezonesOptions, setTimezonesOptions] = useState<Timezone[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const { isOpen, openModal, closeModal } = Modal.useModal();
  const [modalType, setModalType] = useState<string>("upload");

  useEffect(() => {
    // workaround for Select Hydration error on Hero UI. Waiting for an update
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setShouldShowConfirmation(unsavedChanges);
  }, [unsavedChanges]);

  const getProfile = async () => {
    const admin = await fetchProfile();

    // setImage(admin.profile_img);
    setProfile({
      id: admin.user_id,
      fullName: admin.display_name,
      email: admin.email,
      imageSrc: admin.profile_img,
    });
  };

  const getAppConfig = async () => {
    const timezones = await fetchTimezones();
    setTimezonesOptions(timezones);
    const cookieTimezone = getCookie("timezone");
    const cookieOrgName = getCookie("org_name");

    if (cookieTimezone && cookieOrgName) {
      setAppSettings({ timezone: cookieTimezone, org_name: cookieOrgName });
      setSelectedTimezone(cookieTimezone);
      return;
    }
    const { timezone, org_name } = await fetchAppConfig();
    document.cookie = `timezone=${timezone}; path=/`;
    document.cookie = `org_name=${org_name}; path=/`;
    setAppSettings({ timezone, org_name });
    setSelectedTimezone(timezone !== null ? timezone : timezones[0].key);
  };

  const getProfileAndAppConfig = async () => {
    setIsPageLoading(true);
    try {
      await Promise.all([getProfile(), getAppConfig()]);
      setIsPageError(false);
    } catch (e) {
      setIsPageError(true);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    getProfileAndAppConfig();
  }, []);

  const handleUnsavedChanges = (hasUnsavedChanges: boolean) => {
    setUnsavedChanges(hasUnsavedChanges);
    setIsRevalidated(!hasUnsavedChanges);
  };

  const onTimezoneSelect = (keys: SharedSelection) => {
    handleUnsavedChanges(true);
    setSelectedTimezone(Array.from(keys)[0] as string);
  };

  const onResetPasswordPress = () => {
    handleSendResetPasswordRequest(
      profile?.email as string,
      setIsResetLoading,
      t,
    );
  };

  const onConfirmUpload = () => {
    setImage("https://i.pravatar.cc/150?u=a04258114e29026708c");
    saveImageToAdmin(
      t,
      setIsRevalidated,
      profile!,
      setIsUploading,
      "https://i.pravatar.cc/150?u=a04258114e29026708c",
    );
    closeModal();
    setProfile({
      ...profile!,
      imageSrc: "https://i.pravatar.cc/150?u=a04258114e29026708c",
    });
  };

  const onPressUpload = () => {
    setIsRevalidated(false);

    setModalType("upload");
    openModal();
  };

  const onConfirmDelete = () => {
    setIsRevalidated(false);
    setImage(null);

    saveImageToAdmin(t, setIsRevalidated, profile!, setIsUploading);
    setProfile({
      ...profile!,
      imageSrc: null!,
    });
    closeModal();
  };

  const onPressDelete = () => {
    setModalType("delete");
    openModal();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    const { success } = await saveAllSettings(formData, setIsSaveLoading, t);
    if (success) {
      handleUnsavedChanges(false);
    }
  };

  if (!isMounted || isPageLoading) {
    return (
      <Layout title={t("title")} classNames={{ body: "px-6" }}>
        <div className="flex w-full absolute left-0 items-center justify-center bottom-0 h-screen">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t("title")} classNames={{ body: "px-6" }}>
      {isPageError && !isPageLoading && (
        <Error
          message={t("page-error-message")}
          onReset={getProfileAndAppConfig}
        />
      )}
      {!isPageLoading && !isPageError && (
        <Form
          id="profile"
          onSubmit={onSubmit}
          className="gap-3 md:gap-5 px-0 sm:px-12 md:px-0 lg:px-[14%] xl:px-[20%] md:pt-4"
        >
          <ProfilePicture
            image={profile?.imageSrc as string}
            isUploading={isUploading}
            onPressUpload={onPressUpload}
            onPressDelete={onPressDelete}
            t={t}
          />
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Input
                aria-label="name"
                label={t("profile-name-input-label")}
                type="text"
                radius="md"
                isRequired
                onChange={() => handleUnsavedChanges(true)}
                defaultValue={profile?.fullName}
                name="name"
                placeholder={t("profile-name-placeholder-text")}
                validate={(value) => validateIsRequired(t, value, "name")}
              />
              <Input
                aria-label="org-name"
                label={t("app-settings-org-input-label")}
                type="text"
                radius="md"
                isRequired
                onChange={() => handleUnsavedChanges(true)}
                defaultValue={appSettings?.org_name}
                className="w-[100%] lg:w-[80%]"
                name="org-name"
                validate={(value) => validateIsRequired(t, value, "org-name")}
                placeholder={t("app-settings-org-placeholder-text")}
              />
            </div>
          </div>
          <div className="flex flex-row w-full md:flex-row gap-3">
            <Input
              aria-label="email"
              label={t("profile-email-input-label")}
              type="text"
              radius="md"
              isDisabled
              defaultValue={profile?.email}
              name="email"
            />
            <Select
              className="w-64 lg:w-[80%]"
              radius="md"
              name="timezone"
              label={t("app-settings-timezone-select-label")}
              selectedKeys={[selectedTimezone]}
              disabledKeys={[selectedTimezone]}
              items={timezonesOptions}
              placeholder={t("app-settings-timezone-placeholder-text")}
              onSelectionChange={onTimezoneSelect}
            >
              {(timezone) => (
                <SelectItem key={timezone.key} className="outline-none">
                  {t(`timezone-label-${timezone.key}-label`)}
                </SelectItem>
              )}
            </Select>
          </div>
          <div className="flex w-full h-24 items-center justify-center rounded-xl bg-default-50">
            <Button
              radius="md"
              type="submit"
              color="warning"
              variant="ghost"
              isLoading={isResetLoading}
              onPress={onResetPasswordPress}
              startContent={!isResetLoading && <KeyIcon className="size-5" />}
            >
              {t("reset-password-button-text")}
            </Button>
          </div>
          <div className="flex w-full justify-center md:justify-end">
            <Button
              color="primary"
              radius="md"
              isLoading={isSaveLoading}
              isDisabled={!unsavedChanges}
              type="submit"
              startContent={
                !isSaveLoading && <FloppyIcon color="white" size={21} />
              }
              className="fixed bottom-6 right-6 left-6 sm:right-20 sm:left-20 md:sticky md:right-0"
            >
              {t("form-save-button-text")}
            </Button>
          </div>
        </Form>
      )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        buttons={[
          {
            title: t(`${modalType}-profile-picture-modal-first-button-text`),
            color: modalType === "upload" ? "default" : "danger",
            variant: "light",
            isLoading: modalType === "upload" ? false : isUploading,
            isDisabled: isUploading,
            onPress: () => {
              if (modalType === "upload") {
                closeModal();
              } else {
                onConfirmDelete();
              }
            },
          },
          {
            title: t(`${modalType}-profile-picture-modal-second-button-text`),
            color: "primary",
            variant: "solid",
            isLoading: modalType === "upload" ? isUploading : false,
            isDisabled: isUploading,
            onPress: () => {
              if (modalType === "upload") {
                onConfirmUpload();
              } else {
                closeModal();
              }
            },
          },
        ]}
      >
        <ModalHeader>
          {t(`${modalType}-profile-picture-modal-header`)}
        </ModalHeader>
        <ModalBody>
          {modalType === "upload" ? (
            <div>tes</div>
          ) : (
            <p className="text-default-500">
              {t(`${modalType}-profile-picture-modal-body`)}
            </p>
          )}
        </ModalBody>
      </Modal>
    </Layout>
  );
}

SettingsPage.displayName = "SettingsPage";
