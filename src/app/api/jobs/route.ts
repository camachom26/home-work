import { NextRequest, NextResponse } from "next/server";

export type LiveJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  applyUrl: string;
  publisher: string;
  postedAt: string | null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query");
  const remote = searchParams.get("remote");
  const location = searchParams.get("location") ?? "";
  const radiusMiles = searchParams.get("radiusMiles") ?? "0";

  if (!query) {
    return NextResponse.json({ error: "query param required" }, { status: 400 });
  }

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    return NextResponse.json({ error: "ADZUNA_APP_ID or ADZUNA_APP_KEY not configured" }, { status: 503 });
  }

  // For remote preference, append "remote" to the search so Adzuna surfaces remote listings
  const what = remote === "remote" ? `${query} remote` : query;

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what,
    results_per_page: "10", // fetch more for title filtering
    sort_by: "date",
  });

  if (location) params.set("where", location);

  // Adzuna uses km; convert miles → km
  const radiusNum = parseInt(radiusMiles, 10);
  if (radiusNum > 0) {
    params.set("distance", String(Math.round(radiusNum * 1.60934)));
  }

  const res = await fetch(
    `https://api.adzuna.com/v1/api/jobs/us/search/1?${params.toString()}`,
    { next: { revalidate: 3600 } } // cache 1 hour to conserve daily quota
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`Adzuna ${res.status}:`, body);
    return NextResponse.json(
      { error: `Adzuna returned ${res.status}` },
      { status: 502 }
    );
  }

  const data = await res.json();

  type AdzunaJob = {
    id: string;
    title: string;
    company?: { display_name?: string };
    location?: { display_name?: string };
    redirect_url?: string;
    created?: string;
  };

  const allJobs: LiveJob[] = (data.results ?? []).map((j: AdzunaJob) => {
    const titleLower = (j.title ?? "").toLowerCase();
    return {
      id: String(j.id),
      title: j.title ?? "",
      company: j.company?.display_name ?? "Unknown",
      location: j.location?.display_name ?? "—",
      isRemote: titleLower.includes("remote"),
      applyUrl: j.redirect_url ?? "#",
      publisher: "Adzuna",
      postedAt: j.created ?? null,
    };
  });

  // Title relevance: 4-char stems from words ≥ 4 chars.
  // "Front" → "fron", "Desk" → "desk"
  // Only the primary segment (before " - ") is checked.
  const queryStems = query
    .toLowerCase()
    .split(/[\s/]+/)
    .filter((w) => w.length >= 4)
    .map((w) => w.slice(0, 4));
  const isTitleRelevant = (title: string) => {
    if (queryStems.length === 0) return true;
    const primary = title.split(/\s*[-–]\s*/)[0].toLowerCase();
    return queryStems.some((stem) => primary.includes(stem));
  };

  const jobs = allJobs
    .filter((j) => isTitleRelevant(j.title))
    .slice(0, 5);

  return NextResponse.json({ jobs });
}
