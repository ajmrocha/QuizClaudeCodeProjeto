"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnswerResult, Question } from "@/lib/quiz/types";

interface ReviewItem {
  question: Question;
  answer: AnswerResult;
}

export default function RevisaoPage() {
  const t = useTranslations("review");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);

  const buildItems = useCallback((questions: Question[], answers: AnswerResult[]) => {
    const answerMap = new Map(answers.map((a) => [a.qid, a]));
    const reviewItems: ReviewItem[] = questions
      .map((q) => ({ question: q, answer: answerMap.get(q.id)! }))
      .filter((item) => item.answer !== undefined);
    setItems(reviewItems);
    setHasErrors(reviewItems.some((item) => !item.answer.correct));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!resultId) {
      router.replace(`/${locale}`);
      return;
    }

    // Try sessionStorage first (same-session review)
    const cached = sessionStorage.getItem("quiz_result");
    if (cached) {
      const data = JSON.parse(cached);
      if (data.id === resultId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        buildItems(data.questions, data.answers);
        return;
      }
    }

    // Fallback: fetch from API
    fetch(`/api/results/${resultId}`)
      .then((r) => r.json())
      .then((data) => buildItems(data.questions, data.answers))
      .catch(() => setLoading(false));
  }, [resultId, locale, router, buildItems]);

  function handlePracticeErrors() {
    const errorIds = items
      .filter((item) => !item.answer.correct)
      .map((item) => item.question.id);
    sessionStorage.setItem("practice_error_ids", errorIds.join(","));
    router.push(`/${locale}/quiz`);
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12 gap-6 max-w-2xl mx-auto w-full">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {hasErrors && (
          <Button variant="outline" size="sm" onClick={handlePracticeErrors}>
            {t("practice_errors_button")}
          </Button>
        )}
      </div>

      <div className="w-full flex flex-col gap-4">
        {items.map((item, idx) => (
          <div
            key={item.question.id}
            className={`rounded-lg border p-4 flex flex-col gap-2 ${
              item.answer.correct
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-destructive bg-red-50 dark:bg-red-950"
            }`}
          >
            <div className="flex items-start gap-2">
              {item.answer.correct ? (
                <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={16} aria-hidden />
              ) : (
                <XCircle className="text-destructive mt-0.5 shrink-0" size={16} aria-hidden />
              )}
              <p className="text-sm font-medium">
                {idx + 1}. {item.question.statement}
              </p>
            </div>

            <div className="flex gap-6 text-xs text-muted-foreground pl-6">
              <span>
                {t("your_answer")}:{" "}
                <strong>{item.answer.chosen ? t("true") : t("false")}</strong>
              </span>
              <span>
                {t("correct_answer")}:{" "}
                <strong>{item.answer.correct === item.answer.chosen
                  ? (item.answer.chosen ? t("true") : t("false"))
                  : (item.answer.chosen ? t("false") : t("true"))
                }</strong>
              </span>
            </div>

            <p className="text-sm pl-6">{item.question.explanation}</p>

            <a
              href={item.question.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary underline underline-offset-2 inline-flex items-center gap-1 pl-6 w-fit"
            >
              {t("doc_link")}
              <ExternalLink size={10} aria-hidden />
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
