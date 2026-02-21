"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/app/components/survey/SurveyProvider";
import { SurveyShell, Pill, PrimaryButton, SecondaryButton } from "@/app/components/survey/SurveyShell";

export default function SurveyStep3() {
  const router = useRouter();
  const { answers, setAnswers } = useSurvey();

  return (
    <SurveyShell
      title="Survey → Job Match"
      subtitle="Step 3: Your constraints help us avoid bad-fit recommendations."
      step={3}
      total={4}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e]">
            Minimum acceptable wage (hourly)
          </p>
          <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">
            Current: ${answers.constraints.minWage}/hr
          </p>
          <input
            type="range"
            min={12}
            max={45}
            step={1}
            value={answers.constraints.minWage}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                constraints: { ...prev.constraints, minWage: Number(e.target.value) }
              }))
            }
            className="mt-4 w-full"
          />
          <div className="mt-2 flex justify-between font-['Space_Mono',sans-serif] text-[12px] text-[#5b5b5b]">
            <span>$12</span>
            <span>$45</span>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e]">Work location</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["no-pref", "remote", "hybrid", "onsite"] as const).map((v) => (
              <Pill
                key={v}
                active={answers.constraints.remote === v}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    constraints: { ...prev.constraints, remote: v }
                  }))
                }
              >
                {v === "no-pref" ? "No preference" : v}
              </Pill>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e]">Training budget</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["0-250", "250-1000", "1000-3000", "3000+"] as const).map((v) => (
              <Pill
                key={v}
                active={answers.constraints.trainingBudget === v}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    constraints: { ...prev.constraints, trainingBudget: v }
                  }))
                }
              >
                {v === "3000+" ? "$3000+" : `$${v.replace("-", "–")}`}
              </Pill>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e]">Years since last job</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["0-1", "1-3", "3-5", "5+"] as const).map((v) => (
              <Pill
                key={v}
                active={answers.constraints.experience === v}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    constraints: { ...prev.constraints, experience: v }
                  }))
                }
              >
                {v} yrs
              </Pill>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e]">Your location</p>
          <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">
            City + state or zip code
          </p>
          <input
            type="text"
            placeholder="e.g. Chicago, IL or 60601"
            value={answers.constraints.location}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                constraints: { ...prev.constraints, location: e.target.value }
              }))
            }
            className="mt-3 w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e] placeholder:text-[#9b9b9b] focus:outline-none focus:border-black/40"
          />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e]">Search radius</p>
          <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">
            How far are you willing to commute?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {([10, 25, 50, 0] as const).map((v) => (
              <Pill
                key={v}
                active={answers.constraints.radiusMiles === v}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    constraints: { ...prev.constraints, radiusMiles: v }
                  }))
                }
              >
                {v === 0 ? "Anywhere" : `${v} mi`}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <SecondaryButton onClick={() => router.push("step-2")}>Back</SecondaryButton>
        <PrimaryButton onClick={() => router.push("results")}>See results</PrimaryButton>
      </div>
    </SurveyShell>
  );
}