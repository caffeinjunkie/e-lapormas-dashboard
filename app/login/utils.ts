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

//change images to another BE
const loginImages = [
  "https://chnpxcvhzxlwdaqhbhqp.supabase.co/storage/v1/object/sign/photos/Firefly%20generate%20image%20on%20indonesian%20landscape%200%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvRmlyZWZseSBnZW5lcmF0ZSBpbWFnZSBvbiBpbmRvbmVzaWFuIGxhbmRzY2FwZSAwICgxKS5qcGciLCJpYXQiOjE3NDE1NTY3ODEsImV4cCI6MTc3MzA5Mjc4MX0.qhnoBn_tkUXCxwgkKOIlhtnwCxCvggaNtcKLuI8PbvA",
];

export {
  translateRegisterErrorMessage,
  translateLoginErrorMessage,
  loginImages,
};
