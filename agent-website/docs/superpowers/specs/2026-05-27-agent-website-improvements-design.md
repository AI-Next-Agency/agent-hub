# Agent Website Improvements — Design Spec

**Date:** 2026-05-27  
**Scope:** 4 independent improvements to agent-website (hero redesign, audit backend, radio button UX fix, blur gate)  
**Approach:** A (minimal, fast)

---

## 1. Hero Redesign — Free 1-Hour Training CTA

### Goal
Replace the generic "AI mindset for Businesses" pill and "Book a Free Call" CTA with a clear offer: a free 1-hour training session. Qualify leads via email directly above the fold.

### Changes to `src/components/sections/HeroSection.tsx`

- **Pill badge:** "Free 1-Hour Training Session" (replaces "AI mindset for Businesses")
- **H1:** Unchanged
- **Description:** Existing text stays. Below it, 3 benefit lines are added:
  - ✓ Walk away with an AI workflow you can use the next day
  - ✓ Tailored to your team's tools and real work
  - ✓ No tech background needed
- **Primary CTA:** Replaced with an inline email form — `<input type="email" placeholder="Enter your work email" />` + "Claim Free Training" submit button. On submit, POSTs to `/api/audit-submit` with `{ email, source: "hero" }`. On success, shows a confirmation message in place of the form ("We'll be in touch shortly."). No page redirect.
- **Secondary CTA:** "Explore departments" link — unchanged.

### Changes to `src/content/site.ts`

- `CTA_LABEL` stays as-is (used elsewhere)
- `BOOK_CALL_URL` stays as-is (used in CTASection and other places)
- No new constants needed; hero form POSTs directly to the API route

---

## 2. Audit Form Backend — Google Sheets + Email

### Goal
Every audit email submission (both hero qualify form and audit results unlock) is persisted to a Google Sheet and triggers two emails: a report email to the user and a lead notification to the team.

### New file: `src/app/api/audit-submit/route.ts`

**Method:** `POST`

**Request body:**
```ts
{
  email: string
  source: "hero" | "audit"
  // audit-only fields (omitted when source === "hero"):
  score?: number
  level?: string
  teamT?: number
  teamE?: number
  teamA?: number
  teamM?: number
  departments?: string[]
  blockers?: string[]
  tools?: string
  goal?: string
  budget?: string
  timeline?: string
  teamSize?: string
  aiUsage?: string
}
```

**Processing (parallel):**

1. **Google Sheets (Sheets API v4)**
   - Authenticates with a service account (`GOOGLE_SERVICE_ACCOUNT_KEY` env var, base64-encoded JSON)
   - Appends a row to the sheet identified by `GOOGLE_SHEET_ID`
   - Row columns: `timestamp | source | email | score | level | teamT | teamE | teamA | teamM | departments | blockers | tools | goal | budget | timeline | teamSize | aiUsage`
   - Hero submissions fill only `timestamp | source | email`, rest are empty

2. **Email via Resend (`RESEND_API_KEY` env var)**
   - **User email** (when `source === "audit"`): Subject "Your AI Readiness Report", body includes maturity level, overall score, and a CTA link to book a call (`BOOK_CALL_URL`)
   - **Hero source:** Send a simpler "Thanks, we'll be in touch" confirmation email to the user
   - **Team notification** (always): To `nihat@inflownetwork.com`, subject "New lead — [source]", body includes email + score summary (if audit)

**Response:** `{ ok: true }` on success, `{ ok: false, error: string }` on failure (HTTP 500)

**Error handling:** If Sheets write fails, still attempt to send email (and vice versa). Both failures are logged server-side. Client shows a generic error only if both fail.

### Required environment variables

| Variable | Description |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Base64-encoded service account JSON |
| `GOOGLE_SHEET_ID` | ID from the Google Sheet URL |
| `RESEND_API_KEY` | Resend API key |

### Dependencies to install
- `googleapis` (Google Sheets API client)
- `resend` (email)

---

## 3. Radio Button UX Fix

### Problem
Single-select questions in `AuditQuiz.tsx` render a square checkbox indicator (`□`) on the left, which implies multi-select. Only one option can be selected, so users are confused.

### Fix in `src/components/AuditQuiz.tsx`

For questions where `question.type === "single"`, the option indicator changes from a square/checkbox shape to a circle/radio shape. This is a CSS className change only — no logic changes.

- `single` type: render `rounded-full` indicator (radio circle `○`)
- `multi` type: render `rounded-sm` indicator (checkbox square `□`) — unchanged

No changes to selection logic, auto-advance behavior, or data structure.

---

## 4. Blur Gate on Audit Results

### Goal
Show enough results to demonstrate value (score + maturity level), then blur the rest and collect email before revealing the full report. Consolidates the existing PDF email gate into a single gate.

### Changes to `src/components/AuditResults.tsx`

**Visible by default (no blur):**
- Hero section: maturity level badge, overall score %, maturity spectrum chart with "YOU" pin

**Blurred until email submitted:**
- TEAM Framework section
- Radar chart
- Biggest Gap / Strongest Dimension cards
- Tailored Advice grid
- Snapshot
- 90-Day Roadmap
- Typewriter quotes

**Blur implementation:**
- Blurred content wrapped in a `div` with `filter: blur(8px)`, `select-none`, `pointer-events-none`
- A sticky/fixed card overlaid at the top of the blurred zone:
  - Heading: "Unlock your full report"
  - Subtext: "Enter your work email to see your TEAM breakdown, advice, and 90-day roadmap."
  - Input: `type="email"` + "Unlock" button
  - On submit: POST to `/api/audit-submit` with full audit data + `source: "audit"`
  - On success: blur removed via React state (`isUnlocked: boolean`), no page reload
  - On error: inline error message below the form

**Existing PDF email gate:** Removed. The unlock gate above replaces it — one email collection point per session.

**State:** `isUnlocked` is component-local React state. If the user reloads the page, the gate reappears (by design — email was already captured).

---

## File Change Summary

| File | Change |
|---|---|
| `src/components/sections/HeroSection.tsx` | Inline email form, benefit bullets, new pill text |
| `src/app/api/audit-submit/route.ts` | New — Google Sheets + Resend handler |
| `src/components/AuditQuiz.tsx` | Radio vs checkbox indicator by question type |
| `src/components/AuditResults.tsx` | Blur gate, remove old PDF email gate |
| `.env.local` (not committed) | 3 new env vars |
| `package.json` | Add `googleapis`, `resend` |

---

## Out of Scope

- Fillout form replacement (existing booking flow unchanged)
- PDF generation server-side
- Auth / persistent session (blur state is ephemeral)
- Any changes to audit questions or scoring logic
