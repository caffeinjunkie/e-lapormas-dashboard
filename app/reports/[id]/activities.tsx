import { Report } from "@/types/report.types";

interface ActivitiesProps {
  data: Report["progress"];
}

export const Activities = ({ data }: ActivitiesProps) => {
  return (
    <div className="flex flex-col gap-1">
      {data?.map((activity, index) => (
        <div key={index} className="flex flex-col gap-1">
          <p className="text-xs font-bold text-default-500">
            {activity.message}
          </p>
          <p className="text-xs text-default-700">{activity.updated_by}</p>
        </div>
      ))}
    </div>
  );
};
