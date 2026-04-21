"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import type { Track } from "@/lib/quiz/types";

const TRACKS: Track[] = ["beginner", "intermediate", "advanced"];
const ROUND_SIZES = [30, 40, 50];

const NICKNAME_RE = /^[A-Za-z0-9_-]{3,20}$/;

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [track, setTrack] = useState<Track>("beginner");
  const [roundSize, setRoundSize] = useState(30);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [error, setError] = useState("");

  function handleStart() {
    if (!NICKNAME_RE.test(nickname)) {
      setError(t("nickname_hint"));
      return;
    }
    setError("");
    const params = new URLSearchParams({
      nickname,
      track,
      size: String(roundSize),
      timer: timerEnabled ? "1" : "0",
    });
    sessionStorage.setItem("quiz_params", params.toString());
    router.push(`/${locale}/quiz`);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Nickname */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="nickname">
            {t("nickname_label")}
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t("nickname_placeholder")}
            maxLength={20}
            className="border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-describedby="nickname-hint"
          />
          <span id="nickname-hint" className="text-xs text-muted-foreground">
            {t("nickname_hint")}
          </span>
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>

        {/* Track */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{t("track_label")}</span>
          <div className="flex gap-2" role="radiogroup" aria-label={t("track_label")}>
            {TRACKS.map((tr) => (
              <button
                key={tr}
                role="radio"
                aria-checked={track === tr}
                onClick={() => setTrack(tr)}
                className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
                  track === tr
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {t(`track_${tr}` as "track_beginner" | "track_intermediate" | "track_advanced")}
              </button>
            ))}
          </div>
        </div>

        {/* Round Size */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{t("round_size_label")}</span>
          <div className="flex gap-2" role="radiogroup" aria-label={t("round_size_label")}>
            {ROUND_SIZES.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={roundSize === s}
                onClick={() => setRoundSize(s)}
                className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
                  roundSize === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Timer toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            role="switch"
            aria-checked={timerEnabled}
            onClick={() => setTimerEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              timerEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                timerEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
          <span className="text-sm">{t("timer_label")}</span>
        </label>

        {/* Locale switcher */}
        <LocaleSwitcher />

        <Button onClick={handleStart} size="lg" className="mt-2">
          {t("start_button")}
        </Button>
      </div>
    </main>
  );
}
