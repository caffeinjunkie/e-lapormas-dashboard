import { Progress } from "@/types/report.types";

export const checkUpdatedProgressToday = (progress: Progress[]) => {
  if (progress.length > 2) {
    const thirdLastProgress = progress[progress.length - 3].updated_at;

    const diffInDays = Math.floor(
      (new Date().getTime() - new Date(thirdLastProgress).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diffInDays === 0;
  }
  return false;
};
