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
  getProfile,
  handleSendResetPasswordRequest,
  saveAllSettings,
  saveImageToAdmin,
} from "./handlers";

import { FloppyIcon } from "@/components/icons";
import { Input } from "@/components/input";
import { Layout } from "@/components/layout";
import { ProfileData } from "@/types/user.types";
import { buildFormData } from "@/utils/form";
import { validateIsRequired } from "@/utils/string";

export default function SettingsPage() {
  const t = useTranslations("SettingsPage");
  //TODO: fetch from settings
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isResetLoading, setIsResetLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPageError, setIsPageError] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const fetchProfile = async () => {
    setIsPageLoading(true);
    try {
      const admin = await getProfile();

      setImage(admin.profile_img);

      setProfile({
        id: admin.user_id,
        fullName: admin.display_name,
        email: admin.email,
        imageSrc: admin.profile_img,
      });
    } catch (e) {
      // page error needs refresh
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // TODO: use db later
  const timezones = [
    {
      id: 1,
      zone: "Asia/Jakarta",
      key: "wib",
      utc: 7,
    },
    {
      id: 2,
      zone: "Asia/Makassar",
      key: "wita",
      utc: 8,
    },
    {
      id: 3,
      zone: "Asia/Jayapura",
      key: "wit",
      utc: 9,
    },
  ];

  const onTimezoneSelect = (keys: SharedSelection) => {
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

    setIsUploading(true);
    setImage("https://i.pravatar.cc/150?u=a04258114e29026708c");
    saveImageToAdmin(
      t,
      profile!,
      setIsUploading,
      "https://i.pravatar.cc/150?u=a04258114e29026708c",
    );

    setTimeout(() => {
      setIsUploading(false);
    }, 3000);
  };

  const onDeletePP = () => {
    setImage(null);

    //modal question

    saveImageToAdmin(t, profile!, setIsUploading);
  };

  const onSaveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUnsavedChanges(false);
    const formData = buildFormData(e);

    saveAllSettings(formData, setIsSaveLoading);
  };

  return (
    <Layout title={t("title")} classNames={{ body: "px-6" }}>
      {isPageLoading && (
        <div className="flex w-full absolute bottom-0 left-0 h-screen items-center justify-center">
          <Spinner />
        </div>
      )}
      {isPageError && (
        <div className="flex w-full absolute bottom-0 left-0 h-screen items-center justify-center">
          error
        </div>
      )}
      {!isPageLoading && !isPageError && (
        <Form
          id="profile"
          onSubmit={onSaveProfile}
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
                onChange={() => setUnsavedChanges(true)}
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
                onChange={() => setUnsavedChanges(true)}
                defaultValue=""
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
              value={selectedTimezone}
              items={timezones}
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
