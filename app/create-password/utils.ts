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

export { getCreatePasswordErrorMessage, getTokenErrorMessage };
