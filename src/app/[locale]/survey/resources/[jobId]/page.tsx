"use client";

import { useParams, useRouter } from "next/navigation";
import { SurveyShell, SecondaryButton } from "@/app/components/survey/SurveyShell";
import { useJobPaths } from "@/app/components/survey/JobPathsProvider";

type Resource = {
  name: string;
  provider: string;
  cost: string;
  duration: string;
  url: string;
  badge?: string;
};

const JOB_RESOURCES: Record<string, { title: string; intro: string; resources: Resource[] }> = {
  "front-desk": {
    title: "Front Desk Receptionist",
    intro: "These courses and certifications will help you build the scheduling, communication, and software skills front desk roles require.",
    resources: [
      {
        name: "Customer Service Fundamentals",
        provider: "Coursera (Google)",
        cost: "Free to audit",
        duration: "~6 hours",
        url: "https://www.coursera.org/learn/customer-service-fundamentals",
        badge: "Free",
      },
      {
        name: "Microsoft Office Specialist (MOS)",
        provider: "Certiport / Microsoft",
        cost: "~$100 exam fee",
        duration: "Self-study",
        url: "https://certiport.pearsonvue.com/Certifications/Microsoft/MOS/Overview",
        badge: "Recognized",
      },
      {
        name: "Administrative & Clerical Skills",
        provider: "Alison",
        cost: "Free",
        duration: "2–3 hours",
        url: "https://alison.com/course/administrative-and-clerical-skills",
        badge: "Free",
      },
      {
        name: "Medical Receptionist Certificate",
        provider: "Penn Foster",
        cost: "~$749",
        duration: "4–6 months",
        url: "https://www.pennfoster.edu/programs/healthcare/medical-administrative-assistant-career-diploma",
      },
    ],
  },
  "customer-service": {
    title: "Customer Service Representative",
    intro: "Strong communication and CRM tool knowledge are what employers look for. These free certifications are widely recognized.",
    resources: [
      {
        name: "HubSpot Customer Service Certification",
        provider: "HubSpot Academy",
        cost: "Free",
        duration: "~6 hours",
        url: "https://academy.hubspot.com/courses/customer-service",
        badge: "Free + Certificate",
      },
      {
        name: "Customer Service Excellence",
        provider: "Alison",
        cost: "Free",
        duration: "2–3 hours",
        url: "https://alison.com/course/customer-service-excellence",
        badge: "Free",
      },
      {
        name: "Google Career Certificates",
        provider: "Coursera (Google)",
        cost: "~$49/month",
        duration: "3–6 months",
        url: "https://grow.google/certificates/",
        badge: "Job-ready",
      },
      {
        name: "Salesforce Trailhead (Service Cloud)",
        provider: "Salesforce",
        cost: "Free",
        duration: "Self-paced",
        url: "https://trailhead.salesforce.com/",
        badge: "Free",
      },
    ],
  },
  "retail-associate": {
    title: "Retail Sales Associate",
    intro: "Most retail roles offer on-the-job training, but these certifications can help you stand out and move into lead or management roles faster.",
    resources: [
      {
        name: "Retail Industry Fundamentals",
        provider: "NRF Foundation / Coursera",
        cost: "~$95",
        duration: "Self-paced",
        url: "https://nrffoundation.org/credentials",
        badge: "Industry standard",
      },
      {
        name: "Customer Service & Sales",
        provider: "NRF Foundation",
        cost: "~$95",
        duration: "Self-paced",
        url: "https://nrffoundation.org/credentials",
      },
      {
        name: "Retail Management Fundamentals",
        provider: "Alison",
        cost: "Free",
        duration: "~3 hours",
        url: "https://alison.com/course/retail-management-fundamentals",
        badge: "Free",
      },
      {
        name: "Square Point of Sale Training",
        provider: "Square",
        cost: "Free",
        duration: "~1 hour",
        url: "https://squareup.com/us/en/point-of-sale",
        badge: "Free",
      },
    ],
  },
  "office-admin": {
    title: "Office Administrative Assistant",
    intro: "Office admin roles value software proficiency and organization skills. These certifications are frequently listed in job postings.",
    resources: [
      {
        name: "Microsoft Office Specialist (MOS)",
        provider: "Certiport / Microsoft",
        cost: "~$100 exam fee",
        duration: "Self-study",
        url: "https://certiport.pearsonvue.com/Certifications/Microsoft/MOS/Overview",
        badge: "Most recognized",
      },
      {
        name: "Google Workspace Certification",
        provider: "Google",
        cost: "~$300 exam fee",
        duration: "Self-study",
        url: "https://workspace.google.com/intl/en/certification/",
        badge: "Cloud-focused",
      },
      {
        name: "Administrative Professional Certificate",
        provider: "IAAP",
        cost: "Varies",
        duration: "Self-paced",
        url: "https://www.iaap-hq.org/page/PACE",
      },
      {
        name: "Office Administration Diploma",
        provider: "Alison",
        cost: "Free",
        duration: "6–10 hours",
        url: "https://alison.com/course/diploma-in-office-administration",
        badge: "Free",
      },
    ],
  },
  "bookkeeper": {
    title: "Bookkeeper",
    intro: "Bookkeeping roles increasingly require QuickBooks or Xero fluency. The NACPB certification is recognized by small-business employers nationwide.",
    resources: [
      {
        name: "QuickBooks Online ProAdvisor",
        provider: "Intuit",
        cost: "Free",
        duration: "Self-paced",
        url: "https://quickbooks.intuit.com/accountants/proadvisor/",
        badge: "Free + Recognized",
      },
      {
        name: "Bookkeeper Certification (CB)",
        provider: "NACPB",
        cost: "~$100",
        duration: "Self-study",
        url: "https://www.nacpb.org/bookkeeper-certification/",
        badge: "Industry standard",
      },
      {
        name: "Bookkeeping Basics",
        provider: "Coursera / UC Irvine",
        cost: "Free to audit",
        duration: "~4 weeks",
        url: "https://www.coursera.org/learn/bookkeeping-basics",
        badge: "Free",
      },
      {
        name: "Accounting Fundamentals",
        provider: "Alison",
        cost: "Free",
        duration: "4–6 hours",
        url: "https://alison.com/course/accounting-fundamentals",
        badge: "Free",
      },
    ],
  },
  "teacher-aide": {
    title: "Teacher Aide",
    intro: "Para-educator roles often require a background check and some coursework. The CDA is the most portable credential if you want to work with young children.",
    resources: [
      {
        name: "Child Development Associate (CDA)",
        provider: "Council for Professional Recognition",
        cost: "~$425",
        duration: "6+ months",
        url: "https://www.cdacouncil.org/",
        badge: "Most recognized",
      },
      {
        name: "ParaPro Assessment Prep",
        provider: "ETS",
        cost: "~$55 exam fee",
        duration: "Self-study",
        url: "https://www.ets.org/parapro.html",
      },
      {
        name: "Teaching & Learning Fundamentals",
        provider: "Coursera",
        cost: "Free to audit",
        duration: "~4 weeks",
        url: "https://www.coursera.org/learn/teach",
        badge: "Free",
      },
      {
        name: "Supporting Children with Special Needs",
        provider: "Alison",
        cost: "Free",
        duration: "2–4 hours",
        url: "https://alison.com/course/understanding-special-education",
        badge: "Free",
      },
    ],
  },
};

export default function ResourcesPage() {
  const params = useParams();
  const router = useRouter();
  const { savedResources, addTrainingResource, removeTrainingResource } = useJobPaths();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : (params.jobId ?? "");
  const data = JOB_RESOURCES[jobId];

  if (!data) {
    return (
      <SurveyShell title="Survey → Job Match" subtitle="Resources not found." step={4} total={4}>
        <SecondaryButton onClick={() => router.back()}>← Back to results</SecondaryButton>
      </SurveyShell>
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
        <SecondaryButton onClick={() => router.back()}>← Back to results</SecondaryButton>
      </div>
    </SurveyShell>
  );
}
