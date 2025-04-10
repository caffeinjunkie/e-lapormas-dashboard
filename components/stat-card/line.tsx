"use client";

import { LineChart } from "@mui/x-charts";

import { Legends } from "./legends";

interface LineProps {
  data: { id: string; color: string; label: string; data: number[] }[];
  height?: number;
  labels?: string[];
}

export const Line = ({ data, height = 260, labels }: LineProps) => {
  return (
    <div className="w-full flex flex-col gap-4 pb-2">
      <LineChart
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
