"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import { BrokenImageIcon } from "@/components/icons";
import { Announcement } from "@/types/announcement.types";
import { formatNormalDate } from "@/utils/date";

interface AnnouncementCardProps {
  item: Announcement;
  onDeletePress: (id: string) => void;
  onEditPress: (id: string) => void;
}

export const AnnouncementCard = ({
  item,
  onDeletePress,
  onEditPress,
}: AnnouncementCardProps) => {
  const t = useTranslations("AnnouncementsPage");
  const [imgError, setImgError] = useState(false);
  const formattedPeriod = {
    startDate: formatNormalDate(item.start_date),
    endDate: formatNormalDate(item.end_date),
  };
  const now = new Date();
  const startDate = new Date(item.start_date);
  const endDate = new Date(item.end_date);
  startDate.setHours(0, 0, 0, 0);
  const link =
    item.url && item.url.startsWith("http") ? item.url : "https://" + item.url;

  return (
    <Card shadow="sm">
      <CardBody className="overflow-visible p-0">
        {!imgError && (
          <Image
            alt={item.title}
            src={item.img}
            radius="lg"
            width="100%"
            onError={() => setImgError(true)}
            className="w-full object-cover h-[140px]"
          />
        )}
        {imgError && (
          <div className="w-full h-[140px] flex items-center justify-center bg-default-100 rounded-2xl">
            <BrokenImageIcon
              className="w-20 h-20 text-default-400"
              strokeWidth={1}
            />
          </div>
        )}
      </CardBody>
      <CardFooter className="flex flex-col items-start justify-between h-full p-0">
        <div className="flex flex-col items-start py-2 px-4">
          <b>{item.title}</b>
          {item.url && (
            <Link
              href={link}
              target="_blank"
              className="text-sm text-primary"
              rel="noopener noreferrer"
            >
              {item.url}
            </Link>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 w-full justify-center">
          <p className="text-default-400 text-sm font-semibold text-center">
            {t("period-card-text")}
          </p>
          <p className="text-sm">{`${formattedPeriod.startDate} - ${formattedPeriod.endDate}`}</p>
          <div className="w-full flex flex-row">
            <Button
              radius="none"
              variant="ghost"
              color="primary"
              className="w-full border-none outline-none"
              onPress={() => onEditPress(item.id)}
              size="lg"
              isIconOnly
              startContent={<PencilSquareIcon className="w-5 h-5" />}
            />
            <Button
              radius="none"
              variant="ghost"
              className="w-full border-none outline-none"
              onPress={() => onDeletePress(item.id)}
              color="danger"
              size="lg"
              isIconOnly
              startContent={<TrashIcon className="w-5 h-5" />}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
