"use client";

import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import {
  subtitle as subtitlePrimitive,
  title as titlePrimitive,
} from "@/components/primitives";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  content?: React.ReactNode;
}

export const SectionHeader = ({
  title,
  subtitle,
  content,
}: SectionHeaderProps) => {
  const t = useTranslations("StatisticsPage");
  return (
    <div className="flex flex-row items-start justify-between lg:min-h-16">
      <div className="flex flex-col">
        <p className={clsx(titlePrimitive({ className: "text-md" }))}>
          {title}
        </p>
        <p className={clsx(subtitlePrimitive({ className: "text-sm" }))}>
          {subtitle}
        </p>
      </div>
      {content}
    </div>
  );
};
