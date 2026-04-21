"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { RankingTable } from "@/components/ranking/RankingTable";
import type { RankingEntry, Track } from "@/lib/quiz/types";

const TRACKS: Track[] = ["beginner", "intermediate", "advanced"];

export default function RankingPage() {
  const t = useTranslations("ranking");
  const [activeTab, setActiveTab] = useState<Track>("beginner");
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    fetch(`/api/ranking?track=${activeTab}&limit=100`)
      .then((r) => r.json())
      .then(({ entries: e }) => setEntries(e ?? []))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12 gap-6 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b w-full" role="tablist">
        {TRACKS.map((tr) => (
          <button
            key={tr}
            role="tab"
            aria-selected={activeTab === tr}
            onClick={() => setActiveTab(tr)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tr
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(`tab_${tr}` as "tab_beginner" | "tab_intermediate" | "tab_advanced")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : (
        <RankingTable entries={entries} />
      )}
    </main>
  );
}
