"use client";

import { useEffect, useState } from "react";

export type ScrollNavSection = {
  id: string;
  label: string;
};

type Props = {
  sections: ScrollNavSection[];
};

/**
 * Fixed-right vertical scroll navigation. Each dot represents a section
 * of the report. Active dot is filled; on hover the section label slides
 * out to the left. Click to smooth-scroll to that section. Hidden on
 * mobile and in print.
 */
export function ScrollNav({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const observers: IntersectionObserver[] = [];
    const ratioMap = new Map<string, number>();

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratioMap.set(sec.id, entry.intersectionRatio);
          });

          // Pick the section currently most visible
          let bestId = activeId;
          let bestRatio = 0;
          ratioMap.forEach((ratio, id) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          });
          if (bestRatio > 0) setActiveId(bestId);
        },
        {
          // Several thresholds so we get smooth tracking
          threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
          rootMargin: "-20% 0px -40% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  function handleClick(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav
      aria-label="Section navigation"
      className={`no-print fixed top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 xl:block ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      // Anchor to the right edge of the centered content (max-w-5xl = 1024px)
      // so dots sit just outside the section borders, not over the content.
      style={{
        right: "max(1rem, calc((100vw - 1024px) / 2 - 36px))",
      }}
    >
      <ul className="flex flex-col gap-3">
        {sections.map((sec, i) => {
          const isActive = sec.id === activeId;
          const isHovered = hoveredId === sec.id;

          return (
            <li
              key={sec.id}
              className="relative flex items-center justify-end"
              onMouseEnter={() => setHoveredId(sec.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Label only on hover — keeps the rail clean */}
              <span
                className={`pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 whitespace-nowrap border border-border bg-surface px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-text shadow-sm transition-all duration-200 ${
                  isHovered
                    ? "translate-x-0 opacity-100"
                    : "translate-x-1 opacity-0"
                }`}
              >
                {sec.label}
              </span>

              <button
                onClick={() => handleClick(sec.id)}
                aria-label={`Jump to ${sec.label}`}
                className="group flex h-5 w-5 items-center justify-center"
              >
                <span
                  className={`block transition-all duration-300 ${
                    isActive
                      ? "h-2 w-2 bg-accent"
                      : isHovered
                      ? "h-2 w-2 border border-text-muted bg-surface"
                      : "h-1.5 w-1.5 border border-border bg-surface"
                  }`}
                  style={{
                    transform: isActive ? "rotate(45deg)" : "rotate(0)",
                  }}
                />
              </button>

              <span className="sr-only">
                {i + 1} of {sections.length}: {sec.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
