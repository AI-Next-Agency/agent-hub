"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import {
  auditQuestions,
  teamDimensions,
  type TeamDimension,
} from "@/content/audit";
import { AuditResults } from "@/components/AuditResults";

type AnswerEntry = { values: string[]; score: number };
type Phase = "question" | "transitioning";

// For multi-select: max score of selected options
function calcMultiScore(
  selectedValues: string[],
  options: { value: string; score: number }[]
): number {
  if (selectedValues.length === 0) return 0;
  return Math.max(
    ...selectedValues.map((v) => options.find((o) => o.value === v)?.score ?? 0)
  );
}

function getDimension(dimensionKey: string): TeamDimension | undefined {
  return teamDimensions.find((d) => d.key === dimensionKey);
}

const TRANSITION_MS = 1200;
const ADVANCE_DELAY_MS = 320;

export function AuditQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerEntry>>({});
  const [showResults, setShowResults] = useState(false);
  const [phase, setPhase] = useState<Phase>("question");
  const [transitionDim, setTransitionDim] = useState<TeamDimension | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = auditQuestions.length;
  const currentQuestion = auditQuestions[currentStep];
  const isLastQuestion = currentStep === totalQuestions - 1;
  const currentAnswer = answers[currentQuestion?.id];
  const hasAnsweredCurrent =
    !!currentAnswer && currentAnswer.values.length > 0;

  const currentDim = getDimension(currentQuestion.dimension);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  function commitAdvance() {
    if (isLastQuestion) {
      setShowResults(true);
      return;
    }
    const nextStep = currentStep + 1;
    const nextQ = auditQuestions[nextStep];
    const isShift = nextQ.dimension !== currentQuestion.dimension;

    if (isShift) {
      const nextDim = getDimension(nextQ.dimension);
      setTransitionDim(nextDim ?? null);
      setPhase("transitioning");
      transitionTimer.current = setTimeout(() => {
        setCurrentStep(nextStep);
        setPhase("question");
        setTransitionDim(null);
      }, TRANSITION_MS);
    } else {
      setCurrentStep(nextStep);
    }
  }

  function selectSingle(value: string, score: number) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { values: [value], score },
    }));

    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(commitAdvance, ADVANCE_DELAY_MS);
  }

  function toggleMulti(value: string, options: typeof currentQuestion.options) {
    setAnswers((prev) => {
      const existing = prev[currentQuestion.id]?.values ?? [];
      const next = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      return {
        ...prev,
        [currentQuestion.id]: {
          values: next,
          score: calcMultiScore(next, options),
        },
      };
    });
  }

  function next() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    commitAdvance();
  }

  function back() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setPhase("question");
    setTransitionDim(null);
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

  function restart() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setPhase("question");
    setTransitionDim(null);
  }

  const totalScore = Object.values(answers).reduce(
    (sum, a) => sum + a.score,
    0
  );

  /* ─── RESULTS ─── */
  if (showResults) {
    return (
      <AuditResults
        answers={answers}
        totalScore={totalScore}
        onRestart={restart}
      />
    );
  }

  /* ─── QUIZ ─── */
  const isMulti = !!currentQuestion.multiSelect;
  const selectedValues = currentAnswer?.values ?? [];

  return (
    <div className="elegant-container mx-auto w-full max-w-2xl p-5 md:p-8">
      {/* Split TEAM progress */}
      <TeamProgressBar
        currentDimensionKey={
          phase === "transitioning" && transitionDim
            ? transitionDim.key
            : currentQuestion.dimension
        }
        answers={answers}
      />

      {/* Phase: transitioning between dimensions */}
      {phase === "transitioning" && transitionDim ? (
        <CategoryShift dim={transitionDim} />
      ) : (
        <div className="fade-in-up">
          {/* Dimension badge */}
          {currentDim && (
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center bg-primary font-mono text-xs font-medium text-white">
                {currentDim.letter}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Section · {currentDim.name}
                </span>
                <span className="text-[11px] text-text-secondary">
                  {currentDim.tagline}
                </span>
              </div>
              <span className="ml-auto font-mono text-[11px] text-text-muted">
                {currentStep + 1} / {totalQuestions}
              </span>
            </div>
          )}

          {/* Question */}
          <div className="mb-4">
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-lg font-medium tracking-tight md:text-xl">
                {currentQuestion.question}
              </h2>
              {isMulti && (
                <span className="elegant-pill shrink-0 px-2 py-0.5 text-[10px] text-text-muted">
                  multi-select
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary md:text-sm">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="mb-5 space-y-1.5">
            {currentQuestion.options.map((option) => {
              const isSelected = isMulti
                ? selectedValues.includes(option.value)
                : selectedValues[0] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() =>
                    isMulti
                      ? toggleMulti(option.value, currentQuestion.options)
                      : selectSingle(option.value, option.score)
                  }
                  className={`flex w-full items-start gap-3 border px-4 py-2.5 text-left text-sm transition-all ${
                    isSelected
                      ? "border-primary bg-primary/[0.03] text-text"
                      : "border-border bg-surface text-text-secondary hover:border-primary/30 hover:text-text"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                      !isMulti ? "rounded-full" : ""
                    } ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span>{option.label}</span>
                    {option.example && (
                      <span className="text-[11px] text-text-muted">
                        {option.example}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={back}
              disabled={currentStep === 0}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                currentStep === 0
                  ? "cursor-not-allowed text-text-muted"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <ArrowLeft size={14} />
              Back
            </button>

            {(isMulti || isLastQuestion) && (
              <button
                onClick={next}
                disabled={!hasAnsweredCurrent}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all ${
                  hasAnsweredCurrent
                    ? "elegant-btn-primary"
                    : "cursor-not-allowed border border-border bg-surface text-text-muted"
                }`}
              >
                {isLastQuestion ? "See Results" : "Continue"}
                <ArrowRight size={14} />
              </button>
            )}

            {!isMulti && !isLastQuestion && (
              <button
                onClick={next}
                disabled={!hasAnsweredCurrent}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  hasAnsweredCurrent
                    ? "text-text-secondary hover:text-text"
                    : "invisible"
                }`}
              >
                Skip ahead
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Split TEAM progress bar ─── */

function TeamProgressBar({
  currentDimensionKey,
  answers,
}: {
  currentDimensionKey: string;
  answers: Record<string, AnswerEntry>;
}) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-4 gap-1.5">
        {teamDimensions.map((dim) => {
          const dimQuestions = auditQuestions.filter(
            (q) => q.dimension === dim.key
          );
          const answeredCount = dimQuestions.filter(
            (q) => (answers[q.id]?.values.length ?? 0) > 0
          ).length;
          const fillPct = (answeredCount / dimQuestions.length) * 100;
          const isCurrent = dim.key === currentDimensionKey;
          const isComplete = answeredCount === dimQuestions.length;

          return (
            <div key={dim.key} className="flex flex-col items-start">
              <div className="relative h-1 w-full bg-border">
                <div
                  className="h-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <span
                  className={`font-mono text-[10px] font-medium tracking-wider transition-colors ${
                    isCurrent
                      ? "text-accent"
                      : isComplete
                      ? "text-text"
                      : "text-text-muted"
                  }`}
                >
                  {dim.letter}
                </span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    isCurrent ? "text-text" : "text-text-muted"
                  } hidden sm:inline`}
                >
                  {dim.short}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Category shift overlay ─── */

function CategoryShift({ dim }: { dim: TeamDimension }) {
  return (
    <div className="fade-in-up py-10 text-center md:py-14">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-muted">
        <span className="inline-block h-px w-5 translate-y-[-2px] bg-text-muted align-middle" />
        <span className="mx-2">Now exploring</span>
        <span className="inline-block h-px w-5 translate-y-[-2px] bg-text-muted align-middle" />
      </p>

      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="cat-shift-letter flex h-12 w-12 items-center justify-center bg-primary font-mono text-2xl font-medium text-white md:h-14 md:w-14 md:text-3xl">
          {dim.letter}
        </span>
        <h2 className="cat-shift-name text-3xl font-medium tracking-tight md:text-4xl">
          {dim.name}
        </h2>
      </div>

      <p className="cat-shift-tagline mx-auto max-w-md text-sm text-text-secondary leading-relaxed">
        {dim.description}
      </p>
    </div>
  );
}
