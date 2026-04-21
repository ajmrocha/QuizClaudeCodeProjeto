import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sampleN } from "@/lib/quiz/sampler";
import type { Question, QuestionDB, Track } from "@/lib/quiz/types";

const VALID_TRACKS: Track[] = ["beginner", "intermediate", "advanced"];
const VALID_SIZES = [30, 40, 50];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const track = searchParams.get("track") as Track;
  const size = parseInt(searchParams.get("size") ?? "30", 10);
  const locale = searchParams.get("locale") ?? "pt-BR";

  if (!VALID_TRACKS.includes(track)) {
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }
  if (!VALID_SIZES.includes(size)) {
    return NextResponse.json({ error: "Invalid size" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Select correct_answer for client-side validation (performance optimized)
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, track, category, statement_pt, statement_en, explanation_pt, explanation_en, source_url, weight, correct_answer"
    )
    .eq("track", track)
    .eq("active", true)
    .limit(size * 3);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }

  const seed = Date.now() % 2147483647;
  const sampled = sampleN(data as QuestionDB[], size, seed);

  const questions: Question[] = sampled.map((q) => ({
    id: q.id,
    track: q.track,
    category: q.category,
    statement: locale === "en" ? q.statement_en : q.statement_pt,
    explanation: locale === "en" ? q.explanation_en : q.explanation_pt,
    source_url: q.source_url,
    weight: q.weight,
    correct_answer: q.correct_answer,
  }));

  return NextResponse.json({ questions });
}
