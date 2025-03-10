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

const validatePassword = (value: string) => {
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

export {
  validateIsRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
