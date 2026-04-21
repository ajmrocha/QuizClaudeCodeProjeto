"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Result } from "@/lib/quiz/types";

interface ShareButtonsProps {
  resultUrl: string;
  result: Result;
}

const TRACK_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export function ShareButtons({ resultUrl, result }: ShareButtonsProps) {
  const t = useTranslations("result");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const pct = Math.round(result.percentage);
  const track = TRACK_LABELS[result.track] ?? result.track;
  const shareText = `Fiz ${pct}% no Claude Code Quiz (trilha ${track}). Desafia aí: ${resultUrl}`;

  function handleCopy() {
    navigator.clipboard.writeText(resultUrl).then(() => {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resultUrl)}`;

  return (
    <div className="w-full flex gap-2">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="outline" className="w-full">
          X / Twitter
        </Button>
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="outline" className="w-full">
          LinkedIn
        </Button>
      </a>
      <Button variant="outline" onClick={handleCopy} aria-label={t("copy_link")} className="px-3">
        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
      </Button>
    </div>
  );
}
