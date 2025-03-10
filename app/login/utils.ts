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

export { translateRegisterErrorMessage, translateLoginErrorMessage };
