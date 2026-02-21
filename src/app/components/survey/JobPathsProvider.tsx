"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";

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

const LS_JOBS = "home-work.job-paths.v1";
const LS_RESOURCES = "home-work.training-resources.v1";

export function JobPathsProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const [chosenJobs, setChosenJobs] = useState<ChosenJob[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load data: MongoDB if signed in, localStorage otherwise
  useEffect(() => {
    if (!isLoaded) return;

    // Reset before loading so stale data from a previous user isn't persisted
    setChosenJobs([]);
    setSavedResources([]);
    setLoaded(false);

    if (userId) {
      fetch("/api/user/data")
        .then((r) => r.json())
        .then((data) => {
          setChosenJobs(data.chosenJobs ?? []);
          setSavedResources(data.savedResources ?? []);
        })
        .catch(() => loadFromLocalStorage())
        .finally(() => setLoaded(true));
    } else {
      loadFromLocalStorage();
      setLoaded(true);
    }
  }, [isLoaded, userId]);

  function loadFromLocalStorage() {
    try {
      const jobs = localStorage.getItem(LS_JOBS);
      if (jobs) setChosenJobs(JSON.parse(jobs));
    } catch { /* ignore */ }
    try {
      const resources = localStorage.getItem(LS_RESOURCES);
      if (resources) setSavedResources(JSON.parse(resources));
    } catch { /* ignore */ }
  }

  // Persist whenever data changes (after initial load)
  useEffect(() => {
    if (!loaded) return;

    if (userId) {
      fetch("/api/user/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chosenJobs, savedResources }),
      }).catch(() => saveToLocalStorage());
    } else {
      saveToLocalStorage();
    }
  }, [chosenJobs, savedResources, loaded]);

  function saveToLocalStorage() {
    try { localStorage.setItem(LS_JOBS, JSON.stringify(chosenJobs)); } catch { /* ignore */ }
    try { localStorage.setItem(LS_RESOURCES, JSON.stringify(savedResources)); } catch { /* ignore */ }
  }

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
