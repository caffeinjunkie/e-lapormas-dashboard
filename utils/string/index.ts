import { useFormatter } from "next-intl";

const validateIsRequired = (
  t: (key: string) => string,
  value: string,
  label: string,
) => {
  if (!value) {
    return t(`required-${label}-error-message`);
  }

  return null;
};

const validateEmail = (t: (key: string) => string, value: string) => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return t("invalid-email-format-error-message");
  }

  return null;
};

const validatePassword = (t: (key: string) => string, value: string) => {
  if (value.length < 6) {
    return t("short-password-error-message");
  }

  const regex =
    /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  if (!regex.test(value)) {
    return t("invalid-password-error-message");
  }

  return null;
};

const validateConfirmPassword = (
  t: (key: string) => string,
  value: string,
  password: string,
) => {
  if (value !== password) {
    return t("mismatch-password-error-message");
  }

  return null;
};

function generatePassword(): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_-+=<>?";
  const allChars = uppercaseChars + lowercaseChars + numbers + symbols;

  let password = "";

  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length),
  );
  password += lowercaseChars.charAt(
    Math.floor(Math.random() * lowercaseChars.length),
  );
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  while (password.length < 6) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

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
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const diffInDays = Math.floor(
    (today.getTime() - dateTime.getTime()) / (1000 * 60 * 60 * 24),
  );
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

const getByteSize = (size: number) => {
  if (size < 500000) {
    return (size / 1024).toFixed(0) + "KB";
  }
  return (size / 1048576).toFixed(2) + "MB";
};

const minifyNumber = (value: number) => {
  if (value < 1000) return value.toString();
  const floored = Math.floor((value / 1000) * 10) / 10;
  return floored.toFixed(1).replace(/\.0$/, "") + "K";
};

export {
  getByteSize,
  minifyNumber,
  formatLocaleDate,
  generatePassword,
  validateIsRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
