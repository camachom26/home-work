"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import jobsData from "@/app/data/jobs.json";

export type SkillId =
  | "budgeting"
  | "scheduling"
  | "communication"
  | "organization"
  | "teaching"
  | "customerService"
  | "techComfort"
  | "writing"
  | "attentionToDetail"
  | "caretaking";

export type Constraint = {
  minWage: number;
  trainingBudget: "0-250" | "250-1000" | "1000-3000" | "3000+";
  schedule: "weekday" | "evening" | "weekend" | "flexible";
  remote: "remote" | "hybrid" | "onsite" | "no-pref";
  experience: "0-1" | "1-3" | "3-5" | "5+";
  location: string;
  radiusMiles: 10 | 25 | 50 | 0;
};

export type Answers = {
  skills: SkillId[];
  interests: string[];
  constraints: Constraint;
  notes: string; // Step-1 pitch lives here
};

const DEFAULT_ANSWERS: Answers = {
  skills: ["scheduling", "communication", "organization"],
  interests: ["Office/Admin", "Tech"],
  constraints: {
    minWage: 18,
    trainingBudget: "250-1000",
    schedule: "flexible",
    remote: "no-pref",
    experience: "1-3",
    location: "",
    radiusMiles: 25
  },
  notes: ""
};

export type Job = {
  id: string;
  title: string;
  summary: string;
  typicalTraining: string;
  payRange: [number, number];
  remoteFit: "remote" | "hybrid" | "onsite";
  weights: Partial<Record<SkillId, number>>;
  interestTags: string[];
};

export type JobRecommendation = {
  job: Job;
  score: number; // 0-100
  reasons: string[];
  gaps: string[];
};

type SurveyCtx = {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  toggleSkill: (id: SkillId) => void;
  toggleInterest: (tag: string) => void;
  reset: () => void;

  jobs: Job[];
  recommendations: JobRecommendation[];
};

const SurveyContext = createContext<SurveyCtx | null>(null);

const STORAGE_KEY = "home-work.survey.answers.v1";

/* ----------------------------
   Matching helpers
---------------------------- */

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

function recommendJobs(jobs: Job[], answers: Answers): JobRecommendation[] {
  const skillSet = new Set(answers.skills);
  const interestSet = new Set(answers.interests);

  return jobs
    .map((job) => {
      let skillScore = 0;
      let maxSkillScore = 0;
      const gaps: string[] = [];

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

      const reasons: string[] = [];
      if (skillPct >= 0.75) reasons.push("Strong skills alignment");
      else if (skillPct >= 0.5) reasons.push("Good skills alignment");
      else reasons.push("Some skills match; may need upskilling");

      if (interestPct >= 0.5) reasons.push("Matches your interests");
      if (wageOk) reasons.push("Pay range can meet your minimum");
      reasons.push(remotePref === "no-pref" ? "Flexible location fit" : `Location fit: ${job.remoteFit}`);

      return {
        job,
        score,
        reasons,
        gaps: Array.from(new Set(gaps)).slice(0, 3)
      };
    })
    .sort((a, b) => b.score - a.score);
}

/* ----------------------------
   NEW: Parse Step-1 pitch (answers.notes)
---------------------------- */

function parsePitch(notes: string): { skills: SkillId[]; interests: string[] } {
  const t = notes.toLowerCase();

  // keyword -> skill signals
  const skillRules: Array<[SkillId, RegExp]> = [
    ["budgeting", /\b(budget|budgets|expense|expenses|saving|savings|invoice|bills|money|finance|financial)\b/i],
    ["scheduling", /\b(schedule|scheduling|calendar|appointments|coordination|coordinating|plan|planning)\b/i],
    ["communication", /\b(communicat|follow[- ]?up|email|call|phone|liais|stakeholder|coordinate with)\b/i],
    ["organization", /\b(organize|organization|systems|workflow|process|tracking|manage tasks|task management)\b/i],
    ["teaching", /\b(teach|tutoring|mentor|train|training|explain|lesson)\b/i],
    ["customerService", /\b(customer|clients?|support|service|help desk|resolve issues|front desk)\b/i],
    ["techComfort", /\b(computer|software|apps?|excel|sheets|crm|database|tech|tools|online)\b/i],
    ["writing", /\b(write|writing|document|documentation|notes|reports?|copy|editing)\b/i],
    ["attentionToDetail", /\b(detail|accurate|accuracy|checklist|quality|qa|proofread)\b/i],
    ["caretaking", /\b(caregiving|caretaking|care[- ]?taking|childcare|eldercare|supporting family|nursing)\b/i]
  ];

  // keyword -> interest tags (match your existing interest taxonomy)
  const interestRules: Array<[string, RegExp]> = [
    ["Office/Admin", /\b(office|admin|administrative|assistant|reception|front desk|clerical)\b/i],
    ["Tech", /\b(tech|software|it\b|help desk|data|excel|sheets|crm|saas)\b/i],
    ["Healthcare", /\b(healthcare|clinic|hospital|medical|patient)\b/i],
    ["Education", /\b(school|classroom|teacher|students|education|tutor)\b/i],
    ["Retail/Service", /\b(retail|store|sales|cashier|restaurant|hospitality)\b/i],
    ["Nonprofit", /\b(nonprofit|community|volunteer|charity)\b/i]
  ];

  const skills: SkillId[] = [];
  for (const [id, re] of skillRules) {
    if (re.test(t)) skills.push(id);
  }

  const interests: string[] = [];
  for (const [tag, re] of interestRules) {
    if (re.test(t)) interests.push(tag);
  }

  return { skills, interests };
}

