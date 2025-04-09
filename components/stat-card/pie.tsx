"use client";

import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";
import {
  DiscreteLegend,
  DiscreteLegendEntry,
  PieArcLabel,
  PieArcSeries,
  PieChart,
  PieChartProps,
} from "reaviz";

interface PieProps extends PieChartProps {
  doughnut?: boolean;
  colorScheme?: string;
  data: any[];
}

export const Pie = ({
  id,
  data,
  width = 300,
  height = 200,
  doughnut = false,
}: PieProps) => {
  const t = useTranslations("StatCard");
  const total =
    data?.reduce((acc, curr) => Number(acc) + Number(curr.data), 0) ?? 0;
  const colors = data?.map((item) => item.color);

  return (
    <>
      {data?.length > 0 ? (
        <>
          <PieChart
            id={id}
            width={width}
            height={height}
            displayAllLabels={false}
            data={data}
            series={
              <PieArcSeries
                label={
                  <PieArcLabel
                    format={(value) =>
                      `${((value.data / total) * 100).toFixed(1).replace(".0", "")}%`
                    }
                  />
                }
                doughnut={doughnut}
                animated
                colorScheme={colors}
              />
            }
          />
          <div className="text-center">
            <div className="inline-flex flex-wrap justify-center gap-2">
              {data?.map((item) => (
                <div key={item.key} className="inline-flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-[10px] whitespace-nowrap">{item.key}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">{t("empty-text")}</p>
      )}
    </>
  );
};

Pie.displayName = "Pie";
