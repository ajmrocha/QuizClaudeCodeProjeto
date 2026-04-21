"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/shared/ShareButtons";
import type { BadgeTier, Result } from "@/lib/quiz/types";

const BADGE_COLORS: Record<BadgeTier, string> = {
  bronze: "text-amber-600",
  silver: "text-slate-400",
  gold: "text-yellow-400",
};

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${s}s`;
}

interface ResultClientProps {
  result: Result;
  rankingPosition: number | null;
  locale: string;
}

export function ResultClient({ result, rankingPosition, locale }: ResultClientProps) {
  const t = useTranslations("result");
  const router = useRouter();

  const pct = Math.round(result.percentage);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const resultUrl = `${siteUrl}/${locale}/resultado/${result.id}`;

  function handlePracticeErrors() {
    const wrongAnswers = (result.answers as Array<{ qid: string; correct: boolean }>)
      .filter((a) => !a.correct)
      .map((a) => a.qid);
    if (wrongAnswers.length === 0) return;
    sessionStorage.setItem("practice_error_ids", wrongAnswers.join(","));
    router.push(`/${locale}/quiz`);
  }

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12 gap-8 max-w-lg mx-auto w-full">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      {/* Score card */}
      <div className="w-full rounded-xl border p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t("score_label")}</span>
          <span className="text-2xl font-bold">{result.score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t("percentage_label")}</span>
          <span className="text-2xl font-bold">{pct}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t("time_label")}</span>
          <span className="font-medium">{formatTime(result.duration_ms)}</span>
        </div>
        {rankingPosition && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ranking</span>
            <span className="font-medium">{t("ranking_position", { position: rankingPosition })}</span>
          </div>
        )}
      </div>

      {/* Badge */}
      {result.badge_tier ? (
        <div className="flex flex-col items-center gap-2">
          <div
            className={`text-6xl font-black ${BADGE_COLORS[result.badge_tier]}`}
            aria-label={t(`badge_${result.badge_tier}` as "badge_bronze" | "badge_silver" | "badge_gold")}
          >
            ★
          </div>
          <span className={`text-lg font-semibold ${BADGE_COLORS[result.badge_tier]}`}>
            {t(`badge_${result.badge_tier}` as "badge_bronze" | "badge_silver" | "badge_gold")}
          </span>
        </div>
      ) : (
        <p className="text-muted-foreground text-center">{t("no_badge")}</p>
      )}

      {/* Share */}
      <ShareButtons resultUrl={resultUrl} result={result} />

      {/* Actions */}
      <div className="w-full flex flex-col gap-3">
        <Button variant="outline" onClick={() => router.push(`/${locale}/revisao?id=${result.id}`)}>
          {t("review_button")}
        </Button>
        <Button
          variant="outline"
          onClick={handlePracticeErrors}
          disabled={!(result.answers as Array<{ correct: boolean }>).some((a) => !a.correct)}
        >
          {t("practice_errors_button")}
        </Button>
        <Button variant="outline" onClick={() => router.push(`/${locale}/ranking`)}>
          {t("ranking_button")}
        </Button>
        <Button onClick={() => router.push(`/${locale}`)}>
          {t("play_again_button")}
        </Button>
      </div>
    </main>
  );
}
