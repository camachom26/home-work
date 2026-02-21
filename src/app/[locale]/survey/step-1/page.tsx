"use client";

import { useRouter } from "next/navigation";
import { useSurvey, type SkillId } from "@/app/components/survey/SurveyProvider";
import { SurveyShell, Pill, PrimaryButton, SecondaryButton } from "@/app/components/survey/SurveyShell";

const SKILLS: { id: SkillId; label: string }[] = [
  { id: "budgeting", label: "Budgeting & money tracking" },
  { id: "scheduling", label: "Scheduling & coordination" },
  { id: "communication", label: "Communication & follow-up" },
  { id: "organization", label: "Organization & systems" },
  { id: "teaching", label: "Teaching / explaining to others" },
  { id: "customerService", label: "Customer service / people skills" },
  { id: "techComfort", label: "Comfort with computers & apps" },
  { id: "writing", label: "Writing / documentation" },
  { id: "attentionToDetail", label: "Attention to detail" },
  { id: "caretaking", label: "Care / support roles" }
];

export default function SurveyStep1() {
  const router = useRouter();
  const { answers, toggleSkill } = useSurvey();

  return (
    <SurveyShell
      title="Survey → Job Match"
      subtitle="Step 1: Select the things you’ve done regularly."
      step={1}
      total={4}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {SKILLS.map((s) => (
          <Pill key={s.id} active={answers.skills.includes(s.id)} onClick={() => toggleSkill(s.id)}>
            {s.label}
          </Pill>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <SecondaryButton onClick={() => router.push("../../landing")}>Back</SecondaryButton>
        <PrimaryButton onClick={() => router.push("step-2")}>Next</PrimaryButton>
      </div>
    </SurveyShell>
  );
}