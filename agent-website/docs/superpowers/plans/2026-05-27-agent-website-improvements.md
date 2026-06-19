# Agent Website Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a free 1-hour training CTA to the hero, wire audit form submissions to Google Sheets + email via GAS webhook, fix single-select question indicators to show radio buttons, and blur-gate the audit results behind an email form.

**Architecture:** The site is a Next.js static export (no API routes). All backend integration uses a Google Apps Script web app deployed as a public GET endpoint — the client sends URL params, GAS appends a Sheet row and sends email. A shared `submitAuditLead()` utility in `src/lib/audit-submit.ts` is used by both the hero form and the audit results gate. The blur gate is a CSS overlay (`blur-sm` + `pointer-events-none`) controlled by `isUnlocked` React state in `AuditResults`.

**Tech Stack:** Next.js 16 (static export), TypeScript, Tailwind CSS v4, Google Apps Script (external), Bun

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/lib/audit-submit.ts` | **Create** | Shared `submitAuditLead()` utility — fires GET to GAS webhook |
| `src/components/sections/HeroSection.tsx` | **Modify** | Inline email form, benefit bullets, new pill text |
| `src/components/AuditQuiz.tsx` | **Modify** | Radio circle for single-select questions (line 226) |
| `src/components/AuditResults.tsx` | **Modify** | Blur gate over TEAM+ sections, remove old PDF email gate |
| `.env.local` | **Create** | `NEXT_PUBLIC_GAS_WEBHOOK_URL` |

---

## Task 1: Google Apps Script webhook setup

**Files:**
- External: Google Apps Script (manual setup — not committed to repo)
- Create: `.env.local`

This task is manual configuration. No code to commit in the repo.

- [ ] **Step 1: Create the Apps Script**

Go to [script.google.com](https://script.google.com), create a new project named "AI Audit Webhook", paste this code:

```javascript
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // replace after creating sheet
const NOTIFY_EMAIL = "nihat@inflownetwork.com";

