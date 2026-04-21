"use client";

import { useTranslations } from "next-intl";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const t = useTranslations("quiz");
  const pct = (current / total) * 100;

  return (
    <div className="w-full flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">
        {t("question_progress", { current, total })}
      </span>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
