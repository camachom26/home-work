"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/app/components/survey/SurveyProvider";
import { SurveyShell, Pill, PrimaryButton, SecondaryButton } from "@/app/components/survey/SurveyShell";

const INTERESTS = ["Healthcare","Education","Office/Admin","Tech","Creative","Outdoors","Nonprofit","Retail/Service","Logistics"];

export default function SurveyStep2() {
  const router = useRouter();
  const { answers, toggleInterest } = useSurvey();

  return (
    <SurveyShell
      title="Survey → Job Match"
      subtitle="Step 2: Choose a few areas you’re interested in."
      step={2}
      total={4}
    >
      <div className="flex flex-wrap gap-3">
        {INTERESTS.map((tag) => (
          <Pill key={tag} active={answers.interests.includes(tag)} onClick={() => toggleInterest(tag)}>
            {tag}
          </Pill>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <SecondaryButton onClick={() => router.push("step-1")}>Back</SecondaryButton>
        <PrimaryButton onClick={() => router.push("step-3")}>Next</PrimaryButton>
      </div>
    </SurveyShell>
  );
}