export type Resource = {
  name: string;
  provider: string;
  cost: string;
  duration: string;
  url: string;
  badge?: string;
};

export type JobResourceEntry = {
  title: string;
  intro: string;
  resources: Resource[];
};

export const JOB_RESOURCES: Record<string, JobResourceEntry> = {
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

/**
 * Finds the closest matching job entry by word overlap between
 * an arbitrary title (e.g. from Gemini) and known job titles.
 */
export function findClosestJob(aiTitle: string): { id: string; entry: JobResourceEntry } {
  const words = aiTitle.toLowerCase().split(/\W+/).filter(Boolean);
  let bestId = "";
  let bestScore = 0;

  for (const [id, entry] of Object.entries(JOB_RESOURCES)) {
    const titleWords = entry.title.toLowerCase().split(/\W+/);
    const score = words.filter((w) => titleWords.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  const fallback = "office-admin";
  const id = bestId || fallback;
  return { id, entry: JOB_RESOURCES[id] };
}