function doGet(e) {
  try {
    const params = e.parameter;
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    sheet.appendRow([
      new Date().toISOString(),
      params.source || "",
      params.email || "",
      params.score || "",
      params.level || "",
      params.teamT || "",
      params.teamE || "",
      params.teamA || "",
      params.teamM || "",
      params.departments || "",
      params.blockers || "",
      params.tools || "",
      params.goal || "",
      params.budget || "",
      params.timeline || "",
      params.teamSize || "",
      params.aiUsage || "",
    ]);

    if (params.source === "audit" && params.email) {
      MailApp.sendEmail({
        to: params.email,
        subject: "Your AI Readiness Report — " + (params.level || "Results"),
        body:
          "Hi,\n\nYour AI Readiness score: " +
          params.score +
          "% (" +
          params.level +
          ").\n\nBook a free 1-hour training session to turn these insights into action:\nhttps://forms.fillout.com/t/6hCpLMsMhKus\n\nBest,\nAI Automation Agent team",
      });
    }

    if (params.source === "hero" && params.email) {
      MailApp.sendEmail({
        to: params.email,
        subject: "Your Free 1-Hour Training Session",
        body:
          "Hi,\n\nThanks for signing up. We'll be in touch shortly to schedule your free 1-hour AI training session.\n\nBest,\nAI Automation Agent team",
      });
    }

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "New lead [" + (params.source || "unknown") + "] — " + (params.email || "no email"),
      body:
        "Source: " + (params.source || "") + "\n" +
        "Email: " + (params.email || "") + "\n" +
        "Score: " + (params.score || "N/A") + "% (" + (params.level || "") + ")\n" +
        "Team T/E/A/M: " + [params.teamT, params.teamE, params.teamA, params.teamM].join(" / ") + "\n" +
        "Departments: " + (params.departments || "") + "\n" +
        "Blockers: " + (params.blockers || "") + "\n" +
        "Budget: " + (params.budget || "") + "\n" +
        "Timeline: " + (params.timeline || ""),
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

- [ ] **Step 2: Create the Google Sheet**

Go to [sheets.google.com](https://sheets.google.com), create a new sheet named "AI Audit Leads". Add header row in row 1:

```
timestamp | source | email | score | level | teamT | teamE | teamA | teamM | departments | blockers | tools | goal | budget | timeline | teamSize | aiUsage
```

Copy the Sheet ID from the URL (`/d/SHEET_ID/edit`) and paste it into the `SHEET_ID` constant in the Apps Script.

- [ ] **Step 3: Deploy the Apps Script**

In the Apps Script editor: Deploy → New deployment → Web app.
- Execute as: **Me**
- Who has access: **Anyone**

Copy the deployment URL (looks like `https://script.google.com/macros/s/AKfy.../exec`).

- [ ] **Step 4: Create `.env.local`**

```bash
# in agent-website root
echo "NEXT_PUBLIC_GAS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" > .env.local
```

Replace `YOUR_SCRIPT_ID` with the actual script ID from step 3.

- [ ] **Step 5: Test the webhook manually**

Open this URL in browser (replace values):
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?source=test&email=test@example.com&score=72&level=Developing
```

Expected: `{"ok":true}` in browser, new row in the Sheet, notification email received at nihat@inflownetwork.com.

---

## Task 2: Create `src/lib/audit-submit.ts`

**Files:**
- Create: `src/lib/audit-submit.ts`

- [ ] **Step 1: Create the file**

```typescript
export interface AuditLeadData {
  email: string;
  source: "hero" | "audit";
  score?: number;
  level?: string;
  teamT?: number;
  teamE?: number;
  teamA?: number;
  teamM?: number;
  departments?: string;
  blockers?: string;
  tools?: string;
  goal?: string;
  budget?: string;
  timeline?: string;
  teamSize?: string;
  aiUsage?: string;
}

export async function submitAuditLead(data: AuditLeadData): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_GAS_WEBHOOK_URL;
  if (!webhookUrl) return;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }

  await fetch(`${webhookUrl}?${params.toString()}`, { mode: "no-cors" });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bun run build 2>&1 | head -20
```

Expected: no type errors from the new file.

- [ ] **Step 3: Commit**

```bash
git add src/lib/audit-submit.ts .env.local
git commit -m "feat: add audit-submit utility for GAS webhook integration"
```

Note: `.env.local` should be in `.gitignore` already (Next.js default). Verify with `cat .gitignore | grep env`.

---

## Task 3: Hero redesign

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Rewrite HeroSection.tsx**

Replace the entire file content with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { homePageContent } from "@/content/site";
import { AsciiArt } from "../ui/ascii-art";
import { submitAuditLead } from "@/lib/audit-submit";

const BENEFITS = [
  "Walk away with an AI workflow you can use the next day",
  "Tailored to your team's tools and real work",
  "No tech background needed",
];

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid work email.");
      return;
    }
    setLoading(true);
    await submitAuditLead({ email, source: "hero" });
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section className="px-6 pb-12 pt-8">
      <div className="relative elegant-container mx-auto max-w-6xl px-8 py-16 md:px-16 md:py-20 lg:py-28">
        <span className="elegant-pill mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 text-xs text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Free 1-Hour Training Session
        </span>

        <h1 className="max-w-3xl text-4xl font-normal leading-[1.15] tracking-tight text-text md:text-5xl lg:text-6xl">
          {homePageContent.heroTitle}
          <br />
          with{" "}
          <span className="font-display-italic text-accent">precision</span>
          {" "}and{" "}
          <span className="font-display-italic text-accent">confidence.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary">
          {homePageContent.heroDescription}
        </p>

        <ul className="mt-4 space-y-1.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-text-secondary">
              <Check size={13} className="shrink-0 text-accent" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
          {submitted ? (
            <p className="flex items-center gap-2 text-sm text-text-secondary">
              <Check size={14} className="text-accent" />
              {"We'll be in touch shortly."}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary sm:w-64"
                />
                {error && <p className="text-xs text-accent">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="elegant-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium disabled:opacity-60"
              >
                Claim Free Training
                <ArrowRight size={14} />
              </button>
            </form>
          )}
          <Link
            href="/applications"
            className="elegant-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm text-text-secondary"
          >
            Explore departments
          </Link>
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-1/4 overflow-hidden hidden md:block">
          <AsciiArt
            src="https://artifio.b-cdn.net/public/ai/313FFC12-D448-42C3-AE49-FA4961DF7AD3.jpeg"
            resolution={80}
            color="var(--color-neutral-900)"
            animationStyle="matrix"
            animationDuration={10}
            animateOnView={false}
            colored={false}
            inverted={true}
            className="mx-auto h-full max-w-lg bg-neutral-500 absolute right-0 opacity-30"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build check**

```bash
bun run build 2>&1 | tail -20
```

Expected: build succeeds, no type errors.

- [ ] **Step 3: Dev check**

```bash
bun run dev
```

Open `http://localhost:3000`. Verify:
- Pill shows "Free 1-Hour Training Session"
- 3 benefit bullets visible with check icons
- Email input + "Claim Free Training" button present
- "Explore departments" link below
- Submitting a valid email shows "We'll be in touch shortly."
- Submitting invalid email shows error message

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat(hero): add free training CTA with inline email form and benefit bullets"
```

---

## Task 4: Radio button fix in AuditQuiz

**Files:**
- Modify: `src/components/AuditQuiz.tsx` (line 226)

- [ ] **Step 1: Apply the fix**

In `src/components/AuditQuiz.tsx`, find the indicator `<span>` at line 226. The current code:

```tsx
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >
```

Replace with:

```tsx
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                      !isMulti ? "rounded-full" : ""
                    } ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/ai-audit`. Confirm:
- Single-select questions (e.g. Q1 team size): option indicators are circles (○)
- Multi-select questions (e.g. Q2 departments): option indicators remain squares (□)

- [ ] **Step 3: Commit**

```bash
git add src/components/AuditQuiz.tsx
git commit -m "fix(audit-quiz): use radio circle indicator for single-select questions"
```

---

## Task 5: Blur gate in AuditResults

**Files:**
- Modify: `src/components/AuditResults.tsx`

The existing email gate (lines 534–601) opens a Fillout URL in a new tab. We replace this with an inline email form that fires the GAS webhook and unlocks the blurred content in place.

- [ ] **Step 1: Add imports and state**

At the top of `AuditResults.tsx`, add `submitAuditLead` to the imports. Find the existing imports block and add:

```tsx
import { submitAuditLead } from "@/lib/audit-submit";
```

Then in the component body, after the existing `const [emailSent, setEmailSent] = useState(false);` state declarations, add:

```tsx
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
```

- [ ] **Step 2: Add unlock handler**

After the existing `handleEmailSubmit` function, add:

```tsx
  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setUnlockError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setUnlockError("Please enter a valid work email.");
      return;
    }
    setUnlockLoading(true);
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
    setUnlockLoading(false);
    setIsUnlocked(true);
  }
