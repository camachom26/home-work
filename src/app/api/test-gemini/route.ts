import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  // ✅ Match what the client actually sends
  const { userPitch, skills, interests, constraints } = await req.json();

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    You are a career counselor helping someone return to the workforce after homemaking.
    
    Their pitch: "${userPitch ?? "No pitch provided"}"
    Their self-identified skills: ${(skills ?? []).join(", ")}
    Their interests: ${(interests ?? []).join(", ")}
    Their constraints:
      - Min wage: $${constraints?.minWage ?? "unspecified"}/hr
      - Schedule preference: ${constraints?.schedule ?? "flexible"}
      - Work preference: ${constraints?.remote ?? "no preference"}
      - Years of experience: ${constraints?.experience ?? "unspecified"}
      - Location: ${constraints?.location ?? "unspecified"}
    
    Based on their pitch and interests, determine what job titles would be the best fit for them right now.
    Consider adjacent opportunities that could leverage their existing skills while allowing for growth.
    Return a JSON array of exactly 8 job titles ranked from best match to adjacent opportunity.
    Only return raw JSON, no markdown, no explanation.
    Format: ["Job Title 1", "Job Title 2", ...]
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    // Strip accidental markdown fences if Gemini adds them
    const clean = text.replace(/^```json|^```|```$/gm, "").trim();
    const jobs = JSON.parse(clean);
    // ✅ Return as jobTitles to match what the client expects
    return NextResponse.json({ jobTitles: jobs });
  } catch {
    return NextResponse.json({ error: "Failed to parse Gemini response", raw: text }, { status: 500 });
  }
}