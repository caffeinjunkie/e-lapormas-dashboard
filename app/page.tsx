"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { swrConfig } from "./config";

import { fetchAdmins } from "@/api/admin";
import { TrophyIcon } from "@/components/icons";
import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";
import { StatCard } from "@/components/stat-card";
import { UserAva } from "@/components/user-ava";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");

  const {
    data: adminsData,
    error: adminsError,
    isLoading: isAdminsLoading,
    mutate: mutateAdmins,
  } = useSWR(["admins"], () => fetchAdmins(), swrConfig);
  console.log(adminsData);

  return (
    <Layout
      title={t("title")}
      classNames={{
        body: "flex flex-col gap-2 px-4 sm:px-6",
      }}
    >
      <div className="w-full flex flex-col lg:flex-row gap2">
        <StatCard
          classNames={{
            root: "min-h-24 lg:min-h-64",
            header: "px-4",
            body: "flex items-center justify-center px-4 pt-2",
          }}
          header={
            <p className={clsx(title({ className: "text-sm w-full" }))}>
              {t("admin-leaderboards-title")}
            </p>
          }
        >
          <div className="flex flex-col h-full w-full gap-2">
            {adminsData?.map((admin, index) => (
              <div
                key={admin.user_id}
                className={clsx(
                  "flex items-center justify-between gap-8 rounded-2xl px-2",
                  index === 0 && "bg-danger text-white py-2",
                )}
              >
                <div className="text-left flex flex-row gap-1 items-center">
                  <TrophyIcon
                    height={24}
                    width={24}
                    className={index === 0 ? "" : "hidden"}
                  />
                  {index !== 0 && (
                    <span className="text-sm text-center font-semibold w-[24px]">
                      {index + 1}
                    </span>
                  )}
                  <div className="flex flex-col flex-1 max-w-full">
                    <p className="line-clamp-1 font-semibold text-sm">
                      {admin.display_name || "-"}
                    </p>
                    <p className="text-xs">{admin.email}</p>
                  </div>
                </div>
                <p className="font-semibold text-right text-sm">
                  {admin.rating}
                </p>
              </div>
            ))}
          </div>
        </StatCard>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2">
          <div>ajs</div>
          <div>ajk</div>
        </div>
      </div>
    </Layout>
  );
}

DashboardPage.displayName = "DashboardPage";
