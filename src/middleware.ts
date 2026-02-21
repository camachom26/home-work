import createMiddleware from "next-intl/middleware";
import {locales, defaultLocale} from "@/i18n/routing";

export default createMiddleware({
    locales: ["en", "es"],
    defaultLocale: "en"
});

export const config = {
  // Skip Next.js internals and files
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};