// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { JobPathsProvider } from "@/app/components/survey/JobPathsProvider";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JobPathsProvider>
        <div className="min-h-screen w-full bg-white">
          <Navigation locale={locale} />
          {children}
          <Footer />
        </div>
      </JobPathsProvider>
    </NextIntlClientProvider>
  );
}