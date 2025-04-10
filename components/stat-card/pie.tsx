"use client";

import { styled } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { useTranslations } from "next-intl";

import { Legends } from "./legends";

interface PieProps {
  width?: number;
  height?: number;
  data: any[];
}

export const Pie = ({ data, width = 160, height = 160 }: PieProps) => {
  const t = useTranslations("StatCard");
  const total =
    data?.reduce((acc, curr) => Number(acc) + Number(curr.value), 0) ?? 0;

  if (!data || data.length === 0)
    return <p className="text-center text-gray-500">{t("empty-text")}</p>;

  return (
    <>
      <PieChart
        margin={{ top: 12, bottom: 12, left: 12, right: 12 }}
        series={[
          {
            data: data,
            innerRadius: 40,
            outerRadius: 60,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -90,
            endAngle: 270,
          },
        ]}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
        width={width}
        height={height}
      >
        <PieCenterLabel>{total}</PieCenterLabel>
      </PieChart>
      <Legends data={data} size="sm" />
    </>
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
