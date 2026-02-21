"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/app/components/survey/SurveyProvider";
import { useJobPaths } from "@/app/components/survey/JobPathsProvider";
import { SurveyShell, PrimaryButton, SecondaryButton } from "@/app/components/survey/SurveyShell";
import type { LiveJob } from "@/app/api/jobs/route";
import jobsData from "@/app/data/jobs.json";

/* ============================
   Types
============================ */

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

/* ============================
   Data source (JSON)
============================ */

const JOBS: Job[] = jobsData as Job[];

/* ============================
   Matching Logic
============================ */

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
    reasons.push(
      remotePref === "no-pref"
        ? "Flexible location fit"
        : `Location fit: ${job.remoteFit}`
    );

    return { job, score, reasons, gaps: Array.from(new Set(gaps)).slice(0, 3) };
  }).sort((a, b) => b.score - a.score);
}

/* ============================
   Live Listings Component
============================ */

type LiveListingsProps = {
  jobTitle: string;
  remote: string;
  location: string;
  radiusMiles: number;
};

function LiveListings({ jobTitle, remote, location, radiusMiles }: LiveListingsProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [jobs, setJobs] = useState<LiveJob[]>([]);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const params = new URLSearchParams({
        query: jobTitle,
        remote,
        location,
        radiusMiles: String(radiusMiles)
      });
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as { jobs: LiveJob[] };
      setJobs(data.jobs);
      setState("done");
    } catch {
      setState("error");
    }
  }, [jobTitle, remote, location, radiusMiles]);

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
        Could not load listings.
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
      <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[13px]">
        Real listings
      </p>
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
          </div>
          <span className="shrink-0 mt-0.5 font-['Space_Mono',sans-serif] text-[12px] text-[#4b4b4b]">
            Apply →
          </span>
        </a>
      ))}
    </div>
  );
}

/* ============================
   Page
============================ */

export default function SurveyResults() {
  const router = useRouter();
  const { answers } = useSurvey();
  const { chosenJobs, addJobPath } = useJobPaths();

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
          <div
            key={m.job.id}
            className="rounded-2xl border border-black/10 bg-white/35 backdrop-blur-sm p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
          >
            <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
              {m.job.title}
            </p>

            <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px]">
              {m.job.summary}
            </p>

            <LiveListings
              jobTitle={m.job.title}
              remote={answers.constraints.remote}
              location={answers.constraints.location}
              radiusMiles={answers.constraints.radiusMiles}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <SecondaryButton onClick={() => router.push("step-3")}>
          Back
        </SecondaryButton>
        <PrimaryButton onClick={() => router.push("step-1")}>
          Start over
        </PrimaryButton>
      </div>
    </SurveyShell>
  );
}