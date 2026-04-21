import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { ResultClient } from "./ResultClient";
import type { Result } from "@/lib/quiz/types";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("results")
    .select("nickname, track, score, percentage, badge_tier")
    .eq("id", id)
    .single();

  if (!data) return { title: "Claude Code Quiz" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const badgeImageUrl = data.badge_tier
    ? `${siteUrl}/api/badge/${data.badge_tier}?nickname=${encodeURIComponent(data.nickname)}&score=${Math.round(data.percentage)}&track=${data.track}`
    : undefined;

  return {
    title: `${data.nickname} — ${Math.round(data.percentage)}% | Claude Code Quiz`,
    description: `${data.nickname} scored ${Math.round(data.percentage)}% on the ${data.track} track.`,
    openGraph: {
      title: `${data.nickname} — ${Math.round(data.percentage)}%`,
      description: `Claude Code Quiz · ${data.track} track`,
      images: badgeImageUrl ? [{ url: badgeImageUrl, width: 1200, height: 630 }] : [],
      url: `${siteUrl}/${locale}/resultado/${id}`,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function ResultadoPage({ params }: Props) {
  const { id, locale } = await params;
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("results")
    .select(
      "id, nickname, track, round_size, correct_count, score, percentage, duration_ms, badge_tier, timer_enabled, question_ids, answers, created_at"
    )
    .eq("id", id)
    .single();

  if (!data) notFound();

  // Get ranking position
  const { count } = await supabase
    .from("results")
    .select("*", { count: "exact", head: true })
    .eq("track", data.track)
    .or(
      `score.gt.${data.score},and(score.eq.${data.score},duration_ms.lt.${data.duration_ms})`
    );

  const rankingPosition = count !== null ? count + 1 : null;

  return (
    <ResultClient
      result={data as Result}
      rankingPosition={rankingPosition}
      locale={locale}
    />
  );
}
