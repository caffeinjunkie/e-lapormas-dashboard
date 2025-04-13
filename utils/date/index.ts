import { useFormatter } from "next-intl";

const formatLocaleDate = (
  date: string,
  format: "short" | "long" | "long-relative" = "short",
) => {
  const formatter = useFormatter();
  const dateTime = new Date(date);

  if (format === "long") {
    return formatter.dateTime(dateTime, {
      dateStyle: "long",
      timeStyle: "short",
    });
  }

  const today = new Date();

  const diffInDays = getDiffInDays(date);

  if (diffInDays < 8) {
    return formatter.relativeTime(dateTime, today);
  }

  const getDateStyle = () => {
    if (format === "long-relative") {
      return {
        dateStyle: "long",
        timeStyle: "short",
      };
    }
    return {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  };

  const dateFormat = getDateStyle();

  return formatter.dateTime(dateTime, dateFormat as any);
};

const formatMonthYearDate = (
  formatter: any,
  date: string,
  monthOnly: boolean = false,
) => {
  const dateTime = new Date(date);

  if (monthOnly) {
    return formatter.dateTime(dateTime, {
      month: "short",
    });
  }

  return formatter.dateTime(dateTime, {
    year: "numeric",
    month: "short",
  });
};

const getDiffInDays = (date: string) => {
  const today = new Date();
  const dateTime = new Date(date);
  return Math.floor(
    (today.getTime() - dateTime.getTime()) / (1000 * 60 * 60 * 24),
  );
};

export { formatLocaleDate, getDiffInDays, formatMonthYearDate };
