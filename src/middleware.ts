import { clerkMiddleware } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/routing";

const handleI18nRouting = createIntlMiddleware({
  locales,
  defaultLocale,
});

export default clerkMiddleware(async (_auth, req) => {
  // Only apply intl routing to non-API routes
  if (!req.nextUrl.pathname.startsWith("/api")) {
    return handleI18nRouting(req);
  }
});

export const config = {
  // Include API routes (so Clerk can read the session), exclude Next.js internals and static files
  matcher: ["/((?!_next|.*\\..*).*)"],
};
