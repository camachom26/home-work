"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/app/components/survey/SurveyProvider";
import { SurveyShell, PrimaryButton, SecondaryButton } from "@/app/components/survey/SurveyShell";
import type { LiveJob } from "@/app/api/jobs/route";

/** Same JOBS + matcher logic as before, moved into this file for simplicity.
 * If you want, we can move it to app/components/survey/matching.ts
 */
type SkillId = import("@/app/components/survey/SurveyProvider").SkillId;
type Answers = import("@/app/components/survey/SurveyProvider").Answers;

type Job = {
  id: string;
  title: string;
  summary: string;
  typicalTraining: string;
  payRange: [number, number];
  remoteFit: "remote" | "hybrid" | "onsite";
  weights: Partial<Record<SkillId, number>>;
  interestTags: string[];
};

type Match = { job: Job; score: number; reasons: string[]; gaps: string[] };

const JOBS: Job[] = [
  {
    id: "admin-coordinator",
    title: "Administrative Coordinator",
    summary: "Calendar, email, tasks, lightweight ops for a team.",
    typicalTraining: "Short course (1–4 weeks) or on-the-job training",
    payRange: [18, 28],
    remoteFit: "hybrid",
    weights: { scheduling: 3, communication: 3, organization: 3, attentionToDetail: 2, techComfort: 2, writing: 1 },
    interestTags: ["Office/Admin", "Nonprofit", "Tech"]
  },
  {
    id: "bookkeeping-assistant",
    title: "Bookkeeping Assistant",
    summary: "Track invoices, reconcile expenses, basic accounting support.",
    typicalTraining: "Course/cert (4–12 weeks) or community college module",
    payRange: [20, 32],
    remoteFit: "remote",
    weights: { budgeting: 3, attentionToDetail: 3, organization: 2, techComfort: 2, communication: 1 },
    interestTags: ["Office/Admin", "Nonprofit", "Tech"]
  },
  {
    id: "customer-support",
    title: "Customer Support Specialist",
    summary: "Help customers via chat/email, troubleshooting and empathy.",
    typicalTraining: "On-the-job training (1–3 weeks)",
    payRange: [17, 27],
    remoteFit: "remote",
    weights: { communication: 3, customerService: 3, techComfort: 2, writing: 2, attentionToDetail: 1 },
    interestTags: ["Tech", "Retail/Service"]
  },
  {
    id: "teacher-assistant",
    title: "Teacher Assistant / Tutor",
    summary: "Support learning, small groups, structured guidance.",
    typicalTraining: "Background check + short training; some roles require credits",
    payRange: [15, 24],
    remoteFit: "onsite",
    weights: { teaching: 3, communication: 2, organization: 2, caretaking: 2, attentionToDetail: 1 },
    interestTags: ["Education", "Nonprofit"]
  },
  {
    id: "medical-front-desk",
    title: "Medical Front Desk / Intake",
    summary: "Scheduling, forms, patient communication, insurance basics.",
    typicalTraining: "On-the-job training (2–6 weeks); optional certificate",
    payRange: [17, 26],
    remoteFit: "onsite",
    weights: { communication: 3, scheduling: 3, attentionToDetail: 2, organization: 2, customerService: 2, techComfort: 1 },
    interestTags: ["Healthcare", "Office/Admin"]
  }
];

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function skillLabel(id: SkillId) {
  const map: Record<SkillId, string> = {
    budgeting: "Budgeting & money tracking",
    scheduling: "Scheduling & coordination",
    communication: "Communication & follow-up",
    organization: "Organization & systems",
    teaching: "Teaching / explaining to others",
    customerService: "Customer service / people skills",
    techComfort: "Comfort with computers & apps",
    writing: "Writing / documentation",
    attentionToDetail: "Attention to detail",
    caretaking: "Care / support roles"
  };
  return map[id] ?? id;
}

function matchJobs(answers: Answers): Match[] {
  return JOBS.map((job) => {
    let skillScore = 0;
    let maxSkillScore = 0;
    const reasons: string[] = [];
    const gaps: string[] = [];

    const skillSet = new Set(answers.skills);
    const interestSet = new Set(answers.interests);

    for (const [skill, w] of Object.entries(job.weights) as [SkillId, number][]) {
      maxSkillScore += w;
      if (skillSet.has(skill)) skillScore += w;
      else if (w >= 3) gaps.push(`Consider building: ${skillLabel(skill)}`);
    }

    const skillPct = maxSkillScore ? skillScore / maxSkillScore : 0;

    const interestHits = job.interestTags.filter((t) => interestSet.has(t)).length;
    const interestPct = job.interestTags.length ? interestHits / job.interestTags.length : 0;

    const wageOk = job.payRange[1] >= answers.constraints.minWage;
    const wageScore = wageOk ? 1 : 0.2;

    const remotePref = answers.constraints.remote;
    let remoteScore = 1;
    if (remotePref !== "no-pref") {
      remoteScore = job.remoteFit === remotePref ? 1 : job.remoteFit === "hybrid" ? 0.8 : 0.6;
    }

    const raw = 0.62 * skillPct + 0.2 * interestPct + 0.1 * wageScore + 0.08 * remoteScore;
    const score = Math.round(clamp(raw, 0, 1) * 100);

    if (skillPct >= 0.75) reasons.push("Strong skills alignment");
    else if (skillPct >= 0.5) reasons.push("Good skills alignment");
    else reasons.push("Some skills match; may need upskilling");

    if (interestPct >= 0.5) reasons.push("Matches your interests");
    if (wageOk) reasons.push("Pay range can meet your minimum");
    reasons.push(remotePref === "no-pref" ? "Flexible location fit" : `Location fit: ${job.remoteFit}`);

    return { job, score, reasons, gaps: Array.from(new Set(gaps)).slice(0, 3) };
  }).sort((a, b) => b.score - a.score);
}

