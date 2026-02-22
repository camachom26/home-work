// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { JobPathsProvider } from "@/app/components/survey/JobPathsProvider";
import { SurveyProvider } from "@/app/components/survey/SurveyProvider";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale: rawLocale } = await params;


  const locale: Locale = rawLocale === "es" ? "es" : "en";

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SurveyProvider>
        <JobPathsProvider>
          <div className="min-h-screen w-full bg-transparent flex flex-col">
            <Navigation locale={locale} />

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </JobPathsProvider>
      </SurveyProvider>
    </NextIntlClientProvider>
  );
}