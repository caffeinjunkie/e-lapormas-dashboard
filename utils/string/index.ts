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

const getMoreOrLessKey = (value1: number, value2: number) => {
  if (value1 === value2) return "value-equal-text";
  if (value1 > value2) return "value-more-text";
  return "value-less-text";
};

const getPercentageDifference = (value1: number, value2: number) => {
  if (value2 === 0) return "100";
  const percentage = ((value1 - value2) / value2) * 100;
  return percentage.toFixed(1).replace(/\.0$/, "");
};

export {
  getByteSize,
  getMoreOrLessKey,
  getPercentageDifference,
  minifyNumber,
  generatePassword,
  validateIsRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
