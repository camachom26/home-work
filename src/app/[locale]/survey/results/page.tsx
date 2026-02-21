"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/app/components/survey/SurveyProvider";
import { useJobPaths } from "@/app/components/survey/JobPathsProvider";
import { SurveyShell, PrimaryButton, SecondaryButton } from "@/app/components/survey/SurveyShell";
import type { LiveJob } from "@/app/api/jobs/route";

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
    id: "front-desk",
    title: "Front Desk Receptionist",
    summary: "Greet visitors, answer phones, and schedule appointments at an office, clinic, or hotel.",
    typicalTraining: "On-the-job training (1–2 weeks)",
    payRange: [14, 22],
    remoteFit: "onsite",
    weights: { communication: 3, scheduling: 3, organization: 2, customerService: 2, attentionToDetail: 2, techComfort: 1 },
    interestTags: ["Healthcare", "Office/Admin", "Nonprofit"]
  },
  {
    id: "customer-service",
    title: "Customer Service Representative",
    summary: "Help customers by phone, chat, or in person — resolve issues and answer questions.",
    typicalTraining: "On-the-job training (1–3 weeks)",
    payRange: [15, 25],
    remoteFit: "remote",
    weights: { communication: 3, customerService: 3, writing: 2, techComfort: 2, attentionToDetail: 1 },
    interestTags: ["Retail/Service", "Tech"]
  },
  {
    id: "retail-associate",
    title: "Retail Sales Associate",
    summary: "Assist shoppers, process transactions, stock shelves, and keep the store organized.",
    typicalTraining: "On-the-job training (a few days to 1 week)",
    payRange: [13, 20],
    remoteFit: "onsite",
    weights: { customerService: 3, communication: 3, organization: 2, attentionToDetail: 1 },
    interestTags: ["Retail/Service"]
  },
  {
    id: "office-admin",
    title: "Office Administrative Assistant",
    summary: "Handle data entry, filing, scheduling, and day-to-day tasks for a team or office.",
    typicalTraining: "On-the-job or short course (2–6 weeks)",
    payRange: [16, 28],
    remoteFit: "hybrid",
    weights: { organization: 3, scheduling: 3, attentionToDetail: 3, techComfort: 2, writing: 2, communication: 1 },
    interestTags: ["Office/Admin", "Nonprofit", "Tech"]
  },
  {
    id: "bookkeeper",
    title: "Bookkeeper",
    summary: "Track income and expenses, manage invoices, and keep financial records accurate.",
    typicalTraining: "Course or certification (4–12 weeks), or self-study",
    payRange: [18, 32],
    remoteFit: "remote",
    weights: { budgeting: 3, attentionToDetail: 3, organization: 2, techComfort: 2, communication: 1 },
    interestTags: ["Office/Admin", "Nonprofit"]
  },
  {
    id: "teacher-aide",
    title: "Teacher Aide",
    summary: "Support classroom instruction, work with small groups, and help students with learning tasks.",
    typicalTraining: "Background check + orientation; some roles require coursework",
    payRange: [13, 22],
    remoteFit: "onsite",
    weights: { teaching: 3, caretaking: 2, communication: 2, organization: 2, attentionToDetail: 1 },
    interestTags: ["Education", "Nonprofit"]
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
    reasons.push(remotePref === "no-pref" ? "Flexible location fit" : `Location fit: ${job.remoteFit}`);

    return { job, score, reasons, gaps: Array.from(new Set(gaps)).slice(0, 3) };
  }).sort((a, b) => b.score - a.score);
}

// ------------------------------------------------------------
// LiveListings — Adzuna search only, no Gemini
// ------------------------------------------------------------
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
        radiusMiles: String(radiusMiles),
      });
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json() as { jobs: LiveJob[] };
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
        Could not load listings. Check your API configuration.
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
          <span className="shrink-0 mt-0.5 font-['Space_Mono',sans-serif] text-[12px] text-[#4b4b4b]">
            Apply →
          </span>
        </a>
      ))}
    </div>
  );
}

