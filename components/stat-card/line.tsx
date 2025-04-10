"use client";

import {
  ChartDataTypes,
  ChartShallowDataShape,
  LineChart,
  LineSeries,
  SparklineChart,
} from "reaviz";

interface LineProps {
  series: ChartShallowDataShape<
    ChartDataTypes | [ChartDataTypes, ChartDataTypes]
  >[];
  id: string;
}

export const Line = ({ series, id }: LineProps) => {
  console.log(series, "sek");
  return (
    <div>
      <LineChart
        id={id}
        data={series}
        width={550}
        height={250}
        series={
          <LineSeries
            type="grouped"
            line={<Line strokeWidth={4} />}
            colorScheme="cybertron"
          />
        }
      />
    </div>
  );
};

Line.displayName = "Line";
