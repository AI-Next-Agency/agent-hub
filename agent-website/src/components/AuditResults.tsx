"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Printer,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  auditQuestions,
  getAuditResult,
  getBiggestGap,
  getDimensionAdvice,
  getPeerBenchmark,
  getScorePercentage,
  getStrongestDimension,
  getTeamScores,
  roadmapByLevel,
  type TeamScore,
} from "@/content/audit";
import {
  BOOK_CALL_URL,
  CTA_LABEL,
  SITE_NAME,
} from "@/content/site";
import { AuditLoader } from "@/components/AuditLoader";
import { RadarChart } from "@/components/RadarChart";
import { TypewriterQuote } from "@/components/TypewriterQuote";
import { ScrollNav, type ScrollNavSection } from "@/components/ScrollNav";
import { submitAuditLead } from "@/lib/audit-submit";

const SCROLL_SECTIONS: ScrollNavSection[] = [
  { id: "score", label: "Score" },
  { id: "team-framework", label: "TEAM Framework" },
  { id: "gap-strength", label: "Gap & Strength" },
  { id: "advice", label: "Advice" },
  { id: "snapshot", label: "Snapshot" },
  { id: "roadmap", label: "Roadmap" },
];

type AnswerEntry = { values: string[]; score: number };

type Props = {
  answers: Record<string, AnswerEntry>;
  totalScore: number;
  onRestart: () => void;
};

export function AuditResults({ answers, totalScore, onRestart }: Props) {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");

  // Reset loader when restarting / new run
  useEffect(() => {
    setPhase("loading");
  }, [answers]);

  if (phase === "loading") {
    return <AuditLoader onDone={() => setPhase("ready")} />;
  }

  return (
    <ResultsBody
      answers={answers}
      totalScore={totalScore}
      onRestart={onRestart}
    />
  );
}

