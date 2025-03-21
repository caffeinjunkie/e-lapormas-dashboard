"use client";

import {
  CameraIcon,
  KeyIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
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

import { fetchAppConfig, fetchTimezones } from "@/api/app-config";
import Error from "@/components/error/error";
import { FloppyIcon } from "@/components/icons";
import { Input } from "@/components/input";
import { Layout } from "@/components/layout";
import { usePrivate } from "@/providers/private-provider";
import { AppConfig } from "@/types/app-config.types";
import { Timezone } from "@/types/timezone.types";
import { ProfileData } from "@/types/user.types";
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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPageError, setIsPageError] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [appSettings, setAppSettings] = useState<AppConfig | null>(null);
  const [timezonesOptions, setTimezonesOptions] = useState<Timezone[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");

  useEffect(() => {
    setShouldShowConfirmation(unsavedChanges);
  }, [unsavedChanges]);

  const getProfile = async () => {
    const admin = await fetchProfile();

    setImage(admin.profile_img);
    setProfile({
      id: admin.user_id,
      fullName: admin.display_name,
      email: admin.email,
      imageSrc: admin.profile_img,
    });
  };

  const getAppConfig = async () => {
    const { timezone, ...appConfig } = await fetchAppConfig();
    const timezones = await fetchTimezones();

    setAppSettings(appConfig);
    setSelectedTimezone(timezone !== null ? timezone : timezones[0].key);
    setTimezonesOptions(timezones);
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

  const onUploadPP = () => {
    //upload image, get url
    //directly update admin pp with url
    setIsRevalidated(false);

    setIsUploading(true);
    setImage("https://i.pravatar.cc/150?u=a04258114e29026708c");
    saveImageToAdmin(
      t,
      setIsRevalidated,
      profile!,
      setIsUploading,
      "https://i.pravatar.cc/150?u=a04258114e29026708c",
    );

    setTimeout(() => {
      setIsUploading(false);
    }, 3000);
  };

  const onDeletePP = () => {
    setIsRevalidated(false);
    setImage(null);

    //modal question

    saveImageToAdmin(t, setIsRevalidated, profile!, setIsUploading);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    const { success } = await saveAllSettings(formData, setIsSaveLoading, t);
    if (success) {
      handleUnsavedChanges(false);
    }
  };

  return (
    <Layout title={t("title")} classNames={{ body: "px-6" }}>
      {isPageLoading && (
        <div className={`flex w-full absolute left-0 items-center justify-center ${isPageError ? "top-20" : "bottom-0 h-screen"}`}>
          <Spinner />
        </div>
      )}
      {isPageError && (
        <Error message={t("page-error-message")} onReset={getProfileAndAppConfig} />
      )}
      {!isPageLoading && !isPageError && (
        <Form
          id="profile"
          onSubmit={onSubmit}
          className="gap-3 md:gap-5 px-0 sm:px-12 md:px-0 lg:px-[14%] xl:px-[20%] md:pt-4"
        >
          <div className="flex flex-col w-full gap-10">
            <div className="flex flex-col w-full items-center gap-6">
              <Skeleton isLoaded={!isUploading} className="rounded-full">
                <Avatar
                  className="w-24 h-24 md:w-32 md:h-32 text-small"
                  src={image ?? ""}
                  fallback={
                    <UserIcon className="size-8 md:size-9 text-white" />
                  }
                />
              </Skeleton>
              <div className="flex flex-row gap-3">
                <Button
                  color="primary"
                  onPress={onUploadPP}
                  isDisabled={isUploading}
                  className="text-white"
                  size="sm"
                  startContent={<CameraIcon className="size-4 md:size-5" />}
                >
                  {t("profile-picture-upload-text")}
                </Button>
                <Button
                  onPress={onDeletePP}
                  size="sm"
                  color="danger"
                  variant="bordered"
                  isDisabled={!image || isUploading}
                  startContent={<TrashIcon className="size-4 md:size-5" />}
                >
                  {t("profile-picture-delete-text")}
                </Button>
              </div>
            </div>
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
              id="react-aria-:R1dcvfal7:"
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
              {({ key }) => (
                <SelectItem key={key} className="outline-none">
                  {t(`timezone-label-${key}-label`)}
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
    </Layout>
  );
}

SettingsPage.displayName = "SettingsPage";
