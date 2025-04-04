import { Progress } from "@/types/report.types";

export const checkUpdatedProgressToday = (progress: Progress[]) => {
  if (progress.length > 1) {
    const secondLastProgress = progress[progress.length - 2].updated_at;

    const diffInDays = Math.floor(
      (new Date().getTime() - new Date(secondLastProgress).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diffInDays === 0;
  }
  return false;
};
