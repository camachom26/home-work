import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { ChosenJob, SavedResource } from "@/app/components/survey/JobPathsProvider";

const COLLECTION = "user_data";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ chosenJobs: [], savedResources: [] });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const doc = await db.collection(COLLECTION).findOne({ userId });

  return NextResponse.json({
    chosenJobs: (doc?.chosenJobs as ChosenJob[]) ?? [],
    savedResources: (doc?.savedResources as SavedResource[]) ?? [],
  });
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chosenJobs, savedResources } = (await req.json()) as {
    chosenJobs: ChosenJob[];
    savedResources: SavedResource[];
  };

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  await db.collection(COLLECTION).updateOne(
    { userId },
    { $set: { userId, chosenJobs, savedResources, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
