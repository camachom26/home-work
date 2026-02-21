"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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

/**
 * Strips seniority prefixes and overly specific suffixes so Adzuna
 * returns broader, more relevant results for AI-generated titles.
 * e.g. "Senior Family Support Specialist" → "Family Support Assistant"
 */
function simplifyTitle(title: string): string {
  return title
    .replace(/^(Senior|Junior|Entry[\s-]Level|Lead|Sr\.|Jr\.)\s+/gi, "")
    .replace(/\b(Specialist|Coordinator|Associate)\b/gi, (match) => {
      const map: Record<string, string> = {
        specialist: "Assistant",
        coordinator: "Assistant",
        associate: "Assistant",
      };
      return map[match.toLowerCase()] ?? match;
    })
    .trim();
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

<<<<<<< HEAD
// ------------------------------------------------------------
// LiveListings — Adzuna search only, no Gemini
// ------------------------------------------------------------
=======
/* ============================
   Live Listings Component
============================ */

>>>>>>> b543987ea614f111b78460fbd6b0baffd2ffacd1
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

  // Guard: if no location and not remote, prompt user to add one
  if (!location.trim() && remote !== "remote") {
    return (
      <p className="mt-5 font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b]">
        Add your location in Step 3 to find real listings near you.
      </p>
    );
  }

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
<<<<<<< HEAD
        Could not load listings. Check your API configuration.
=======
        Could not load listings.
>>>>>>> b543987ea614f111b78460fbd6b0baffd2ffacd1
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="mt-5 font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b]">
        No listings found for this title right now.
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

<<<<<<< HEAD
// ------------------------------------------------------------
// Main Results Page
// ------------------------------------------------------------
=======
/* ============================
   Page
============================ */

>>>>>>> b543987ea614f111b78460fbd6b0baffd2ffacd1
export default function SurveyResults() {
  const router = useRouter();
  const { answers } = useSurvey();
  const { chosenJobs, addJobPath } = useJobPaths();

  const matches = useMemo(() => matchJobs(answers), [answers]);

  // Gemini: fetch AI-suggested job titles once on mount (only if pitch exists)
  const [geminiTitles, setGeminiTitles] = useState<string[]>([]);
  const [geminiStatus, setGeminiStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (!answers.notes.trim()) return;

    setGeminiStatus("loading");

    fetch("/api/test-gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPitch: answers.notes,
        skills: answers.skills,
        interests: answers.interests,
        constraints: answers.constraints, // ✅ always send constraints
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data: { jobTitles: string[] }) => {
        setGeminiTitles(data.jobTitles ?? []);
        setGeminiStatus("done");
      })
      .catch(() => setGeminiStatus("error"));
  }, [answers.notes, answers.skills, answers.interests, answers.constraints]);

  return (
    <SurveyShell
      title="Survey → Job Match"
      subtitle="Results: ranked by skills, interests, and constraints."
      step={4}
      total={4}
    >
      {/* ── Gemini AI Section (only shown if user wrote a pitch) ── */}
      {answers.notes.trim() && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <p className="font-['Space_Mono',sans-serif] font-bold text-[20px] text-[#1e1e1e]">
              ✨ AI-Matched Roles
            </p>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-['Space_Mono',sans-serif] text-[11px]">
              from your pitch
            </span>
          </div>

          {geminiStatus === "loading" && (
            <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
              <p className="font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b] animate-pulse">
                Analyzing your pitch for the best-fit roles…
              </p>
            </div>
          )}

          {geminiStatus === "error" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="font-['Space_Mono',sans-serif] text-[13px] text-red-500">
                Could not load AI suggestions. Check your GEMINI_API_KEY.
              </p>
            </div>
          )}

          {geminiStatus === "done" && geminiTitles.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {geminiTitles.map((title) => (
                <div
                  key={title}
                  className="rounded-2xl border border-blue-200 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {/* Show the original Gemini title to the user */}
                      <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                        {title}
                      </p>
                      <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">
                        Suggested based on your pitch & skills
                      </p>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-['Space_Mono',sans-serif] text-[11px]">
                      AI
                    </span>
                  </div>

                  {/*
                    Pass simplifyTitle(title) to Adzuna so searches are broader.
                    e.g. "Senior Family Support Specialist" → "Family Support Assistant"
                    The card still displays the original Gemini title above.
                  */}
                  <LiveListings
                    jobTitle={simplifyTitle(title)}
                    remote={answers.constraints.remote}
                    location={answers.constraints.location}
                    radiusMiles={answers.constraints.radiusMiles}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Divider between AI and skill-based sections ── */}
      {answers.notes.trim() && (
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-black/10" />
          <p className="font-['Space_Mono',sans-serif] text-[12px] text-[#8b8b8b]">
            skill-based matches
          </p>
          <div className="flex-1 h-px bg-black/10" />
        </div>
      )}

      {/* ── Hardcoded Skill-Based Matches ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((m) => (
          <div
            key={m.job.id}
<<<<<<< HEAD
            className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  {m.job.title}
                </p>
                <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.5]">
                  {m.job.summary}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-['Press_Start_2P',sans-serif] text-[14px] text-[#0c0c0d]">
                  {m.score}%
                </p>
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
              <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[13px]">
                Why this matches
              </p>
              <ul className="mt-2 space-y-1">
                {m.reasons.map((r, i) => (
                  <li
                    key={i}
                    className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px] leading-[1.5]"
                  >
                    • {r}
                  </li>
                ))}
              </ul>
            </div>

            {m.gaps.length > 0 && (
              <div className="mt-4">
                <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[13px]">
                  Helpful next skills
                </p>
                <ul className="mt-2 space-y-1">
                  {m.gaps.map((g, i) => (
                    <li
                      key={i}
                      className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px] leading-[1.5]"
                    >
                      • {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-5 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[12px] leading-[1.5]">
              Typical training: {m.job.typicalTraining}
=======
            className="rounded-2xl border border-black/10 bg-white/35 backdrop-blur-sm p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
          >
            <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
              {m.job.title}
            </p>

            <p className="mt-1 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px]">
              {m.job.summary}
>>>>>>> b543987ea614f111b78460fbd6b0baffd2ffacd1
            </p>

            {/* Hardcoded titles are already clean — no simplification needed */}
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