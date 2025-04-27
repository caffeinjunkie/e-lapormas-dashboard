import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { AnnouncementCard } from "./announcement-card";
import { announcements } from "./mock-data";

import { Layout } from "@/components/layout";
import { subtitle } from "@/components/primitives";

export default function AnnouncementsPage() {
  const t = useTranslations("AnnouncementsPage");
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
            startContent={
              <div className="border-2 rounded-lg">
                <PlusIcon
                  className="w-4 h-4"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </div>
            }
            className="text-white w-full md:w-fit"
          >
            {t("add-announcement")}
          </Button>
        </div>
      }
    >
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} item={announcement} />
      ))}
    </Layout>
  );
}

AnnouncementsPage.displayName = "AnnouncementsPage";
