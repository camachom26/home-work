"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ChosenJob = {
  id: string;
  title: string;
  summary: string;
  payRange: [number, number];
  remoteFit: string;
  score: number;
  addedAt: string;
};

type JobPathsCtx = {
  chosenJobs: ChosenJob[];
  addJobPath: (job: Omit<ChosenJob, "addedAt">) => void;
  removeJobPath: (id: string) => void;
};

const JobPathsContext = createContext<JobPathsCtx | null>(null);

const STORAGE_KEY = "home-work.job-paths.v1";

export function JobPathsProvider({ children }: { children: React.ReactNode }) {
  const [chosenJobs, setChosenJobs] = useState<ChosenJob[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChosenJobs(JSON.parse(raw) as ChosenJob[]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chosenJobs));
    } catch {
      // ignore
    }
  }, [chosenJobs]);

  const addJobPath = (job: Omit<ChosenJob, "addedAt">) => {
    setChosenJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev;
      return [...prev, { ...job, addedAt: new Date().toISOString() }];
    });
  };

  const removeJobPath = (id: string) => {
    setChosenJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const value = useMemo(
    () => ({ chosenJobs, addJobPath, removeJobPath }),
    [chosenJobs]
  );

  return <JobPathsContext.Provider value={value}>{children}</JobPathsContext.Provider>;
}

export function useJobPaths() {
  const ctx = useContext(JobPathsContext);
  if (!ctx) throw new Error("useJobPaths must be used within <JobPathsProvider />");
  return ctx;
}
