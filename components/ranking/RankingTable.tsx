"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { BadgeTier, RankingEntry } from "@/lib/quiz/types";

const BADGE_SYMBOL: Record<BadgeTier, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
};

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m${s % 60}s` : `${s}s`;
}

interface RankingTableProps {
  entries: RankingEntry[];
}

export const RankingTable = memo(function RankingTable({ entries }: RankingTableProps) {
  const t = useTranslations("ranking");

  const formattedDates = useMemo(
    () => entries.map((e) => new Date(e.created_at).toLocaleDateString()),
    [entries]
  );

  if (entries.length === 0) {
    return <p className="text-muted-foreground text-sm">{t("empty")}</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground text-left">
            <th className="py-2 pr-3 w-8">{t("col_position")}</th>
            <th className="py-2 pr-3">{t("col_nickname")}</th>
            <th className="py-2 pr-3 text-right">{t("col_score")}</th>
            <th className="py-2 pr-3 text-right">{t("col_percentage")}</th>
            <th className="py-2 pr-3 text-right">{t("col_time")}</th>
            <th className="py-2 text-right">{t("col_date")}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-2 pr-3 font-medium">{idx + 1}</td>
              <td className="py-2 pr-3">
                {entry.nickname}
                {entry.badge_tier && (
                  <span className="ml-1" aria-label={entry.badge_tier}>
                    {BADGE_SYMBOL[entry.badge_tier]}
                  </span>
                )}
              </td>
              <td className="py-2 pr-3 text-right font-medium">{entry.score}</td>
              <td className="py-2 pr-3 text-right">{Math.round(entry.percentage)}%</td>
              <td className="py-2 pr-3 text-right">{formatTime(entry.duration_ms)}</td>
              <td className="py-2 text-right text-muted-foreground">
                {formattedDates[idx]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
