import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { calculateScore } from "@/lib/quiz/scoring";
import type { Answer, PostResultRequest, PostResultResponse, Track } from "@/lib/quiz/types";

const VALID_TRACKS: Track[] = ["beginner", "intermediate", "advanced"];
const VALID_SIZES = [30, 40, 50];
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(ip + salt).digest("hex");
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  let body: PostResultRequest;
  try {
    body = await req.json();
    console.log("Received payload:", body);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { nickname, track, roundSize, timerEnabled, durationMs, answers } = body;

  // Validate inputs
  if (!nickname || !/^[A-Za-z0-9_-]{3,20}$/.test(nickname)) {
    console.error("Validation failed: Invalid nickname", { nickname });
    return NextResponse.json({ error: "Invalid nickname" }, { status: 400 });
  }
  if (!VALID_TRACKS.includes(track)) {
    console.error("Validation failed: Invalid track", { track });
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }
  if (!VALID_SIZES.includes(roundSize)) {
    console.error("Validation failed: Invalid round size", { roundSize });
    return NextResponse.json({ error: "Invalid round size" }, { status: 400 });
  }
  if (!Array.isArray(answers) || answers.length === 0) {
    console.error("Validation failed: No answers provided", { answersLength: answers?.length });
    return NextResponse.json({ error: "No answers provided" }, { status: 400 });
  }
  if (!answers.every((a) => typeof a.qid === "string" && typeof a.chosen === "boolean")) {
    console.error("Validation failed: Invalid answer format", { answers });
    return NextResponse.json({ error: "Invalid answer format" }, { status: 400 });
  }

  if (process.env.IP_HASH_SALT === "change-me-to-random-string") {
    console.error("SECURITY: IP_HASH_SALT is default value — change before deploying");
  }

  const supabase = createServiceClient();
  const ipHash = hashIp(getClientIp(req));

  // Rate limiting — note: check+insert are not atomic; concurrent bursts may slip through
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error: rlErr } = await supabase
    .from("results")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if (rlErr) {
    console.error("Rate limit check failed:", rlErr);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  // Fetch correct answers server-side
  const questionIds = answers.map((a: Answer) => a.qid);
  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("id, correct_answer, weight")
    .in("id", questionIds);

  if (qErr || !questions) {
    console.error("Failed to fetch questions:", qErr);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }

  const scoringQuestions = questions.map((q) => ({
    id: q.id,
    correctAnswer: q.correct_answer as boolean,
    weight: q.weight as number,
  }));

  const { score, correctCount, percentage, badgeTier, answers: answerResults } =
    calculateScore(answers, scoringQuestions, answers.length);

  // Persist result
  const { data: result, error: insertErr } = await supabase
    .from("results")
    .insert({
      nickname,
      track,
      round_size: roundSize,
      correct_count: correctCount,
      score,
      percentage: Math.round(percentage * 100) / 100,
      duration_ms: durationMs,
      badge_tier: badgeTier,
      timer_enabled: timerEnabled,
      question_ids: questionIds,
      answers: answerResults,
      ip_hash: ipHash,
    })
    .select("id")
    .single();

  if (insertErr || !result) {
    console.error("Failed to save result:", insertErr);
    return NextResponse.json({ error: "Failed to save result", details: insertErr }, { status: 500 });
  }

  // Get ranking position
  const { count: rankPosition, error: rankErr } = await supabase
    .from("results")
    .select("*", { count: "exact", head: true })
    .eq("track", track)
    .or(`score.gt.${score},and(score.eq.${score},duration_ms.lt.${durationMs})`);
  
  if (rankErr) {
    console.error("Failed to get rank position:", rankErr);
  }

  const response: PostResultResponse = {
    id: result.id,
    score,
    percentage,
    correctCount,
    badgeTier,
    rankingPosition: rankPosition !== null ? rankPosition + 1 : null,
    answers: answerResults,
  };

  return NextResponse.json(response, { status: 201 });
}
