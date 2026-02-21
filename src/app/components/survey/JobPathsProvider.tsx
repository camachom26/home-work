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

export type SavedResource = {
  id: string;
  name: string;
  provider: string;
  cost: string;
  duration: string;
  url: string;
  badge?: string;
  jobTitle: string;
  addedAt: string;
};

type JobPathsCtx = {
  chosenJobs: ChosenJob[];
  addJobPath: (job: Omit<ChosenJob, "addedAt">) => void;
  removeJobPath: (id: string) => void;
  savedResources: SavedResource[];
  addTrainingResource: (resource: Omit<SavedResource, "addedAt">) => void;
  removeTrainingResource: (id: string) => void;
};

const JobPathsContext = createContext<JobPathsCtx | null>(null);

const JOBS_KEY = "home-work.job-paths.v1";
const RESOURCES_KEY = "home-work.training-resources.v1";

export function JobPathsProvider({ children }: { children: React.ReactNode }) {
  const [chosenJobs, setChosenJobs] = useState<ChosenJob[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOBS_KEY);
      if (raw) setChosenJobs(JSON.parse(raw) as ChosenJob[]);
    } catch { /* ignore */ }
    try {
      const raw = localStorage.getItem(RESOURCES_KEY);
      if (raw) setSavedResources(JSON.parse(raw) as SavedResource[]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(JOBS_KEY, JSON.stringify(chosenJobs)); } catch { /* ignore */ }
  }, [chosenJobs]);

  useEffect(() => {
    try { localStorage.setItem(RESOURCES_KEY, JSON.stringify(savedResources)); } catch { /* ignore */ }
  }, [savedResources]);

  const addJobPath = (job: Omit<ChosenJob, "addedAt">) => {
    setChosenJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev;
      return [...prev, { ...job, addedAt: new Date().toISOString() }];
    });
  };

  const removeJobPath = (id: string) => {
    setChosenJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const addTrainingResource = (resource: Omit<SavedResource, "addedAt">) => {
    setSavedResources((prev) => {
      if (prev.some((r) => r.id === resource.id)) return prev;
      return [...prev, { ...resource, addedAt: new Date().toISOString() }];
    });
  };

  const removeTrainingResource = (id: string) => {
    setSavedResources((prev) => prev.filter((r) => r.id !== id));
  };

  const value = useMemo(
    () => ({ chosenJobs, addJobPath, removeJobPath, savedResources, addTrainingResource, removeTrainingResource }),
    [chosenJobs, savedResources]
  );

  return <JobPathsContext.Provider value={value}>{children}</JobPathsContext.Provider>;
}

export function useJobPaths() {
  const ctx = useContext(JobPathsContext);
  if (!ctx) throw new Error("useJobPaths must be used within <JobPathsProvider />");
  return ctx;
}
