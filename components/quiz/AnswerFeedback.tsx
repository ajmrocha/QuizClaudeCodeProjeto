"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnswerFeedbackProps {
  correct: boolean;
  explanation: string;
  sourceUrl: string;
  onNext: () => void;
}

export function AnswerFeedback({ correct, explanation, sourceUrl, onNext }: AnswerFeedbackProps) {
  const t = useTranslations("quiz");

  return (
    <div
      className={`rounded-lg border p-4 flex flex-col gap-3 ${
        correct ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-destructive bg-red-50 dark:bg-red-950"
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        {correct ? (
          <CheckCircle className="text-green-600" size={20} aria-hidden />
        ) : (
          <XCircle className="text-destructive" size={20} aria-hidden />
        )}
        <span className={`font-semibold ${correct ? "text-green-700 dark:text-green-400" : "text-destructive"}`}>
          {correct ? t("correct") : t("incorrect")}
        </span>
      </div>

      <p className="text-sm">{explanation}</p>

      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary underline underline-offset-2 inline-flex items-center gap-1 w-fit"
      >
        {t("doc_link")}
        <ExternalLink size={12} aria-hidden />
      </a>

      <Button onClick={onNext} className="self-end">
        {t("next_button")}
      </Button>
    </div>
  );
}