// ------------------------------------------------------------
// Main Results Page
// ------------------------------------------------------------
export default function SurveyResults() {
  const router = useRouter();
  const { answers } = useSurvey();
  const { chosenJobs, addJobPath } = useJobPaths();

  const matches = useMemo(() => matchJobs(answers), [answers]);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedAITitle, setSelectedAITitle] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSelectedMatch(null); setSelectedAITitle(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    <>
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
                <button
                  key={title}
                  type="button"
                  onClick={() => setSelectedAITitle(title)}
                  className="text-left rounded-2xl border border-black/10 bg-white/70 hover:bg-white hover:shadow-[0px_12px_28px_rgba(0,0,0,0.14)] p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)] transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                      {title}
                    </p>
                    <div className="shrink-0 text-right">
                      <p className="font-['Press_Start_2P',sans-serif] text-[14px] text-[#0c0c0d]">
                        AI
                      </p>
                      <p className="font-['Space_Mono',sans-serif] text-[12px] text-[#5b5b5b]">match</p>
                    </div>
                  </div>

                  <p className="mt-2 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.5]">
                    Suggested based on your pitch & skills
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/10 text-[#1e1e1e] font-['Space_Mono',sans-serif] text-[12px]">
                      pitch match
                    </span>
                  </div>

                  <p className="mt-5 font-['Space_Mono',sans-serif] text-[#8b8b8b] text-[12px]">
                    Click to view details →
                  </p>
                </button>
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
          <button
            key={m.job.id}
            type="button"
            onClick={() => setSelectedMatch(m)}
            className="text-left rounded-2xl border border-black/10 bg-white/70 hover:bg-white hover:shadow-[0px_12px_28px_rgba(0,0,0,0.14)] p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)] transition cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                {m.job.title}
              </p>
              <div className="shrink-0 text-right">
                <p className="font-['Press_Start_2P',sans-serif] text-[14px] text-[#0c0c0d]">
                  {m.score}%
                </p>
                <p className="font-['Space_Mono',sans-serif] text-[12px] text-[#5b5b5b]">match</p>
              </div>
            </div>

            <p className="mt-2 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.5]">
              {m.job.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/10 text-[#1e1e1e] font-['Space_Mono',sans-serif] text-[12px]">
                ${m.job.payRange[0]}–${m.job.payRange[1]}/hr
              </span>
              <span className="px-3 py-1 rounded-full bg-black/10 text-[#1e1e1e] font-['Space_Mono',sans-serif] text-[12px]">
                {m.job.remoteFit}
              </span>
            </div>

            <p className="mt-5 font-['Space_Mono',sans-serif] text-[#8b8b8b] text-[12px]">
              Click to view details →
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <PrimaryButton onClick={() => router.push("step-3")}>Back</PrimaryButton>
        <SecondaryButton onClick={() => router.push("step-1")}>Start over</SecondaryButton>
        <PrimaryButton onClick={() => router.push("/dashboard")}> Go to Dashboard → </PrimaryButton>
      </div>

    </SurveyShell>

    {selectedMatch && typeof document !== "undefined" && createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6"
        onClick={() => setSelectedMatch(null)}
      >
        <div
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[28px] bg-white shadow-[0px_20px_60px_rgba(0,0,0,0.30)] p-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setSelectedMatch(null)}
            className="absolute top-5 right-5 h-9 w-9 rounded-full border border-black/15 bg-black/5 hover:bg-black/10 flex items-center justify-center font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e] transition"
          >
            ✕
          </button>

          {/* Header */}
          <div className="flex items-start justify-between gap-6 pr-10">
            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(14px,1.8vw,20px)] leading-[1.3]">
              {selectedMatch.job.title}
            </p>
            <div className="shrink-0 text-right">
              <p className="font-['Press_Start_2P',sans-serif] text-[18px] text-[#0c0c0d]">
                {selectedMatch.score}%
              </p>
              <p className="font-['Space_Mono',sans-serif] text-[12px] text-[#5b5b5b]">match</p>
            </div>
          </div>

          <p className="mt-4 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[15px] leading-[1.7]">
            {selectedMatch.job.summary}
          </p>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e]">
              ${selectedMatch.job.payRange[0]}–${selectedMatch.job.payRange[1]}/hr
            </span>
            <span className="px-3 py-1 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e]">
              {selectedMatch.job.remoteFit}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e]">
              {selectedMatch.job.typicalTraining}
            </span>
          </div>

          {/* Why it matches */}
          <div className="mt-7">
            <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[14px]">
              Why this matches
            </p>
            <ul className="mt-3 space-y-2">
              {selectedMatch.reasons.map((r, i) => (
                <li key={i} className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.6]">
                  • {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Skill gaps */}
          {selectedMatch.gaps.length > 0 && (
            <div className="mt-6">
              <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[14px]">
                Helpful next skills
              </p>
              <ul className="mt-3 space-y-2">
                {selectedMatch.gaps.map((g, i) => (
                  <li key={i} className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.6]">
                    • {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Live listings */}
          <div className="mt-7 border-t border-black/10 pt-6">
            <LiveListings
              jobTitle={selectedMatch.job.title}
              remote={answers.constraints.remote}
              location={answers.constraints.location}
              radiusMiles={answers.constraints.radiusMiles}
            />
          </div>

          {/* Action buttons */}
          <div className="mt-7 flex flex-col gap-3">
            {chosenJobs.some((j) => j.id === selectedMatch.job.id) ? (
              <div className="w-full rounded-xl border border-black/20 bg-black px-4 py-3 font-['Space_Mono',sans-serif] text-[14px] text-white text-center">
                ✓ Added to your job paths
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addJobPath({
                    id: selectedMatch.job.id,
                    title: selectedMatch.job.title,
                    summary: selectedMatch.job.summary,
                    payRange: selectedMatch.job.payRange,
                    remoteFit: selectedMatch.job.remoteFit,
                    score: selectedMatch.score,
                  });
                }}
                className="w-full rounded-xl border border-black bg-black text-white hover:bg-black/80 px-4 py-4 font-['Space_Mono',sans-serif] text-[14px] transition"
              >
                Choose this job path
              </button>
            )}
            <button
              type="button"
              onClick={() => { setSelectedMatch(null); router.push(`resources/${selectedMatch.job.id}`); }}
              className="w-full rounded-xl border border-black/20 bg-black/5 hover:bg-black hover:text-white px-4 py-4 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e] transition"
            >
              View training resources →
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}

    {selectedAITitle && typeof document !== "undefined" && createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6"
        onClick={() => setSelectedAITitle(null)}
      >
        <div
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[28px] bg-white shadow-[0px_20px_60px_rgba(0,0,0,0.30)] p-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setSelectedAITitle(null)}
            className="absolute top-5 right-5 h-9 w-9 rounded-full border border-black/15 bg-black/5 hover:bg-black/10 flex items-center justify-center font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e] transition"
          >
            ✕
          </button>

          {/* Header */}
          <div className="flex items-start justify-between gap-6 pr-10">
            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(14px,1.8vw,20px)] leading-[1.3]">
              {selectedAITitle}
            </p>
            <div className="shrink-0 text-right">
              <p className="font-['Press_Start_2P',sans-serif] text-[18px] text-[#0c0c0d]">AI</p>
              <p className="font-['Space_Mono',sans-serif] text-[12px] text-[#5b5b5b]">match</p>
            </div>
          </div>

          <p className="mt-4 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[15px] leading-[1.7]">
            Suggested based on your pitch & skills
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e]">
              pitch match
            </span>
          </div>

          {/* Live listings */}
          <div className="mt-7 border-t border-black/10 pt-6">
            <LiveListings
              jobTitle={simplifyTitle(selectedAITitle)}
              remote={answers.constraints.remote}
              location={answers.constraints.location}
              radiusMiles={answers.constraints.radiusMiles}
            />
          </div>

          {/* Action buttons */}
          <div className="mt-7 flex flex-col gap-3">
            {chosenJobs.some((j) => j.id === `ai::${selectedAITitle}`) ? (
              <div className="w-full rounded-xl border border-black/20 bg-black px-4 py-3 font-['Space_Mono',sans-serif] text-[14px] text-white text-center">
                ✓ Added to your job paths
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addJobPath({
                    id: `ai::${selectedAITitle}`,
                    title: selectedAITitle,
                    summary: "Suggested based on your pitch & skills",
                    payRange: [0, 0],
                    remoteFit: answers.constraints.remote === "remote" ? "remote" : answers.constraints.remote === "onsite" ? "onsite" : "hybrid",
                    score: 0,
                  });
                }}
                className="w-full rounded-xl border border-black bg-black text-white hover:bg-black/80 px-4 py-4 font-['Space_Mono',sans-serif] text-[14px] transition"
              >
                Choose this job path
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}