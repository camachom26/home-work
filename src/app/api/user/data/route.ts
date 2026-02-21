import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { ChosenJob, SavedResource } from "@/app/components/survey/JobPathsProvider";
import type { Answers } from "@/app/components/survey/SurveyProvider";

const COLLECTION = "user_data";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ chosenJobs: [], savedResources: [], surveyAnswers: null });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const doc = await db.collection(COLLECTION).findOne({ userId });

  return NextResponse.json({
    chosenJobs: (doc?.chosenJobs as ChosenJob[]) ?? [],
    savedResources: (doc?.savedResources as SavedResource[]) ?? [],
    surveyAnswers: (doc?.surveyAnswers as Answers) ?? null,
  });
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    chosenJobs?: ChosenJob[];
    savedResources?: SavedResource[];
    surveyAnswers?: Answers;
  };

  // Only $set fields that were sent — prevents providers from clobbering each other
  const update: Record<string, unknown> = { userId, updatedAt: new Date() };
  if (body.chosenJobs !== undefined) update.chosenJobs = body.chosenJobs;
  if (body.savedResources !== undefined) update.savedResources = body.savedResources;
  if (body.surveyAnswers !== undefined) update.surveyAnswers = body.surveyAnswers;

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  await db.collection(COLLECTION).updateOne(
    { userId },
    { $set: update },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
