"use client";

import React, { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useJobPaths } from "@/app/components/survey/JobPathsProvider";
import { useSurvey } from "@/app/components/survey/SurveyProvider";

type Stat = { label: string; value: string; sub?: string };

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  title,
  subtitle,
  right,
  children
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-white/80 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)]">
      {(title || subtitle || right) && (
        <div className="p-6 md:p-8 border-b border-black/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && (
                <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(14px,1.6vw,22px)] leading-[1.2]">
                  {title}
                </p>
              )}
              {subtitle && (
                <p className="mt-3 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px] sm:text-[14px] leading-[1.6] max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            {right}
          </div>
        </div>
      )}
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-[22px] bg-white/70 border border-black/10 shadow-[0px_10px_25px_rgba(0,0,0,0.08)] p-5">
      <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{stat.label}</p>
      <p className="mt-2 font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[18px] leading-[1.2]">
        {stat.value}
      </p>
      {stat.sub && (
        <p className="mt-2 font-['Space_Mono',sans-serif] text-[#6b6b6b] text-[12px] leading-[1.5]">
          {stat.sub}
        </p>
      )}
    </div>
  );
}



function PrimaryButton({
  children,
  onClick,
  disabled
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full sm:w-auto rounded-full px-6 py-3 transition",
        "font-['Press_Start_2P',sans-serif] text-[12px]",
        disabled ? "bg-black/30 text-white cursor-not-allowed" : "bg-[#1e1e1e] hover:bg-black text-white"
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full sm:w-auto rounded-full border border-black/30 bg-white/70 hover:bg-white px-6 py-3 font-['Press_Start_2P',sans-serif] text-[12px] text-[#1e1e1e]"
    >
      {children}
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { chosenJobs, removeJobPath, savedResources, removeTrainingResource } = useJobPaths();
  const { answers } = useSurvey();

  const jobPathsRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef<HTMLDivElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const userName = "there";

  const trainingBudgetLabel: Record<string, string> = {
    "0-250": "$0 – $250",
    "250-1000": "$250 – $1,000",
    "1000-3000": "$1,000 – $3,000",
    "3000+": "$3,000+",
  };

  // Upper bound of each budget range (used for the progress bar)
  const trainingBudgetMax: Record<string, number> = {
    "0-250": 250,
    "250-1000": 1000,
    "1000-3000": 3000,
    "3000+": 3000,
  };

  // Parse cost strings like "~$100 exam fee", "Free to audit", "~$49/month" → number
  function parseCost(cost: string): number {
    if (/free|no cost/i.test(cost)) return 0;
    if (/varies/i.test(cost)) return 0;
    const match = cost.match(/\$(\d[\d,]*)/);
    if (match) return parseFloat(match[1].replace(/,/g, ""));
    return 0;
  }

  const totalTrainingCost = useMemo(
    () => savedResources.reduce((sum, r) => sum + parseCost(r.cost), 0),
    [savedResources]
  );

  const budgetMax = trainingBudgetMax[answers.constraints.trainingBudget] ?? 1000;
  const budgetPct = Math.min(totalTrainingCost / budgetMax, 1);
  const overBudget = totalTrainingCost > budgetMax;

  const stats: Stat[] = useMemo(
    () => [
      {
        label: "Minimum Wage",
        value: `$${answers.constraints.minWage}/hr`,
        sub: "Minimum acceptable hourly pay",
      },
      {
        label: "Training Budget",
        value: trainingBudgetLabel[answers.constraints.trainingBudget] ?? answers.constraints.trainingBudget,
        sub: "Budget set for upskilling & courses",
      },
    ],
    [answers.constraints.minWage, answers.constraints.trainingBudget]
  );

  return (
    <div
      className="w-full bg-fixed bg-[length:100%_auto] bg-top bg-no-repeat"
      style={{ backgroundImage: "url('/landing/hero.png')" }}
    >
      <div className="w-full bg-white/10">
        <header className="w-full">
          <div className="mx-auto max-w-6xl px-6 md:px-8 pt-10 md:pt-14 pb-4">
            <div className="rounded-[28px] bg-white/70 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.2vw,30px)] leading-[1.2]">
                    Dashboard
                  </p>
                  <p className="mt-4 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.6] max-w-3xl">
                    Welcome back{userName ? `, ${userName}` : ""}. Here&apos;s a clear view of your progress, budget, training, and job matches.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <SecondaryButton onClick={() => scrollTo(jobPathsRef)}>Job Paths</SecondaryButton>
                  <SecondaryButton onClick={() => scrollTo(trainingRef)}>Training</SecondaryButton>
                  <PrimaryButton onClick={() => scrollTo(snapshotRef)}>Budget</PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full">
          <div className="mx-auto max-w-6xl px-6 md:px-8 pt-2 md:pt-4 pb-10 md:pb-14 space-y-6">

            {/* Chosen Job Paths */}
            <div ref={jobPathsRef}>
              <Card
                title="Chosen Job Paths"
                subtitle="Jobs you've saved from your survey results. Use these as your targets."
                right={
                  <SecondaryButton onClick={() => router.push("survey/step-1")}>
                    Retake survey
                  </SecondaryButton>
                }
              >
                {chosenJobs.length === 0 ? (
                  <div className="rounded-[22px] bg-white/70 border border-black/10 p-6 text-center">
                    <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.6]">
                      No job paths chosen yet.
                    </p>
                    <p className="mt-2 font-['Space_Mono',sans-serif] text-[#8b8b8b] text-[13px]">
                      Complete the survey and click &ldquo;Choose this job path&rdquo; on a match.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <PrimaryButton onClick={() => router.push("survey/step-1")}>
                        Take the survey
                      </PrimaryButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chosenJobs.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-[22px] bg-white/70 border border-black/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.3]">
                              {job.title}
                            </p>
                            <span className="px-2 py-0.5 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[11px] text-[#1e1e1e]">
                              {job.score}% match
                            </span>
                          </div>
                          <p className="mt-2 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px] leading-[1.5]">
                            {job.summary}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[11px] text-[#1e1e1e]">
                              ${job.payRange[0]}–${job.payRange[1]}/hr
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[11px] text-[#1e1e1e]">
                              {job.remoteFit}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          <SecondaryButton onClick={() => router.push(`survey/resources/${job.id}`)}>
                            Resources
                          </SecondaryButton>
                          <SecondaryButton onClick={() => removeJobPath(job.id)}>
                            Remove
                          </SecondaryButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Budget / Snapshot */}
            <div ref={snapshotRef}>
              <Card title="Budget" subtitle="Your current budget snapshot.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <StatCard key={s.label} stat={s} />
                  ))}
                </div>

                {/* Training spend widget */}
                <div className="mt-6 rounded-[22px] bg-white/70 border border-black/10 shadow-[0px_10px_25px_rgba(0,0,0,0.08)] p-5">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">
                      Training Spend
                    </p>
                    <p className={cn(
                      "font-['Press_Start_2P',sans-serif] text-[14px] leading-[1.2]",
                      overBudget ? "text-red-500" : "text-[#0c0c0d]"
                    )}>
                      ${totalTrainingCost.toLocaleString()}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        overBudget ? "bg-red-400" : budgetPct > 0.75 ? "bg-yellow-400" : "bg-green-400"
                      )}
                      style={{ width: `${budgetPct * 100}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-['Space_Mono',sans-serif] text-[#8b8b8b] text-[11px]">
                      {savedResources.length} course{savedResources.length !== 1 ? "s" : ""} selected
                    </p>
                    <p className={cn(
                      "font-['Space_Mono',sans-serif] text-[11px]",
                      overBudget ? "text-red-500" : "text-[#8b8b8b]"
                    )}>
                      {overBudget
                        ? `$${(totalTrainingCost - budgetMax).toLocaleString()} over budget`
                        : `$${(budgetMax - totalTrainingCost).toLocaleString()} remaining`}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Training Resources */}
            <div ref={trainingRef}>
              <Card
                title="Training"
                subtitle="Courses and certifications you've saved from your job path resources."
              >
                {savedResources.length === 0 ? (
                  <div className="rounded-[22px] bg-white/70 border border-black/10 p-6 text-center">
                    <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.6]">
                      No training resources saved yet.
                    </p>
                    <p className="mt-2 font-['Space_Mono',sans-serif] text-[#8b8b8b] text-[13px]">
                      Visit a job path&apos;s resources page and click &ldquo;Add to Training&rdquo;.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <PrimaryButton onClick={() => router.push("survey/step-1")}>
                        Take the survey
                      </PrimaryButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedResources.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-[22px] bg-white/70 border border-black/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[11px] leading-[1.3]">
                              {r.name}
                            </p>
                            {r.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[11px] text-[#1e1e1e]">
                                {r.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">
                            {r.provider} • {r.cost} • {r.duration}
                          </p>
                          <p className="mt-1 font-['Space_Mono',sans-serif] text-[#8b8b8b] text-[11px]">
                            For: {r.jobTitle}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto rounded-full border border-black/30 bg-white/70 hover:bg-white px-6 py-3 font-['Press_Start_2P',sans-serif] text-[11px] text-[#1e1e1e] text-center transition"
                          >
                            View
                          </a>
                          <SecondaryButton onClick={() => removeTrainingResource(r.id)}>
                            Remove
                          </SecondaryButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
