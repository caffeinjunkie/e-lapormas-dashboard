const getCreatePasswordErrorMessage = (message: string) => {
  switch (message) {
    case "New password should be different from the old password.":
      return "new-old-same-password-error-message";
    default:
      return "default-error-message";
  }
};

const getTokenErrorMessage = (name: string) => {
  switch (name) {
    case "AuthApiError":
      return "invalid-token-error-message";
    default:
      return "default-error-message";
  }
};

function deleteAllCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });
}

export {
  getCreatePasswordErrorMessage,
  deleteAllCookies,
  getTokenErrorMessage,
};
