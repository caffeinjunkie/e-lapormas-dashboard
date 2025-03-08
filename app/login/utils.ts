import { FormEvent } from "react";

const validateIsRequired = (value: string, label: string) => {
  if (!value) {
    return `Mohon masukkan ${label} anda.`;
  }

  return null;
};

const validateEmail = (value: string) => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return "Email tidak sesuai format.";
  }

  return null;
};

const validateCreatePassword = (value: string) => {
  if (value.length < 6) {
    return "Kata sandi harus memiliki minimal 6 karakter.";
  }

  const regex =
    /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  if (!regex.test(value)) {
    return "Kata sandi harus mengandung huruf besar, huruf kecil, angka, dan simbol.";
  }

  return null;
};

const validateConfirmPassword = (value: string, password: string) => {
  if (value !== password) {
    return "Kata sandi tidak cocok.";
  }

  return null;
};

const buildFormData = (event: FormEvent<HTMLFormElement>) => {
  let data = new FormData();

  Object.entries(event.currentTarget).forEach(([_, formItem]) => {
    if (formItem.localName === "input") {
      data.append(formItem.name, formItem.value);
    }
  });

  return data;
};

const translateLoginErrorMessage = (message: string) => {
  switch (message) {
    case "Email not confirmed":
      return "Email belum terverifikasi. Silakan verifikasi email Anda.";
    case "Invalid login credentials":
      return "Email atau password salah, mohon masukkan kembali email dan password yang benar.";
    default:
      return "Terjadi kesalahan. Mohon coba sesaat lagi.";
  }
};

const translateRegisterErrorMessage = (message: string, value?: string) => {
  switch (message) {
    case `Email address "${value}" is invalid`:
      return `Email "${value}" tidak valid.`;
    default:
      return "Terjadi kesalahan. Mohon coba sesaat lagi.";
  }
};

export {
  buildFormData,
  translateRegisterErrorMessage,
  translateLoginErrorMessage,
  validateIsRequired,
  validateEmail,
  validateCreatePassword,
  validateConfirmPassword,
};
