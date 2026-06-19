"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterQuoteProps = {
  text: string;
  attribution?: string;
  speed?: number; // ms per character
  variant?: "default" | "fact" | "fomo";
};

/**
 * Editorial pull-quote with a typewriter (daktilo) reveal effect.
 * Triggers on scroll into view via IntersectionObserver — animates once,
 * then stays stable. Variants tint the accent dot differently.
 */
export function TypewriterQuote({
  text,
  attribution,
  speed = 28,
  variant = "default",
}: TypewriterQuoteProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || started) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  const labelMap = {
    default: { label: "Worth Pausing On", color: "text-text-muted" },
    fact: { label: "By the Numbers", color: "text-accent" },
    fomo: { label: "The Window Is Closing", color: "text-accent" },
  } as const;

  const { label, color } = labelMap[variant];

  // Reserve height to prevent layout shift as the text types in
  const reservedMinHeight =
    text.length > 200 ? "min-h-[160px]" : text.length > 120 ? "min-h-[120px]" : "min-h-[90px]";

  return (
    <div
      ref={ref}
      className="no-print my-2 flex flex-col items-center px-4 py-8 text-center md:py-12"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-px w-6 bg-current ${color}`} />
        <span
          className={`font-mono text-[10px] uppercase tracking-widest ${color}`}
        >
          {label}
        </span>
        <span className={`h-px w-6 bg-current ${color}`} />
      </div>

      <div className={`max-w-2xl ${reservedMinHeight}`}>
        <p className="font-display-italic text-lg leading-relaxed text-text md:text-xl">
          &ldquo;{displayed}
          {!done && started && (
            <span className="cursor-blink ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[2px] bg-accent align-middle" />
          )}
          {done && <span>&rdquo;</span>}
        </p>
      </div>

      {done && attribution && (
        <p className="fade-in-up mt-4 font-mono text-[10px] uppercase tracking-widest text-text-muted">
          — {attribution}
        </p>
      )}
    </div>
  );
}
