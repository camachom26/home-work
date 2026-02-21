import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { SurveyProvider } from "@/app/components/survey/SurveyProvider";

export default async function SurveyLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <SurveyProvider>
      <div className="min-h-screen w-full bg-white">
        {children}
        <Footer />
      </div>
    </SurveyProvider>
  );
}