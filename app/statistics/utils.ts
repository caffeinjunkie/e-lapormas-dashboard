import { MainMetrics } from "@/types/statistics.types";

export const getAllTimeData = (data: MainMetrics[]) => {
  const averagedData = data.reduce(
    (acc, curr, index, array) => {
      acc.total_new_tasks += curr.total_new_tasks;
      acc.total_finished_tasks += curr.total_finished_tasks;
      acc.current_in_progress_tasks += curr.current_in_progress_tasks;
      acc.current_pending_tasks += curr.current_pending_tasks;
      acc.current_completed_tasks += curr.current_completed_tasks;
      acc.user_satisfactions += curr.user_satisfactions;

      if (index === array.length - 1) {
        const count = array.length;
        acc.total_new_tasks = Number(
          (acc.total_new_tasks / count).toFixed(1).replace(".0", ""),
        );
        acc.total_finished_tasks = Number(
          (acc.total_finished_tasks / count).toFixed(1).replace(".0", ""),
        );
        acc.user_satisfactions = Number(
          (acc.user_satisfactions / count).toFixed(1).replace(".0", ""),
        );
        acc.month_year = "all-time";
      }

      return acc;
    },
    {
      month_year: "",
      total_new_tasks: 0,
      total_finished_tasks: 0,
      current_in_progress_tasks: 0,
      current_pending_tasks: 0,
      current_completed_tasks: 0,
      user_satisfactions: 0,
    },
  );
  return averagedData;
};
