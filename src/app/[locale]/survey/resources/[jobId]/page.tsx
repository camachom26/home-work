"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SurveyShell, SecondaryButton } from "@/app/components/survey/SurveyShell";
import { useJobPaths } from "@/app/components/survey/JobPathsProvider";
import { JOB_RESOURCES } from "@/app/data/jobResources";

export default function ResourcesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get("from") === "dashboard";
  const { savedResources, addTrainingResource, removeTrainingResource } = useJobPaths();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : (params.jobId ?? "");
  const data = JOB_RESOURCES[jobId];

  const backLabel = fromDashboard ? "← Back to dashboard" : "← Back to results";
  const backAction = fromDashboard ? () => router.push("../../dashboard") : () => router.back();

  if (!data) {
    return (
      <SurveyShell title="Survey → Job Match" subtitle="Resources not found." step={4} total={4}>
        <SecondaryButton onClick={backAction}>{backLabel}</SecondaryButton>
      </SurveyShell>
    );
  }

  if (fromDashboard) {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-8 pt-10 md:pt-14 pb-10 md:pb-14">
        <div className="rounded-[28px] bg-white/80 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-10">
          <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(16px,2vw,28px)] leading-[1.2]">
            {data.title}
          </p>
          <p className="mt-4 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.6] max-w-2xl">
            {data.intro}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {data.resources.map((r) => {
              const resourceId = `${jobId}::${r.name}`;
              const isSaved = savedResources.some((s) => s.id === resourceId);
              return (
                <div
                  key={r.name}
                  className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.07)] flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[14px] leading-[1.4]">
                      {r.name}
                    </p>
                    {r.badge && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[11px] text-[#1e1e1e] whitespace-nowrap">
                        {r.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{r.provider}</p>
                    <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{r.cost}</p>
                    <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{r.duration}</p>
                  </div>
                  <div className="mt-auto flex flex-col sm:flex-row gap-2 pt-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto rounded-full border border-black/30 bg-white/70 hover:bg-white px-5 py-2 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e] text-center transition"
                    >
                      View →
                    </a>
                    {isSaved ? (
                      <button
                        type="button"
                        onClick={() => removeTrainingResource(resourceId)}
                        className="w-full sm:w-auto rounded-full px-5 py-2 font-['Space_Mono',sans-serif] text-[13px] bg-black/10 text-[#4b4b4b] border border-black/10 transition hover:bg-black/15"
                      >
                        ✓ Added to Training
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addTrainingResource({ id: resourceId, name: r.name, provider: r.provider, cost: r.cost, duration: r.duration, url: r.url, badge: r.badge, jobTitle: data.title })}
                        className="w-full sm:w-auto rounded-full px-5 py-2 font-['Space_Mono',sans-serif] text-[13px] bg-[#1e1e1e] hover:bg-black text-white transition"
                      >
                        Add to Training
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <SecondaryButton onClick={backAction}>{backLabel}</SecondaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SurveyShell
      title="Survey → Job Match"
      subtitle={`Training resources: ${data.title}`}
      step={4}
      total={4}
    >
      <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.6] max-w-2xl">
        {data.intro}
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {data.resources.map((r) => {
          const resourceId = `${jobId}::${r.name}`;
          const isSaved = savedResources.some((s) => s.id === resourceId);

          return (
            <div
              key={r.name}
              className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.07)] flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[14px] leading-[1.4]">
                  {r.name}
                </p>
                {r.badge && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-black/10 font-['Space_Mono',sans-serif] text-[11px] text-[#1e1e1e] whitespace-nowrap">
                    {r.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{r.provider}</p>
                <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{r.cost}</p>
                <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px]">{r.duration}</p>
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto rounded-full border border-black/30 bg-white/70 hover:bg-white px-5 py-2 font-['Space_Mono',sans-serif] text-[13px] text-[#1e1e1e] text-center transition"
                >
                  View →
                </a>
                {isSaved ? (
                  <button
                    type="button"
                    onClick={() => removeTrainingResource(resourceId)}
                    className="w-full sm:w-auto rounded-full px-5 py-2 font-['Space_Mono',sans-serif] text-[13px] bg-black/10 text-[#4b4b4b] border border-black/10 transition hover:bg-black/15"
                  >
                    ✓ Added to Training
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      addTrainingResource({
                        id: resourceId,
                        name: r.name,
                        provider: r.provider,
                        cost: r.cost,
                        duration: r.duration,
                        url: r.url,
                        badge: r.badge,
                        jobTitle: data.title,
                      })
                    }
                    className="w-full sm:w-auto rounded-full px-5 py-2 font-['Space_Mono',sans-serif] text-[13px] bg-[#1e1e1e] hover:bg-black text-white transition"
                  >
                    Add to Training
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <SecondaryButton onClick={backAction}>{backLabel}</SecondaryButton>
      </div>
    </SurveyShell>
  );
}
