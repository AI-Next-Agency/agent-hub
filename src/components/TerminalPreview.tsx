"use client";

import { useState, useEffect, useRef } from "react";

type TerminalLine = {
  type: "command" | "output" | "success";
  text: string;
};

const departmentTerminals: Record<string, TerminalLine[]> = {
  finance: [
    { type: "command", text: "> quarterly report generation" },
    { type: "output", text: "  pulling data from ERP system..." },
    { type: "output", text: "  drafting commentary for Q2 revenue..." },
    { type: "success", text: "  ✓ report draft ready for review" },
    { type: "command", text: "> forecast variance analysis" },
    { type: "output", text: "  comparing actuals vs. budget..." },
    { type: "output", text: "  flagging 3 anomalies for review..." },
    { type: "success", text: "  ✓ analysis complete" },
  ],
  marketing: [
    { type: "command", text: "> new summer campaign" },
    { type: "output", text: "  generating images with branding..." },
    { type: "output", text: "  writing copy for 4 mediums..." },
    { type: "success", text: "  ✓ assets ready for review" },
    { type: "command", text: "> schedule newsletter sequence" },
    { type: "output", text: "  personalizing subject lines..." },
    { type: "output", text: "  optimizing send times per segment..." },
    { type: "success", text: "  ✓ 3 newsletters queued" },
  ],
  sales: [
    { type: "command", text: "> prep for Acme Corp meeting" },
    { type: "output", text: "  researching company profile..." },
    { type: "output", text: "  analyzing recent earnings call..." },
    { type: "success", text: "  ✓ briefing doc generated" },
    { type: "command", text: "> draft follow-up sequence" },
    { type: "output", text: "  crafting personalized outreach..." },
    { type: "output", text: "  scheduling 3-touch cadence..." },
    { type: "success", text: "  ✓ sequence activated" },
  ],
  operations: [
    { type: "command", text: "> document onboarding workflow" },
    { type: "output", text: "  mapping 12 process steps..." },
    { type: "output", text: "  generating SOP from recordings..." },
    { type: "success", text: "  ✓ documentation published" },
    { type: "command", text: "> optimize ticket routing" },
    { type: "output", text: "  analyzing 500 past tickets..." },
    { type: "output", text: "  building classification rules..." },
    { type: "success", text: "  ✓ routing accuracy improved 34%" },
  ],
  "human-resources": [
    { type: "command", text: "> draft policy update memo" },
    { type: "output", text: "  reviewing compliance requirements..." },
    { type: "output", text: "  writing employee-friendly summary..." },
    { type: "success", text: "  ✓ memo ready for legal review" },
    { type: "command", text: "> generate onboarding materials" },
    { type: "output", text: "  creating role-specific guides..." },
    { type: "output", text: "  building FAQ from past questions..." },
    { type: "success", text: "  ✓ 5 onboarding docs created" },
  ],
  engineering: [
    { type: "command", text: "> scaffold auth microservice" },
    { type: "output", text: "  generating project structure..." },
    { type: "output", text: "  writing JWT middleware..." },
    { type: "success", text: "  ✓ service ready with tests" },
    { type: "command", text: "> document API endpoints" },
    { type: "output", text: "  parsing route handlers..." },
    { type: "output", text: "  generating OpenAPI spec..." },
    { type: "success", text: "  ✓ docs published to wiki" },
  ],
};

export function TerminalPreview({ slug }: { slug: string }) {
  const lines = departmentTerminals[slug] ?? departmentTerminals.finance;
  const [visibleCount, setVisibleCount] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovering && visibleCount < lines.length) {
      intervalRef.current = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= lines.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering, visibleCount, lines.length]);

  function handleMouseEnter() {
    setIsHovering(true);
  }

  function handleMouseLeave() {
    setIsHovering(false);
    setVisibleCount(1);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return (
    <div
      className="flex h-full flex-col bg-[#1a1a2e] p-4 font-mono text-xs leading-relaxed"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-white/30">ai-agent</span>
      </div>
      <div className="flex-1 space-y-1">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div
            key={i}
            className={
              line.type === "command"
                ? "text-white"
                : line.type === "success"
                  ? "text-emerald-400"
                  : "text-white/50"
            }
          >
            {line.text}
            {i === visibleCount - 1 && visibleCount < lines.length && isHovering && (
              <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-white/70" />
            )}
          </div>
        ))}
        {!isHovering && (
          <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-white/70" />
        )}
      </div>
    </div>
  );
}
