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

  if (!query) {
    return NextResponse.json({ error: "query param required" }, { status: 400 });
  }

  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey || apiKey === "REPLACE_WITH_YOUR_RAPIDAPI_KEY") {
    return NextResponse.json({ error: "JSEARCH_API_KEY not configured" }, { status: 503 });
  }

  const params = new URLSearchParams({
    query,
    page: "1",
    num_pages: "1",
    date_posted: "month",
  });
  if (remote === "remote") params.set("remote_jobs_only", "true");

  const res = await fetch(
    `https://jsearch27.p.rapidapi.com/search?${params.toString()}`,
    {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch27.p.rapidapi.com",
      },
      next: { revalidate: 3600 }, // cache for 1 hour to save quota
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `JSearch returned ${res.status}` },
      { status: 502 }
    );
  }

  const data = await res.json();

  const jobs: LiveJob[] = (data.data ?? []).slice(0, 5).map(
    (j: Record<string, unknown>) => ({
      id: j.job_id as string,
      title: j.job_title as string,
      company: j.employer_name as string,
      location:
        j.job_city && j.job_state
          ? `${j.job_city}, ${j.job_state}`
          : j.job_is_remote
            ? "Remote"
            : (j.job_country as string) ?? "—",
      isRemote: Boolean(j.job_is_remote),
      applyUrl: (j.job_apply_link as string) ?? "#",
      publisher: (j.job_publisher as string) ?? "",
      postedAt: (j.job_posted_at_datetime_utc as string) ?? null,
    })
  );

  return NextResponse.json({ jobs });
}
