import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("results")
    .select(
      "id, nickname, track, round_size, correct_count, score, percentage, duration_ms, badge_tier, timer_enabled, question_ids, answers, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch questions for review (without correct_answer)
  const { data: questions } = await supabase
    .from("questions")
    .select(
      "id, track, category, statement_pt, statement_en, explanation_pt, explanation_en, source_url, weight"
    )
    .in("id", data.question_ids as string[]);

  return NextResponse.json({ ...data, questions: questions ?? [] });
}
