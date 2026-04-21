import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { Track } from "@/lib/quiz/types";

const VALID_TRACKS: Track[] = ["beginner", "intermediate", "advanced"];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const track = searchParams.get("track") as Track;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 100);

  if (!VALID_TRACKS.includes(track)) {
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("results")
    .select("id, nickname, track, score, percentage, duration_ms, badge_tier, created_at")
    .eq("track", track)
    .order("score", { ascending: false })
    .order("duration_ms", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch ranking" }, { status: 500 });
  }

  return NextResponse.json({ entries: data }, {
    headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
  });
}