type LiveListingsProps = { jobTitle: string; remote: string };

function LiveListings({ jobTitle, remote }: LiveListingsProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [jobs, setJobs] = useState<LiveJob[]>([]);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const params = new URLSearchParams({ query: jobTitle, remote });
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json() as { jobs: LiveJob[] };
      setJobs(data.jobs);
      setState("done");
    } catch {
      setState("error");
    }
  }, [jobTitle, remote]);

  if (state === "idle") {
    return (
      <button
        type="button"
        onClick={load}
        className="mt-5 w-full rounded-xl border border-black/15 bg-white/60 hover:bg-white px-4 py-3 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e] transition"
      >
        Find real listings →
      </button>
    );
  }

  if (state === "loading") {
    return (
      <p className="mt-5 font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b] animate-pulse">
        Searching jobs…
      </p>
    );
  }

  if (state === "error") {
    return (
      <p className="mt-5 font-['Space_Mono',sans-serif] text-[13px] text-red-500">
        Could not load listings. Check your JSEARCH_API_KEY.
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="mt-5 font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b]">
        No listings found right now.
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-2">
      <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[13px]">Real listings</p>
      {jobs.map((j) => (
        <a
          key={j.id}
          href={j.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start justify-between gap-3 rounded-xl border border-black/10 bg-white/60 hover:bg-white px-4 py-3 transition group"
        >
          <div className="min-w-0">
            <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[13px] truncate group-hover:underline">
              {j.title}
            </p>
            <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px] mt-0.5">
              {j.company} · {j.location}
              {j.isRemote && " · Remote"}
            </p>
            {j.publisher && (
              <p className="font-['Space_Mono',sans-serif] text-[#8b8b8b] text-[11px] mt-0.5">
                via {j.publisher}
              </p>
            )}
          </div>
          <span className="shrink-0 mt-0.5 font-['Space_Mono',sans-serif] text-[12px] text-[#4b4b4b]">Apply →</span>
        </a>
      ))}
    </div>
  );
}

export default function SurveyResults() {
  const router = useRouter();
  const { answers } = useSurvey();

  const matches = useMemo(() => matchJobs(answers), [answers]);

  return (
    <SurveyShell
      title="Survey → Job Match"
      subtitle="Results: ranked by skills, interests, and constraints."
      step={4}
      total={4}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((m) => (
          <div key={m.job.id} className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">{m.job.title}</p>
                <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.5]">{m.job.summary}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-['Press_Start_2P',sans-serif] text-[14px] text-[#0c0c0d]">{m.score}%</p>
                <p className="font-['Space_Mono',sans-serif] text-[12px] text-[#5b5b5b]">match</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/10 text-[#1e1e1e] font-['Space_Mono',sans-serif] text-[12px]">
                ${m.job.payRange[0]}–${m.job.payRange[1]}/hr
              </span>
              <span className="px-3 py-1 rounded-full bg-black/10 text-[#1e1e1e] font-['Space_Mono',sans-serif] text-[12px]">
                {m.job.remoteFit}
              </span>
            </div>

            <div className="mt-5">
              <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[13px]">Why this matches</p>
              <ul className="mt-2 space-y-1">
                {m.reasons.map((r, i) => (
                  <li key={i} className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px] leading-[1.5]">
                    • {r}
                  </li>
                ))}
              </ul>
            </div>

            {m.gaps.length > 0 && (
              <div className="mt-4">
                <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[13px]">Helpful next skills</p>
                <ul className="mt-2 space-y-1">
                  {m.gaps.map((g, i) => (
                    <li key={i} className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px] leading-[1.5]">
                      • {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-5 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[12px] leading-[1.5]">
              Typical training: {m.job.typicalTraining}
            </p>

            <LiveListings jobTitle={m.job.title} remote={answers.constraints.remote} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <SecondaryButton onClick={() => router.push("step-3")}>Back</SecondaryButton>
        <PrimaryButton onClick={() => router.push("step-1")}>Start over</PrimaryButton>
      </div>
    </SurveyShell>
  );
}