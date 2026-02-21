import type { ReactNode } from "react";
import SurveyAuthGuard from "@/app/components/survey/SurveyAuthGuard";

export default function SurveyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Fixed background for all survey pages */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/surveybackground.png')" }}
      />

      {/* Auth guard — shows sign-in popup if not signed in */}
      <SurveyAuthGuard>
        <div className="relative z-0 bg-transparent">{children}</div>
      </SurveyAuthGuard>
    </div>
  );
}