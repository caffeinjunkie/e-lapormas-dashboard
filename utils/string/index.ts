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

const formatLocaleDate = (date: string) => {
  const format = useFormatter();
  
  const dateTime = new Date(date);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const diffInDays = Math.floor((today.getTime() - dateTime.getTime()) / (1000 * 60 * 60 * 24)); // Difference in days
  switch (diffInDays) {
    case 0:
      return "Today"; // If the date is today
    case 1:
      return "Yesterday"; // If the date is yesterday
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return `${diffInDays} days ago`;
    case 7:
      return "Last week";
    
  }
  return format.dateTime(dateTime, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // return "jancok"

};

export {
  formatLocaleDate,
  generatePassword,
  validateIsRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