function ResultsBody({ answers, totalScore, onRestart }: Props) {
  const result = getAuditResult(totalScore);
  const percentage = getScorePercentage(totalScore);
  const teamScores = useMemo(() => getTeamScores(answers), [answers]);
  const peer = getPeerBenchmark(percentage);
  const profile = useMemo(() => buildProfile(answers), [answers]);
  const biggestGap = getBiggestGap(teamScores);
  const strongest = getStrongestDimension(teamScores);

  const roadmap = roadmapByLevel[result.level] ?? roadmapByLevel.early;
  const levels = ["Early Stage", "Developing", "Advancing", "Leading"];
  const levelIndex = levels.indexOf(result.title);

  const [email, setEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (isUnlocked) return;
    setUnlockError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setUnlockError("Please enter a valid work email.");
      return;
    }
    setUnlockLoading(true);
    try {
      await submitAuditLead({
        email,
        source: "audit",
        score: totalScore,
        level: result.title,
        teamT: teamScores[0].score,
        teamE: teamScores[1].score,
        teamA: teamScores[2].score,
        teamM: teamScores[3].score,
        departments: (answers.department?.values ?? []).join(", "),
        blockers: (answers.challenge?.values ?? []).join(", "),
        tools: (answers.tools?.values ?? []).join(", "),
        goal: (answers.goal?.values ?? []).join(", "),
        budget: (answers.budget?.values ?? []).join(", "),
        timeline: (answers.timeline?.values ?? []).join(", "),
        teamSize: (answers["team-size"]?.values ?? []).join(", "),
        aiUsage: (answers["ai-usage"]?.values ?? []).join(", "),
      });
    } catch {
      // network error — unlock anyway, data capture is best-effort
    }
    setUnlockLoading(false);
    setIsUnlocked(true);
  }

  function handleShare() {
    const shareData = {
      title: `My ${SITE_NAME} AI Readiness Audit`,
      text: `I just took the AI Readiness Audit — my team scored ${percentage}% (${result.title}). Take it yourself:`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(`${shareData.text} ${shareData.url}`)
        .then(() => alert("Result link copied to clipboard"))
        .catch(() => {});
    }
  }

  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <div className="audit-results space-y-6 fade-in-up">
      <ScrollNav sections={SCROLL_SECTIONS} />

      {/* ───── PRINT COVER PAGE ───── */}
      <div className="print-only print-cover">
        <div className="cover-top">
          <p className="cover-brand">{SITE_NAME}</p>
          <p className="cover-date">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="cover-mid">
          <p className="cover-eyebrow">AI Readiness Audit</p>
          <h1 className="cover-title">
            The {result.title} <em>Report</em>
          </h1>
          <p className="cover-tagline">
            A personalized snapshot of your team&apos;s AI maturity, scored
            across the TEAM framework — Talent, Education, Application,
            Momentum.
          </p>

          <div className="cover-score">
            <div className="cover-score-num">
              <span className="num">{percentage}</span>
              <span className="pct">%</span>
            </div>
            <div className="cover-score-meta">
              <p className="lvl">{result.title}</p>
              <p className="raw">
                {totalScore} / {auditQuestions.length * 4} pts
              </p>
            </div>
          </div>

          <div className="cover-team-grid">
            {teamScores.map((d) => (
              <div key={d.key} className="cover-team-cell">
                <span className="cover-team-letter">{d.letter}</span>
                <div>
                  <p className="cover-team-name">{d.name}</p>
                  <p className="cover-team-score">
                    {d.score} <span>/ {d.max}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cover-bottom">
          <p className="cover-toc-title">Inside this report</p>
          <ol className="cover-toc">
            <li>Your maturity level &amp; benchmark</li>
            <li>The TEAM Framework — radar &amp; dimension scores</li>
            <li>Your biggest gap and your strongest dimension</li>
            <li>Tailored advice for each TEAM dimension</li>
            <li>Your team profile snapshot</li>
            <li>Your 90-day execution roadmap</li>
            <li>How to act on this report</li>
          </ol>
          <p className="cover-footer">
            aiautomationagent.com / ai-audit
          </p>
        </div>
      </div>

      {/* ───── HERO ───── */}
      <section id="score" className="elegant-container p-6 sm:p-8 md:p-12">
        <div className="no-print mb-5 flex items-center justify-between gap-3">
          <span className="elegant-pill flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-text-muted sm:text-xs">
            <Sparkles size={11} className="text-accent" />
            <span className="hidden sm:inline">Your AI Readiness Audit</span>
            <span className="sm:hidden">Your Audit</span>
          </span>
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Retake</span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-muted sm:text-xs">
              Your TEAM Score
            </p>
            <h2 className="mb-3 text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
              {result.title.split(" ")[0]}{" "}
              {result.title.split(" ")[1] && (
                <span className="font-display-italic text-accent">
                  {result.title.split(" ").slice(1).join(" ")}
                </span>
              )}
            </h2>
            <p className="max-w-xl text-sm text-text-secondary leading-relaxed sm:text-base">
              {result.summary}
            </p>
          </div>

          <div className="md:text-right">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-muted sm:text-xs">
              Overall
            </p>
            <div className="flex items-baseline gap-1.5 md:justify-end">
              <span className="font-mono text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
                {percentage}
              </span>
              <span className="font-mono text-lg text-text-muted sm:text-xl">%</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-text-muted sm:text-xs">
              {totalScore} / {auditQuestions.length * 4} pts
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Where you stand
            </p>
            <p className="text-xs text-text-muted">
              Level {levelIndex + 1} of {levels.length}
            </p>
          </div>

          <MaturitySpectrum
            currentLevel={levelIndex}
            percentage={percentage}
            levels={levels}
          />

          <p className="mt-4 text-xs text-text-secondary leading-relaxed">
            <span className="font-medium text-text">
              Ahead of ~{peer.ahead}% of teams.
            </span>{" "}
            {peer.description}
          </p>
        </div>
      </section>

      {/* ───── QUOTE 1 — encouragement, AI as friend ───── */}
      <TypewriterQuote
        text="AI isn't here to replace your team — it's here to make your best people unstoppable."
        attribution="The view we work from"
        variant="default"
      />

      {/* ───── GATED CONTENT ───── */}
      <div className="relative">
        <div
          className={`space-y-4 transition-[filter] duration-500 ${
            !isUnlocked ? "pointer-events-none select-none blur-md print:blur-none" : ""
          }`}
        >
          {/* ───── TEAM FRAMEWORK INTRO ───── */}
          <section id="team-framework" className="elegant-container print-page-break p-6 sm:p-8 md:p-12">
            <div className="mb-8 grid gap-6 md:grid-cols-[1fr_2fr] md:items-center">
              <div>
                <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-muted">
                  The Framework
                </p>
                <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
                  The{" "}
                  <span className="font-display-italic text-accent">TEAM</span>{" "}
                  Framework
                </h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our model for assessing AI readiness in company teams. Four
                dimensions — Talent, Education, Application, Momentum — that
                together capture whether your team can adopt AI in a way that
                sticks and creates real impact.
              </p>
            </div>

            {/* Radar + dimension cards */}
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
              <div className="flex justify-center">
                <div className="w-full max-w-[320px] sm:max-w-[360px]">
                  <RadarChart
                    points={teamScores.map((d) => ({
                      label: d.short,
                      letter: d.letter,
                      score: d.score,
                      industryAvg: d.industryAvg,
                      max: d.max,
                    }))}
                    size={360}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {teamScores.map((d, i) => (
                  <DimensionRow key={d.key} dim={d} delay={i * 80} />
                ))}
              </div>
            </div>
          </section>

          {/* ───── QUOTE 2 — fact + FOMO ───── */}
          <TypewriterQuote
            text="High-performing companies adopt AI across far more business functions than their peers — and the gap widens every quarter."
            attribution="McKinsey, The State of AI 2024"
            variant="fact"
          />

          {/* ───── BIGGEST GAP & STRONGEST ───── */}
          <section id="gap-strength" className="grid gap-4 md:grid-cols-2">
            <div className="elegant-container border-accent/30 bg-accent-subtle/30 p-6 md:p-8">
              <div className="mb-3 flex items-center gap-2">
                <Target size={14} className="text-accent" />
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                  Your Biggest Gap
                </p>
              </div>
              <h4 className="mb-2 text-xl font-medium tracking-tight sm:text-2xl">
                {biggestGap.letter} — {biggestGap.name}
              </h4>
              <p className="mb-3 text-xs text-text-muted">
                {biggestGap.score}/{biggestGap.max} · {biggestGap.percentage}% of
                maximum
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                <span className="font-medium text-text">{biggestGap.name}</span> is
                your lowest-scoring TEAM dimension. Focusing here will have the
                highest impact on your overall AI readiness.
              </p>
            </div>

            <div className="elegant-container border-success/20 bg-success/[0.04] p-6 md:p-8">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-success" />
                <p className="font-mono text-[11px] uppercase tracking-widest text-success">
                  Your Strength
                </p>
              </div>
              <h4 className="mb-2 text-xl font-medium tracking-tight sm:text-2xl">
                {strongest.letter} — {strongest.name}
              </h4>
              <p className="mb-3 text-xs text-text-muted">
                {strongest.score}/{strongest.max} · {strongest.percentage}% of
                maximum
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                You&apos;re strongest in{" "}
                <span className="font-medium text-text">{strongest.name}</span>.
                This is your foundation — build the rest of the program on top of it.
              </p>
            </div>
          </section>

          {/* ───── DIMENSION-LEVEL ADVICE ───── */}
          <section id="advice" className="elegant-container print-page-break p-6 sm:p-8 md:p-12">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-muted">
              Tailored Advice
            </p>
            <h3 className="mb-2 text-xl font-medium tracking-tight sm:text-2xl">
              What to do for each TEAM dimension
            </h3>
            <p className="mb-8 text-sm text-text-secondary">
              Specific, prioritized recommendations based on your score in each
              area.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {teamScores.map((dim) => (
                <AdviceCard key={dim.key} dim={dim} />
              ))}
            </div>
          </section>

          {/* ───── QUOTE 3 — reframe gap as opportunity ───── */}
          <TypewriterQuote
            text="Most teams don't fail at AI because of bad tools. They fail because no one ever taught them how to use the tools well."
            attribution="What we keep seeing"
            variant="default"
          />

          {/* ───── PROFILE SNAPSHOT ───── */}
          <section id="snapshot" className="elegant-container print-page-break p-6 sm:p-8 md:p-12">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-muted">
              Your Snapshot
            </p>
            <h3 className="mb-6 text-xl font-medium tracking-tight sm:text-2xl">
              A quick read on your team
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {profile.facts.map((f) => (
                <div key={f.label} className="border border-border p-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    {f.label}
                  </p>
                  <p className="text-sm font-medium text-text">{f.value}</p>
                </div>
              ))}
            </div>

            {profile.departments.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Priority Departments
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.departments.map((d) => (
                    <span
                      key={d}
                      className="elegant-pill px-3 py-1 text-xs text-text"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.blockers.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Key Blockers Identified
                </p>
                <ul className="space-y-2">
                  {profile.blockers.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* ───── ROADMAP ───── */}
          <section id="roadmap" className="elegant-container print-page-break p-6 sm:p-8 md:p-12">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-muted">
              Your 90-Day Roadmap
            </p>
            <h3 className="mb-8 text-xl font-medium tracking-tight sm:text-2xl">
              What to do{" "}
              <span className="font-display-italic text-accent">next</span>
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              {roadmap.map((phase, i) => (
                <div key={phase.window} className="border border-border p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center bg-primary font-mono text-[10px] text-white">
                      {i + 1}
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                      {phase.window}
                    </p>
                  </div>
                  <h4 className="mb-3 text-base font-medium">{phase.title}</h4>
                  <ul className="space-y-2">
                    {phase.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed"
                      >
                        <Check size={11} className="mt-1 shrink-0 text-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ───── QUOTE 4 — FOMO + CTA setup ───── */}
          <TypewriterQuote
            text="While you're reading this, three of your competitors took the same audit. The teams that move first own the market — the rest spend years catching up."
            attribution="The window is now"
            variant="fomo"
          />
        </div>

        {/* ───── UNLOCK GATE ───── */}
        {!isUnlocked && (
          <div className="absolute inset-x-0 top-8 z-10 flex justify-center px-4">
            <div className="elegant-container w-full max-w-lg p-8">
              <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-muted">
                Full report
              </p>
              <h3 className="mb-2 text-xl font-medium tracking-tight">
                Unlock your{" "}
                <span className="font-display-italic text-accent">full report</span>
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-text-secondary">
                Enter your work email to see your TEAM breakdown, tailored advice, and 90-day roadmap.
              </p>
              <form onSubmit={handleUnlock} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (unlockError) setUnlockError(null); }}
                  placeholder="you@company.com"
                  required
                  className="w-full border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
                {unlockError && (
                  <p className="text-xs text-danger">{unlockError}</p>
                )}
                <button
                  type="submit"
                  disabled={unlockLoading}
                  className="elegant-btn-primary flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {unlockLoading ? "Unlocking…" : "Unlock full report"}
                  {!unlockLoading && <ArrowRight size={14} />}
                </button>
                <p className="pt-1 text-[11px] leading-relaxed text-text-muted">
                  {"We'll only use your email to send this report and a single follow-up. No spam."}
                </p>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ───── ACTIONS ───── */}
      <section className="no-print">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="elegant-btn flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary hover:text-text"
          >
            <Printer size={14} />
            Save as PDF
          </button>
          <button
            onClick={handleShare}
            className="elegant-btn flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary hover:text-text"
          >
            <Share2 size={14} />
            Share
          </button>
          <button
            onClick={onRestart}
            className="elegant-btn flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary hover:text-text"
          >
            <RotateCcw size={14} />
            Retake
          </button>
        </div>
      </section>

      {/* ───── PRINT TAIL — closing CTA page ───── */}
      <div className="print-only print-tail">
        <div className="print-tail-eyebrow">Next step</div>
        <h2 className="print-tail-title">
          Turn this report into a <em>real plan</em>
        </h2>
        <p className="print-tail-body">
          A 30-minute call to walk through your TEAM scores, sharpen the gaps,
          and design a 90-day program tailored to your team.
        </p>
        <div className="print-tail-cta">
          <p className="print-tail-cta-label">Book your free call</p>
          <p className="print-tail-cta-url">
            forms.fillout.com/t/6hCpLMsMhKus
          </p>
        </div>
        <div className="print-tail-foot">
          <span>{SITE_NAME}</span>
          <span>aiautomationagent.com / ai-audit</span>
        </div>
      </div>

      {/* ───── BOOK CALL TEASER ───── */}
      <section className="no-print elegant-container p-6 sm:p-8 md:p-12">
        <div className="grid gap-6 md:grid-cols-[1.5fr_auto] md:items-center">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-muted">
              Want this delivered?
            </p>
            <h3 className="mb-2 text-xl font-medium tracking-tight sm:text-2xl">
              Let&apos;s turn this into a real plan
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              30-minute call, free, no pitch. We&apos;ll review your TEAM
              scores together and map the highest-leverage next moves for
              your team.
            </p>
          </div>
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="elegant-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
          >
            {CTA_LABEL}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
    </div>
  );
}

/* ────────── Sub-components ────────── */

function MaturitySpectrum({
  currentLevel,
  percentage,
  levels,
}: {
  currentLevel: number;
  percentage: number;
  levels: string[];
}) {
  return (
    <div>
      <div className="relative h-12">
        <div
          className="absolute -top-2 z-10 -translate-x-1/2 transition-all duration-700"
          style={{ left: `${Math.max(2, Math.min(98, percentage))}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="font-mono text-[10px] font-medium text-accent">
              YOU
            </div>
            <div className="h-2 w-px bg-accent" />
          </div>
        </div>

        <div className="absolute inset-x-0 top-4 grid grid-cols-4 gap-px">
          {levels.map((label, i) => {
            const isActive = i === currentLevel;
            const isPast = i < currentLevel;
            return (
              <div
                key={label}
                className={`h-2 transition-colors ${
                  isActive
                    ? "bg-primary"
                    : isPast
                    ? "bg-primary/40"
                    : "bg-border"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-1 grid grid-cols-4 gap-px">
        {levels.map((label, i) => {
          const isActive = i === currentLevel;
          return (
            <div
              key={label}
              className={`text-center font-mono text-[10px] uppercase tracking-wider ${
                isActive ? "font-medium text-text" : "text-text-muted"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DimensionRow({ dim, delay }: { dim: TeamScore; delay: number }) {
  const isStrong = dim.percentage >= 70;
  const isGap = dim.percentage < 50;

  return (
    <div className="border border-border p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center bg-primary font-mono text-xs font-medium text-white">
            {dim.letter}
          </span>
          <div>
            <p className="text-sm font-medium leading-tight text-text">
              {dim.name}
            </p>
            <p className="text-[11px] text-text-muted">{dim.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sm font-medium tabular-nums text-text">
            {dim.score}
          </span>
          <span className="font-mono text-[10px] text-text-muted">
            /{dim.max}
          </span>
        </div>
      </div>

      <div className="relative h-1.5 bg-border">
        <div
          className="bar-fill absolute inset-y-0 left-0 bg-primary"
          style={{ width: `${dim.percentage}%`, animationDelay: `${delay}ms` }}
        />
        {/* Industry avg marker */}
        <div
          className="absolute -top-0.5 h-2.5 w-px bg-text-muted"
          style={{
            left: `${(dim.industryAvg / dim.max) * 100}%`,
            opacity: 0.5,
          }}
          title={`Industry avg: ${dim.industryAvg}`}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px]">
        <span className="font-mono text-text-muted">
          {dim.percentage}% of maximum
        </span>
        {isStrong && (
          <span className="font-mono uppercase tracking-wider text-success">
            strong
          </span>
        )}
        {isGap && (
          <span className="font-mono uppercase tracking-wider text-accent">
            opportunity
          </span>
        )}
      </div>
    </div>
  );
}

function AdviceCard({ dim }: { dim: TeamScore }) {
  const advice = getDimensionAdvice(dim);
  const priorityColor =
    advice.priority === "high"
      ? "text-accent"
      : advice.priority === "medium"
      ? "text-warning"
      : "text-success";
  const priorityLabel = advice.priority.toUpperCase();

  return (
    <div className="border border-border p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center bg-primary font-mono text-[10px] font-medium text-white">
            {dim.letter}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
            {dim.name}
          </span>
        </div>
        <span
          className={`font-mono text-[9px] uppercase tracking-widest ${priorityColor}`}
        >
          {priorityLabel} priority
        </span>
      </div>

      <h4 className="mb-2 text-base font-medium leading-snug text-text">
        {advice.headline}
      </h4>
      <p className="text-xs text-text-secondary leading-relaxed">
        {advice.detail}
      </p>
    </div>
  );
}

/* ────────── Profile builder ────────── */

function buildProfile(answers: Record<string, AnswerEntry>): {
  facts: { label: string; value: string }[];
  departments: string[];
  blockers: string[];
} {
  const facts: { label: string; value: string }[] = [];

  const lookup = (qid: string, valueIdx = 0) => {
    const q = auditQuestions.find((q) => q.id === qid);
    if (!q) return null;
    const value = answers[qid]?.values[valueIdx];
    return q.options.find((o) => o.value === value)?.label ?? null;
  };

  const lookupAll = (qid: string) => {
    const q = auditQuestions.find((q) => q.id === qid);
    if (!q) return [] as string[];
    const vals = answers[qid]?.values ?? [];
    return vals
      .map((v) => q.options.find((o) => o.value === v)?.label ?? null)
      .filter((x): x is string => !!x);
  };

  const teamSize = lookup("team-size");
  if (teamSize) facts.push({ label: "Team Size", value: teamSize });

  const usage = lookup("ai-usage");
  if (usage) facts.push({ label: "Current Usage", value: usage });

  const tools = lookup("tools");
  if (tools) facts.push({ label: "Toolkit", value: tools });

  const goal = lookup("goal");
  if (goal) facts.push({ label: "Top Goal", value: goal });

  const budget = lookup("budget");
  if (budget) facts.push({ label: "Budget", value: budget });

  const timeline = lookup("timeline");
  if (timeline) facts.push({ label: "Timeline", value: timeline });

  return {
    facts,
    departments: lookupAll("department"),
    blockers: lookupAll("challenge"),
  };
}
