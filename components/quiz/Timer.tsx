"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";

interface TimerProps {
  seconds: number;
  onExpire: () => void;
  running: boolean;
}

export function Timer({ seconds, onExpire, running }: TimerProps) {
  const t = useTranslations("quiz");
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining]);

  const pct = (remaining / seconds) * 100;
  const urgent = pct <= 33;

  return (
    <div className="w-full flex flex-col gap-1" aria-label={`${remaining}s`}>
      <span className={`text-sm font-medium ${urgent ? "text-destructive" : "text-muted-foreground"}`}>
        {remaining === 0 ? t("time_up") : `${remaining}s`}
      </span>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${urgent ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
