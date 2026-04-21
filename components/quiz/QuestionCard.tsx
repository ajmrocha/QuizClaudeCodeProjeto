"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/quiz/types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (chosen: boolean) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled = false }: QuestionCardProps) {
  const t = useTranslations("quiz");
  const tCat = useTranslations("categories");

  return (
    <div className="flex flex-col gap-6">
      <span className="inline-flex self-start items-center rounded-full border px-3 py-1 text-xs font-medium">
        {tCat(question.category)}
      </span>

      <p className="text-lg font-medium leading-relaxed">{question.statement}</p>

      <div className="flex gap-4">
        <Button
          onClick={() => onAnswer(true)}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="flex-1 border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
          aria-label={t("true_button")}
        >
          {t("true_button")}
        </Button>
        <Button
          onClick={() => onAnswer(false)}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="flex-1 border-destructive text-destructive hover:bg-red-50 dark:hover:bg-red-950"
          aria-label={t("false_button")}
        >
          {t("false_button")}
        </Button>
      </div>
    </div>
  );
}
