"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  notes: string;
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

type SurveyCtx = {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  toggleSkill: (id: SkillId) => void;
  toggleInterest: (tag: string) => void;
  reset: () => void;
};

const SurveyContext = createContext<SurveyCtx | null>(null);

const STORAGE_KEY = "home-work.survey.answers.v1";

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Answers;
      // very light validation
      if (parsed?.constraints?.minWage) setAnswers(parsed);
    } catch {
      // ignore
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

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

  const value = useMemo(
    () => ({ answers, setAnswers, toggleSkill, toggleInterest, reset }),
    [answers]
  );

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within <SurveyProvider />");
  return ctx;
}