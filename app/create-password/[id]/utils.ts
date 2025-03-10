const translateCreatePasswordErrorMessage = (message: string) => {
  switch (message) {
    case "New password should be different from the old password.":
      return "Kata sandi baru harus berbeda dari kata sandi lama.";
    default:
      return "Terjadi kesalahan. Mohon coba sesaat lagi.";
  }
};

export { translateCreatePasswordErrorMessage };
