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
      <div className="relative">
        {/* Fixed background for all survey pages */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: "url('/surveybackground.png')" }}
        />

        {/* Everything (including footer) naturally sits on top */}
        <div className="relative z-0 bg-transparent">{children}</div>
     </div>
    </SurveyProvider>
  );
}