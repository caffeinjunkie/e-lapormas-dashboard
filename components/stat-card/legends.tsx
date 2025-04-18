import clsx from "clsx";

export type LegendType = {
  id: string;
  color: string;
  label: string;
  value?: number;
};

interface LegendsProps {
  data: LegendType[];
  size?: "sm" | "md" | "lg" | "xl";
}

export const Legends = ({ data, size = "md" }: LegendsProps) => {
  const sizeClass = {
    sm: "text-xs lg:text-[11px]",
    md: "text-xs lg:text-[12px]",
    lg: "text-sm",
    xl: "text-base lg:text-[15px]",
  }[size];
  const markerClass = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
    xl: "w-3 h-3",
  }[size];

  return (
    <div className="text-center">
      <div className="inline-flex flex-wrap justify-center gap-2">
        {data?.map((item) => (
          <div key={item.id} className="inline-flex items-center gap-1">
            <div
              className={clsx("rounded-full flex-shrink-0", markerClass)}
              style={{ backgroundColor: item.color }}
            />
            <p className={sizeClass}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

Legends.displayName = "Legends";