```

- [ ] **Step 3: Wrap gated sections**

Find the `{/* ───── QUOTE 1 ─── */}` comment (line ~299). Everything from QUOTE 1 through QUOTE 4 (line ~530) needs to be wrapped. Replace this block:

```tsx
      {/* ───── QUOTE 1 — encouragement, AI as friend ───── */}
      <TypewriterQuote
```

...all the way through to and including the `{/* ───── EMAIL GATE / PDF ───── */}` section (lines 534–601), replacing the entire range with:

```tsx
      {/* ───── QUOTE 1 always visible ───── */}
      <TypewriterQuote
        text="Most teams aren't behind because they lack intelligence — they lack a system. This report gives you the system."
        attribution="From the AI Automation Agent framework"
        variant="encouragement"
      />

      {/* ───── GATED CONTENT ───── */}
      <div className="relative">
        <div
          className={`space-y-4 transition-[filter] duration-500 ${
            !isUnlocked ? "pointer-events-none select-none blur-sm" : ""
          }`}
        >
          {/* ───── TEAM FRAMEWORK INTRO ───── */}
          <section id="team-framework" className="elegant-container print-page-break p-6 sm:p-8 md:p-12">
```

Then close the inner `</div>` and the outer `<div className="relative">` after the QUOTE 4 section, before the ACTIONS section. The structure becomes:

```tsx
          {/* ... TEAM FRAMEWORK, QUOTE 2, GAP/STRENGTH, ADVICE, QUOTE 3, SNAPSHOT, ROADMAP, QUOTE 4 ... */}
        </div>{/* end blur wrapper */}

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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
                {unlockError && (
                  <p className="text-xs text-accent">{unlockError}</p>
                )}
                <button
                  type="submit"
                  disabled={unlockLoading}
                  className="elegant-btn-primary flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium disabled:opacity-60"
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
      </div>{/* end relative wrapper */}
```

- [ ] **Step 4: Remove old email gate section**

Delete the entire `{/* ───── EMAIL GATE / PDF ───── */}` section (lines 534–601 in the original file — now replaced in step 3 above). Confirm the `handleEmailSubmit` function is no longer called anywhere and remove it too.

- [ ] **Step 5: Add ArrowRight import if missing**

Check the import block at the top of AuditResults.tsx:

```bash
grep "ArrowRight" src/components/AuditResults.tsx
```

If not present, add it to the lucide-react import line.

- [ ] **Step 6: Build check**

```bash
bun run build 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 7: Manual test in browser**

```bash
bun run dev
```

Open `http://localhost:3000/ai-audit`, complete the quiz. On results page:
- Score + maturity level visible (not blurred)
- QUOTE 1 visible (not blurred)
- Everything below QUOTE 1 is blurred
- "Unlock your full report" card appears over the blurred zone
- Submitting valid email removes blur and shows all content
- Submitting invalid email shows error message
- Old "Email me the PDF" section is gone

- [ ] **Step 8: Commit**

```bash
git add src/components/AuditResults.tsx
git commit -m "feat(audit-results): replace PDF email gate with blur gate that unlocks full report"
```

---

## Task 6: Push and verify

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Wait for deployment**

Check GitHub Actions for the Pages deployment workflow. Once deployed, verify on `https://www.aiautomationagent.com`:
- Hero shows "Free 1-Hour Training Session" pill + email form
- `/ai-audit` quiz shows circle indicators for single-select questions
- `/ai-audit` results show blur gate, unlocks on email submit
- Submit a test email and confirm row appears in Google Sheet + notification email received
