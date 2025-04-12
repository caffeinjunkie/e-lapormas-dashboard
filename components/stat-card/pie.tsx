"use client";

import { styled } from "@mui/material/styles";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Legends } from "./legends";

interface PieProps {
  width?: number;
  height?: number;
  withLegend?: boolean;
  withCenterLabel?: boolean;
  data: any[];
  limit?: number;
  content?: React.ReactNode;
  contentPosition?: "top" | "bottom";
  type?: "full-donut" | "sliced-donut";
}

export const Pie = ({
  data,
  width = 160,
  height = 160,
  withLegend = false,
  content,
  contentPosition = "bottom",
  withCenterLabel = false,
  limit = 7,
  type = "full-donut",
}: PieProps) => {
  const t = useTranslations("StatCard");
  const total =
    data?.reduce((acc, curr) => Number(acc) + Number(curr.value), 0) ?? 0;

  if (!data || data.length === 0)
    return <p className="text-center text-gray-500">{t("empty-text")}</p>;

  const droppedData = data.slice(0, data.length - limit);
  const slicedData = data.length > limit ? data.slice(-limit) : data;
  const droppedDataSum = droppedData.reduce((acc, curr) => acc + curr.value, 0);
  const pieData = [
    ...slicedData,
    data.length > limit
      ? { id: "other", label: t("other-text"), value: droppedDataSum }
      : {},
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {content && contentPosition === "top" && (
        <div className={clsx("flex items-center justify-center")}>
          {content}
        </div>
      )}
      <PieChart
        margin={{ top: 12, bottom: 12, left: 12, right: 12 }}
        series={[
          {
            data: pieData,
            innerRadius: type === "sliced-donut" ? 40 : 0,
            outerRadius: type === "sliced-donut" ? 70 : 75,
            paddingAngle: type === "sliced-donut" ? 2 : 0,
            cornerRadius: type === "sliced-donut" ? 5 : 0,
            startAngle: -90,
            endAngle: 270,
            arcLabel: (item) => `${((item.value / total) * 100).toFixed(0)}%`,
            arcLabelMinAngle: 35,
            arcLabelRadius: "80%",
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: "bold",
            fontSize: "11px",
          },
        }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
        width={width}
        height={height}
      >
        {withCenterLabel && <PieCenterLabel>{total}</PieCenterLabel>}
      </PieChart>
      {content && contentPosition === "bottom" && (
        <div className={clsx("flex items-center pt-4 text-sm justify-center")}>
          {content}
        </div>
      )}
      {withLegend && <Legends data={data} size="sm" />}
    </div>
  );
};

Pie.displayName = "Pie";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 24,
  fontWeight: 700,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children || 0}
    </StyledText>
  );
}
