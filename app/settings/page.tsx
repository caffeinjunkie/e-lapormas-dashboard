"use client";

import { Form } from "@heroui/form";
import { Select, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";
import { Tab, Tabs } from "@heroui/tabs";
import { useTranslations } from "next-intl";
import { ReactEventHandler, useState } from "react";

import { Input } from "@/components/input";
import { Layout } from "@/components/layout";

enum SettingsTabEnum {
  PROFILE = "profile",
  APP_SETTINGS = "app-settings",
}

export default function SettingsPage() {
  const t = useTranslations("SettingsPage");
  const [tab, setTab] = useState<SettingsTabEnum>(SettingsTabEnum.APP_SETTINGS);
  //TODO: fetch from settings
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");

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
    console.log(Array.from(keys)[0]);
    setSelectedTimezone(Array.from(keys)[0] as string);
  };

  return (
    <Layout title={t("settings-title")} classNames={{ body: "px-6" }}>
      <Tabs
        size="md"
        aria-label="Settings tabs"
        selectedKey={tab}
        variant="underlined"
        classNames={{
          tabList: "p-0",
          tab: "px-1 pb-2",
          cursor: "w-[95%]",
          base: "mb-6",
        }}
        className="font-semibold flex w-full justify-center md:justify-start"
        onSelectionChange={(key) => setTab(key as SettingsTabEnum)}
      >
        <Tab key={SettingsTabEnum.PROFILE} title={t("profile-tab-title")}></Tab>
        <Tab
          key={SettingsTabEnum.APP_SETTINGS}
          title={t("app-settings-tab-title")}
        >
          <Form>
            <div className="flex w-full gap-4 flex-col sm:flex-row items-center justify-center">
              <Input
                aria-label="org. name"
                label={t("app-settings-org-input-label")}
                type="text"
                radius="lg"
                name="org-name"
                placeholder={t("app-settings-org-placeholder-text")}
              />
              <Select
                id="react-aria-:R1dcvfal7:"
                className="w-full lg:w-[80%]"
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
          </Form>
        </Tab>
      </Tabs>
    </Layout>
  );
}

SettingsPage.displayName = "SettingsPage";
