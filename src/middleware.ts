import createMiddleware from "next-intl/middleware";
import {locales, defaultLocale} from "@/i18n/routing";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always" // URLs like /en/... and /es/...
});

export const config = {
  // Skip Next.js internals and files
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};