/* ----------------------------
   Provider
---------------------------- */

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded: authLoaded } = useAuth();
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [loaded, setLoaded] = useState(false);

  // Jobs source (today: JSON; later: swap to fetch)
  const jobs = useMemo(() => (jobsData as Job[]) ?? [], []);

  // Load: MongoDB if signed in, localStorage otherwise
  useEffect(() => {
    if (!authLoaded) return;

    // Reset before loading so stale data from a previous user isn't persisted
    setAnswers(DEFAULT_ANSWERS);
    setLoaded(false);

    if (userId) {
      fetch("/api/user/data")
        .then((r) => r.json())
        .then((data) => {
          if (data.surveyAnswers?.constraints?.minWage != null) {
            setAnswers(data.surveyAnswers);
          } else {
            loadFromLocalStorage();
          }
        })
        .catch(() => loadFromLocalStorage())
        .finally(() => setLoaded(true));
    } else {
      loadFromLocalStorage();
      setLoaded(true);
    }
  }, [authLoaded, userId]);

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Answers;
      if (parsed?.constraints?.minWage != null) setAnswers(parsed);
    } catch { /* ignore */ }
  }

  // Persist on change (after initial load)
  useEffect(() => {
    if (!loaded) return;

    if (userId) {
      fetch("/api/user/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyAnswers: answers }),
      }).catch(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* ignore */ }
      });
    } else {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* ignore */ }
    }
  }, [answers, loaded, userId]);

  const toggleSkill = (id: SkillId) => {
    setAnswers((prev) => {
      const set = new Set(prev.skills);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...prev, skills: Array.from(set) };
    });
  };

  const toggleInterest = (tag: string) => {
    setAnswers((prev) => {
      const set = new Set(prev.interests);
      set.has(tag) ? set.delete(tag) : set.add(tag);
      return { ...prev, interests: Array.from(set) };
    });
  };

  const reset = () => setAnswers(DEFAULT_ANSWERS);

  /**
   * NEW: whenever step-1 pitch changes, infer skills/interests and merge them in.
   * - does NOT remove anything the user already selected
   * - avoids infinite loops with a ref
   */
  const lastParsedRef = useRef<string>("");
  useEffect(() => {
    const notes = (answers.notes ?? "").trim();
    if (notes.length < 20) return; // ignore tiny blurbs
    if (notes === lastParsedRef.current) return;

    lastParsedRef.current = notes;

    const parsed = parsePitch(notes);
    if (parsed.skills.length === 0 && parsed.interests.length === 0) return;

    setAnswers((prev) => {
      // Only add; never remove.
      const nextSkills = new Set(prev.skills);
      const nextInterests = new Set(prev.interests);

      let changed = false;

      for (const s of parsed.skills) {
        if (!nextSkills.has(s)) {
          nextSkills.add(s);
          changed = true;
        }
      }

      for (const tag of parsed.interests) {
        if (!nextInterests.has(tag)) {
          nextInterests.add(tag);
          changed = true;
        }
      }

      if (!changed) return prev;

      return {
        ...prev,
        skills: Array.from(nextSkills),
        interests: Array.from(nextInterests)
      };
    });
  }, [answers.notes]);

  const recommendations = useMemo(() => recommendJobs(jobs, answers), [jobs, answers]);

  const value = useMemo(
    () => ({
      answers,
      setAnswers,
      toggleSkill,
      toggleInterest,
      reset,
      jobs,
      recommendations
    }),
    [answers, jobs, recommendations]
  );

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within <SurveyProvider />");
  return ctx;
}