"use client";

import { BarChart } from "@mui/x-charts";
import { useTranslations } from "next-intl";

import { Legends } from "./legends";

interface BarProps {
  isEmpty?: boolean;
  height?: number;
  data?: { id: string; color: string; label: string; data: number[] }[];
  labels?: string[];
  stack?: string;
  withLegend?: boolean;
}

export const Bar = ({
  isEmpty,
  height = 250,
  data,
  labels,
  stack = "total",
  withLegend = false,
}: BarProps) => {
  const t = useTranslations("StatCard");

  if (isEmpty) {
    return (
      <div className="w-full flex flex-col justify-center min-h-32 gap-4 pb-2">
        <p className="text-center text-gray-500">{t("empty-text")}</p>
      </div>
    );
  }
  return (
    <div className="w-full flex pb-2 flex-col gap-2">
      <BarChart
        yAxis={[{ scaleType: "band", data: labels }]}
        grid={{
          vertical: true,
        }}
        series={
          data?.map((item) => ({
            id: item.id,
            color: item.color,
            label: item.label,
            data: item.data,
            stack: stack,
          })) ?? []
        }
        layout="horizontal"
        margin={{ bottom: 24, left: 132, top: 24, right: 20 }}
        height={height}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      />
      {withLegend && (
        <Legends
          data={data as { id: string; color: string; label: string }[]}
          size="md"
        />
      )}
    </div>
  );
};

Bar.displayName = "Bar";
