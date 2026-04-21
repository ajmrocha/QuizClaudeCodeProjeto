import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { qid, chosen } = await req.json();

    if (!qid) {
      return NextResponse.json({ error: "Missing question ID" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("questions")
      .select("correct_answer")
      .eq("id", qid)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const correct = chosen === data.correct_answer;

    return NextResponse.json({ correct });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
