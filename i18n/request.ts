import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // TODO: for future use
  // Provide fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = "id";

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
