export type MainMetrics = {
  month_year: string;
  total_new_tasks: number;
  total_finished_tasks: number;
  current_in_progress_tasks: number;
  current_pending_tasks: number;
  current_completed_tasks: number;
  user_satisfactions: number;
};

export type LocationMetrics = {
  location: string;
  total_tasks: number;
  total_finished_tasks: number;
};

export type CategoryMetrics = {
  category: string;
  total_tasks: number;
  total_finished_tasks: number;
};
