"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Analyzing your responses", duration: 900 },
  { label: "Computing your TEAM scores", duration: 1000 },
  { label: "Benchmarking against peers", duration: 900 },
  { label: "Tailoring recommendations", duration: 1100 },
];

export function AuditLoader({ onDone }: { onDone: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, i) => {
      elapsed += step.duration;
      const t = setTimeout(() => {
        if (cancelled) return;
        setCompleted((prev) => [...prev, i]);
        if (i < STEPS.length - 1) {
          setActiveStep(i + 1);
        } else {
          // Final flourish before showing
          setTimeout(() => {
            if (!cancelled) onDone();
          }, 350);
        }
      }, elapsed);
      timers.push(t);
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

  const totalSteps = STEPS.length;
  const progressPct = (completed.length / totalSteps) * 100;

  return (
    <div className="elegant-container fade-in-up mx-auto w-full max-w-2xl p-8 md:p-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center border border-border">
            <Loader2 size={20} className="animate-spin text-accent" />
          </div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-text-muted">
            Generating your report
          </p>
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
            Analyzing your{" "}
            <span className="font-display-italic text-accent">AI readiness</span>
          </h2>
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-0.5 w-full bg-border">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isDone = completed.includes(i);
            const isActive = i === activeStep && !isDone;
            const isPending = !isActive && !isDone;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  isPending ? "opacity-30" : "opacity-100"
                }`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                    isDone
                      ? "border-primary bg-primary text-white"
                      : isActive
                      ? "border-accent"
                      : "border-border"
                  }`}
                >
                  {isDone ? (
                    <Check size={11} />
                  ) : isActive ? (
                    <span className="h-1.5 w-1.5 animate-pulse bg-accent" />
                  ) : null}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isDone
                      ? "text-text"
                      : isActive
                      ? "text-text"
                      : "text-text-muted"
                  }`}
                >
                  {step.label}
                  {isActive && <span className="loader-dots" />}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
