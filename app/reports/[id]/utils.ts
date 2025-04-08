import { Progress } from "@/types/report.types";
import { getDiffInDays } from "@/utils/date";

export const checkUpdatedProgressToday = (progress: Progress[]) => {
  if (progress.length > 2) {
    const thirdLastProgress = progress[progress.length - 3].updated_at;

    const diffInDays = getDiffInDays(thirdLastProgress);
    return diffInDays === 0;
  }
  return false;
};
