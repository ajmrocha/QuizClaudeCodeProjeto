"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { AnswerFeedback } from "@/components/quiz/AnswerFeedback";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { Timer } from "@/components/quiz/Timer";
import { Button } from "@/components/ui/button";
import type { Answer, Question, Track } from "@/lib/quiz/types";

type QuizState = "loading" | "question" | "checking" | "feedback" | "submitting" | "error";

interface AnswerRecord extends Answer {
  correct: boolean;
}

export default function QuizPage() {
  const t = useTranslations("quiz");
  const locale = useLocale();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [state, setState] = useState<QuizState>("loading");
  const [startTime] = useState(() => Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [params, setParams] = useState<{
    nickname: string;
    track: Track;
    size: number;
    timer: boolean;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("quiz_params");
    if (!raw) {
      router.replace(`/${locale}`);
      return;
    }
    const sp = new URLSearchParams(raw);
    const p = {
      nickname: sp.get("nickname") ?? "",
      track: (sp.get("track") ?? "beginner") as Track,
      size: parseInt(sp.get("size") ?? "30", 10),
      timer: sp.get("timer") === "1",
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParams(p);

    const errorIds = sessionStorage.getItem("practice_error_ids");
    const url = errorIds
      ? `/api/questions?track=${p.track}&size=${p.size}&locale=${locale}&ids=${errorIds}`
      : `/api/questions?track=${p.track}&size=${p.size}&locale=${locale}`;

    fetch(url)
      .then((r) => r.json())
      .then(({ questions: qs }) => {
        setQuestions(qs);
        setState("question");
        setQuestionStartTime(Date.now());
        sessionStorage.removeItem("practice_error_ids");
      })
      .catch(() => setState("error"));
  }, [locale, router]);

  const handleAnswer = useCallback(
    async (chosen: boolean) => {
      if (state !== "question") return;
      const q = questions[currentIdx];
      const timeMs = Date.now() - questionStartTime;
      
      const correct = chosen === q.correct_answer;
      
      setLastCorrect(correct);
      setAnswers((prev) => [...prev, { qid: q.id, chosen, time_ms: timeMs, correct }]);
      setState("feedback");
    },
    [state, questions, currentIdx, questionStartTime]
  );

  const handleTimerExpire = useCallback(() => {
    handleAnswer(false);
  }, [handleAnswer]);

  const handleNext = useCallback(async () => {
    const isLast = currentIdx >= questions.length - 1;
    if (isLast) {
      if (!params) return;
      setState("submitting");
      const durationMs = Date.now() - startTime;
      const payload = {
        nickname: params.nickname,
        track: params.track,
        roundSize: params.size,
        timerEnabled: params.timer,
        durationMs,
        answers: answers.map(({ qid, chosen, time_ms }) => ({ qid, chosen, time_ms })),
      };
      try {
        const res = await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        sessionStorage.setItem(
          "quiz_result",
          JSON.stringify({ ...data, questions, answers })
        );
        router.push(`/${locale}/resultado/${data.id}`);
      } catch {
        setState("error");
      }
    } else {
      setCurrentIdx((i) => i + 1);
      setState("question");
      setQuestionStartTime(Date.now());
    }
  }, [currentIdx, questions, params, answers, startTime, locale, router]);

  if (state === "loading") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">Something went wrong.</p>
        <Button onClick={() => router.push(`/${locale}`)}>Go home</Button>
      </main>
    );
  }

  if (state === "submitting") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Saving result...</div>
      </main>
    );
  }

  const question = questions[currentIdx];

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-8 gap-6 max-w-xl mx-auto w-full">
      <div className="w-full flex flex-col gap-3">
        <ProgressBar current={currentIdx + 1} total={questions.length} />
        {params?.timer && state === "question" && (
          <Timer seconds={30} running={state === "question"} onExpire={handleTimerExpire} />
        )}
      </div>

      {(state === "question" || state === "checking") && (
        <QuestionCard
          question={question}
          onAnswer={handleAnswer}
          disabled={state === "checking"}
        />
      )}

      {state === "feedback" && (
        <div className="w-full flex flex-col gap-4">
          <QuestionCard question={question} onAnswer={() => {}} disabled />
          <AnswerFeedback
            correct={lastCorrect}
            explanation={question.explanation}
            sourceUrl={question.source_url}
            onNext={handleNext}
          />
        </div>
      )}

      {(state === "question" || state === "checking") && !showQuitConfirm && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-auto text-muted-foreground"
          onClick={() => setShowQuitConfirm(true)}
        >
          {t("quit_button")}
        </Button>
      )}

      {showQuitConfirm && (
        <div className="mt-auto flex flex-col items-center gap-2 text-center">
          <p className="text-sm">{t("quit_confirm")}</p>
          <div className="flex gap-3">
            <Button variant="destructive" size="sm" onClick={() => router.push(`/${locale}`)}>
              {t("quit_confirm_yes")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowQuitConfirm(false)}>
              {t("quit_confirm_no")}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
