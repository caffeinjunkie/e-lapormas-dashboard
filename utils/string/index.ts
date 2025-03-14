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

export {
  validateIsRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
