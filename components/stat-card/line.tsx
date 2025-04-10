"use client";

import { LineChart } from "@mui/x-charts";

import { Legends } from "./legends";
import { useTranslations } from "next-intl";

interface LineProps {
  data: { id: string; color: string; label: string; data: number[] }[];
  height?: number;
  labels?: string[];
  isEmpty?: boolean;
}

export const Line = ({ data, height = 260, labels, isEmpty }: LineProps) => {
  const t = useTranslations("StatCard");

  if (isEmpty) {
    return (
      <div className="w-full flex flex-col justify-center min-h-32 gap-4 pb-2">
        <p className="text-center text-gray-500">{t("line-empty-text")}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 pb-2">
      <LineChart
        xAxis={[{ scaleType: "point", data: labels }]}
        series={data.map((item) => ({
          curve: "natural",
          id: item.id,
          label: item.label,
          color: item.color,
          data: item.data,
        }))}
        margin={{ bottom: 24 }}
        className="mt-[-20px]"
        height={height}
        slotProps={{
          legend: {
            hidden: true,
            direction: "row",
            itemMarkHeight: 8,
            classes: { mark: "rounded-full" },
            itemMarkWidth: 8,
            position: { vertical: "bottom", horizontal: "middle" },
            padding: 0,
          },
        }}
      />
      <Legends size="lg" data={data} />
    </div>
  );
};

Line.displayName = "Line";
