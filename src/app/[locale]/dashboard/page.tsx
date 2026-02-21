"use client";

import React, { useMemo, useState } from "react";

type Stat = { label: string; value: string; sub?: string };
type Activity = { title: string; when: string; detail?: string; pill?: string };
type Goal = { title: string; pct: number; sub?: string };

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

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">Progress</p>
        <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{clamped}%</p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full bg-black/80 rounded-full" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

function Pill({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full border transition text-left",
        "font-['Space_Mono',sans-serif] text-[13px] sm:text-[14px]",
        active
          ? "bg-black text-white border-black"
          : "bg-white/70 border-black/15 hover:bg-white hover:border-black/25 text-[#1e1e1e]"
      )}
    >
      {children}
    </button>
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
  // You can swap this to your actual auth/user data
  const userName = "Mia";

  const tabs = ["Overview", "Budget", "Training", "Jobs"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");

  const stats: Stat[] = useMemo(
    () => [
      { label: "Skills Profile", value: "78%", sub: "Based on your last survey" },
      { label: "Monthly Budget", value: "$1,650", sub: "Planned spending" },
      { label: "Training Plan", value: "3", sub: "Programs saved" },
      { label: "Job Matches", value: "12", sub: "Updated today" }
    ],
    []
  );

  const goals: Goal[] = useMemo(
    () => [
      { title: "Complete skills survey", pct: 100, sub: "Nice work — you’re done." },
      { title: "Set wage range", pct: 60, sub: "Add your minimum acceptable wage." },
      { title: "Pick 1 training program", pct: 35, sub: "Shortlist based on time + cost." },
      { title: "Apply to 3 roles", pct: 0, sub: "Start with 15-minute quick applies." }
    ],
    []
  );

  const activity: Activity[] = useMemo(
    () => [
      { title: "Survey results saved", when: "Today", detail: "We updated your strengths profile.", pill: "Profile" },
      { title: "Budget updated", when: "Yesterday", detail: "You adjusted your training budget.", pill: "Budget" },
      { title: "New jobs matched", when: "2 days ago", detail: "3 new roles fit your preferences.", pill: "Jobs" }
    ],
    []
  );

  return (
    <div
      className="w-full bg-fixed bg-[length:100%_auto] bg-top bg-no-repeat"
      style={{ backgroundImage: "url('/surveybackground.png')" }}
    >
      {/* keep background crisp; light overlay only */}
      <div className="w-full bg-white/10">
        <header className="w-full">
          <div className="mx-auto max-w-7xl px-6 md:px-8 pt-10 md:pt-14 pb-4">
            <div className="rounded-[28px] bg-white/70 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.2vw,30px)] leading-[1.2]">
                    Dashboard
                  </p>
                  <p className="mt-4 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.6] max-w-3xl">
                    Welcome back{userName ? `, ${userName}` : ""}. Here’s a clear view of your progress, budget, training
                    options, and job matches.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <SecondaryButton onClick={() => setTab("Overview")}>Refresh</SecondaryButton>
                  <PrimaryButton onClick={() => alert("Hook this to your next step route")}>Continue</PrimaryButton>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {tabs.map((t) => (
                  <Pill key={t} active={tab === t} onClick={() => setTab(t)}>
                    {t}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="w-full">
          <div className="mx-auto max-w-7xl px-6 md:px-8 pt-2 md:pt-4 pb-10 md:pb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: stats + main content */}
              <div className="lg:col-span-8 space-y-6">
                <Card
                  title="Snapshot"
                  subtitle="A quick read on where you are today. You can plug real numbers into these cards anytime."
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((s) => (
                      <StatCard key={s.label} stat={s} />
                    ))}
                  </div>
                </Card>

                <Card
                  title={tab}
                  subtitle={
                    tab === "Overview"
                      ? "Your recommended next steps, summarized."
                      : tab === "Budget"
                        ? "Budget tools to keep your plan realistic."
                        : tab === "Training"
                          ? "Programs and learning paths based on your strengths."
                          : "Roles that match your preferences and experience."
                  }
                  right={
                    <div className="hidden sm:flex gap-2">
                      <SecondaryButton onClick={() => alert("Hook to settings")}>Settings</SecondaryButton>
                      <PrimaryButton onClick={() => alert("Hook to create action")}>New Action</PrimaryButton>
                    </div>
                  }
                >
                  {tab === "Overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <p className="font-['Press_Start_2P',sans-serif] text-[12px] text-[#0c0c0d]">
                          Recommended next step
                        </p>
                        <p className="mt-3 font-['Space_Mono',sans-serif] text-[14px] leading-[1.7] text-[#1e1e1e]">
                          Set your <span className="font-bold">minimum acceptable wage</span> and pick a{" "}
                          <span className="font-bold">training time limit</span>. It improves job matches immediately.
                        </p>
                        <div className="mt-4">
                          <ProgressBar pct={60} />
                        </div>
                      </div>

                      <div className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <p className="font-['Press_Start_2P',sans-serif] text-[12px] text-[#0c0c0d]">
                          This week’s focus
                        </p>
                        <ul className="mt-3 space-y-2 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e]">
                          <li className="flex gap-2">
                            <span className="text-black/70">•</span> Save 1 training program under $500
                          </li>
                          <li className="flex gap-2">
                            <span className="text-black/70">•</span> Add 2 transferable skills to your profile
                          </li>
                          <li className="flex gap-2">
                            <span className="text-black/70">•</span> Apply to 3 “good enough” roles
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {tab === "Budget" && (
                    <div className="space-y-4">
                      <div className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <p className="font-['Press_Start_2P',sans-serif] text-[12px] text-[#0c0c0d]">Budget health</p>
                        <p className="mt-3 font-['Space_Mono',sans-serif] text-[14px] leading-[1.7] text-[#1e1e1e]">
                          Your plan looks stable. Next improvement: split “training” into{" "}
                          <span className="font-bold">tuition</span> + <span className="font-bold">supplies</span> so you
                          can compare programs accurately.
                        </p>
                        <div className="mt-4">
                          <ProgressBar pct={72} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                          <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">Next task</p>
                          <p className="mt-2 font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[14px] leading-[1.2]">
                            Add wage range
                          </p>
                          <p className="mt-3 font-['Space_Mono',sans-serif] text-[13px] leading-[1.7] text-[#1e1e1e]">
                            This helps filter roles that actually meet your needs.
                          </p>
                        </div>
                        <div className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                          <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">Tip</p>
                          <p className="mt-2 font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[14px] leading-[1.2]">
                            Keep it simple
                          </p>
                          <p className="mt-3 font-['Space_Mono',sans-serif] text-[13px] leading-[1.7] text-[#1e1e1e]">
                            Start with 3 buckets: Needs, Wants, Training.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === "Training" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Customer Support → Tech Support", meta: "4–8 weeks • Low cost", pct: 40 },
                        { name: "Intro Web Dev (Portfolio Path)", meta: "6–10 weeks • Moderate", pct: 15 },
                        { name: "IT Fundamentals (CompTIA-style)", meta: "8–12 weeks • Moderate", pct: 0 },
                        { name: "Office Admin → Ops Coordinator", meta: "2–4 weeks • Low cost", pct: 65 }
                      ].map((p) => (
                        <div key={p.name} className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                          <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.3]">
                            {p.name}
                          </p>
                          <p className="mt-3 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">{p.meta}</p>
                          <div className="mt-4">
                            <ProgressBar pct={p.pct} />
                          </div>
                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <SecondaryButton onClick={() => alert("Hook to details")}>Details</SecondaryButton>
                            <PrimaryButton onClick={() => alert("Hook to save program")}>Save</PrimaryButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === "Jobs" && (
                    <div className="space-y-3">
                      {[
                        { role: "Customer Success Associate", company: "Local Remote", match: 84, tag: "Remote" },
                        { role: "Support Engineer (Entry)", company: "FinTech", match: 79, tag: "Hybrid" },
                        { role: "Operations Coordinator", company: "Healthcare", match: 74, tag: "On-site" },
                        { role: "Junior QA Tester", company: "SaaS", match: 70, tag: "Remote" }
                      ].map((j) => (
                        <div
                          key={j.role}
                          className="rounded-[22px] bg-white/70 border border-black/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                          <div>
                            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.3]">
                              {j.role}
                            </p>
                            <p className="mt-2 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">
                              {j.company} • {j.tag}
                            </p>
                          </div>
                          <div className="w-full md:w-[260px]">
                            <ProgressBar pct={j.match} />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <SecondaryButton onClick={() => alert("Hook to view job")}>View</SecondaryButton>
                            <PrimaryButton onClick={() => alert("Hook to apply")}>Apply</PrimaryButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Right: goals + recent activity */}
              <div className="lg:col-span-4 space-y-6">
                <Card title="Goals" subtitle="Small wins that move you forward.">
                  <div className="space-y-4">
                    {goals.map((g) => (
                      <div key={g.title} className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.3]">
                          {g.title}
                        </p>
                        {g.sub && (
                          <p className="mt-3 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[13px] leading-[1.7]">
                            {g.sub}
                          </p>
                        )}
                        <div className="mt-4">
                          <ProgressBar pct={g.pct} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Recent activity" subtitle="What changed recently in your plan.">
                  <div className="space-y-3">
                    {activity.map((a) => (
                      <div key={a.title} className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{a.when}</p>
                            <p className="mt-2 font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.35]">
                              {a.title}
                            </p>
                          </div>
                          {a.pill && (
                            <span className="px-3 py-1 rounded-full border border-black/15 bg-white/60 font-['Space_Mono',sans-serif] text-[12px] text-[#1e1e1e]">
                              {a.pill}
                            </span>
                          )}
                        </div>
                        {a.detail && (
                          <p className="mt-3 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[13px] leading-[1.7]">
                            {a.detail}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="rounded-[28px] bg-white/70 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-8">
                  <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.4]">
                    Quick actions
                  </p>
                  <div className="mt-4 space-y-2">
                    <SecondaryButton onClick={() => alert("Hook: edit wage range")}>Edit wage range</SecondaryButton>
                    <SecondaryButton onClick={() => alert("Hook: add training budget")}>Add training budget</SecondaryButton>
                    <PrimaryButton onClick={() => alert("Hook: resume survey")}>Resume survey</PrimaryButton>
                  </div>
                  <p className="mt-4 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px] leading-[1.6]">
                    Tip: keep actions short. The dashboard should feel calm, not crowded.
                  </p>
                </div>
              </div>
            </div>

            <footer className="mt-8">
              <p className="font-['Space_Mono',sans-serif] text-[12px] text-black/50">
                This page matches your existing style: pixel headline, mono body, rounded glass cards, soft shadow, and
                simple black progress bars.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}