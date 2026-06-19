export type AuditOption = {
  label: string;
  value: string;
  score: number;
  example?: string;
};

export type AuditQuestion = {
  id: string;
  question: string;
  subtitle: string;
  options: AuditOption[];
  multiSelect?: boolean;
  dimension: "T" | "E" | "A" | "M";
};

export type AuditResult = {
  level: string;
  title: string;
  range: [number, number];
  summary: string;
  recommendations: string[];
};

export const auditQuestions: AuditQuestion[] = [
  /* ─── TALENT ─── */
  {
    id: "team-size",
    dimension: "T",
    question: "How large is your team?",
    subtitle: "This helps us understand the scope of AI adoption.",
    options: [
      { label: "1 — 10 people", value: "small", score: 1 },
      { label: "11 — 50 people", value: "medium", score: 2 },
      { label: "51 — 200 people", value: "large", score: 3 },
      { label: "200+ people", value: "enterprise", score: 4 },
    ],
  },
  {
    id: "department",
    dimension: "T",
    question: "Which departments need AI training?",
    subtitle: "Select all that apply — we'll tailor recommendations for each.",
    multiSelect: true,
    options: [
      { label: "Marketing & Sales", value: "marketing-sales", score: 3 },
      { label: "Finance & Operations", value: "finance-ops", score: 3 },
      { label: "Engineering & Product", value: "engineering", score: 3 },
      { label: "HR & People", value: "hr", score: 2 },
      { label: "Leadership & Executive", value: "leadership", score: 4 },
      { label: "Customer Success & Support", value: "cs", score: 2 },
    ],
  },

  /* ─── EDUCATION ─── */
  {
    id: "ai-usage",
    dimension: "E",
    question: "How does your team currently use AI?",
    subtitle: "Be honest — there are no wrong answers.",
    options: [
      { label: "We don't use AI at all", value: "none", score: 1 },
      { label: "A few individuals experiment on their own", value: "individual", score: 2 },
      { label: "Some teams use AI tools regularly", value: "partial", score: 3 },
      { label: "AI is embedded in our daily workflows", value: "embedded", score: 4 },
    ],
  },
  {
    id: "challenge",
    dimension: "E",
    question: "What's blocking AI adoption in your team?",
    subtitle: "Pick all that resonate — blockers often stack.",
    multiSelect: true,
    options: [
      { label: "We don't know where to start", value: "no-start", score: 1 },
      { label: "Team is skeptical or resistant", value: "resistance", score: 2 },
      { label: "We lack internal AI expertise", value: "no-expertise", score: 2 },
      { label: "Tools are scattered with no shared workflow", value: "fragmented", score: 2 },
      { label: "Leadership hasn't prioritized it yet", value: "no-buy-in", score: 1 },
      { label: "We need to scale what already works", value: "scale", score: 4 },
    ],
  },
  /* ─── APPLICATION ─── */
  {
    id: "tools",
    dimension: "A",
    question: "Which AI tools does your team use today?",
    subtitle: "Select the option that best describes your current toolkit.",
    options: [
      {
        label: "None yet",
        value: "none",
        score: 1,
        example: "No AI tools in use",
      },
      {
        label: "General-purpose chatbots",
        value: "chatbots",
        score: 2,
        example: "ChatGPT, Claude, Gemini",
      },
      {
        label: "AI features inside existing software",
        value: "built-in",
        score: 3,
        example: "Copilot in Office, Notion AI, Salesforce Einstein",
      },
      {
        label: "Custom AI workflows or automations",
        value: "custom",
        score: 4,
        example: "n8n, Zapier AI, custom GPT agents, API integrations",
      },
    ],
  },
  {
    id: "goal",
    dimension: "A",
    question: "What outcome matters most to your team right now?",
    subtitle: "Choose the one that would create the most visible impact.",
    options: [
      {
        label: "Cut hours of manual work every week",
        value: "efficiency",
        score: 2,
        example: "Reporting, data entry, scheduling, summarizing",
      },
      {
        label: "Make faster decisions backed by real data",
        value: "decisions",
        score: 3,
        example: "Forecasting, analysis, performance reviews",
      },
      {
        label: "Produce better content and comms at scale",
        value: "content",
        score: 2,
        example: "Proposals, campaigns, emails, documentation",
      },
      {
        label: "Build a lasting AI edge over competitors",
        value: "advantage",
        score: 4,
        example: "AI-native workflows, proprietary automation, upskilled teams",
      },
    ],
  },
  /* ─── MOMENTUM ─── */
  {
    id: "budget",
    dimension: "M",
    question: "Do you have a budget allocated for AI training?",
    subtitle: "This helps us match you with the right program scope.",
    options: [
      { label: "I'd be interested if we see results first", value: "results-first", score: 2 },
      { label: "Informal budget, under €5,000", value: "small", score: 2 },
      { label: "Dedicated budget of €5,000 – €20,000", value: "medium", score: 3 },
      { label: "Significant budget, €20,000+", value: "large", score: 4 },
    ],
  },
  {
    id: "timeline",
    dimension: "M",
    question: "When do you want to start?",
    subtitle: "Training programs can be shaped for different timelines.",
    options: [
      { label: "Just exploring for now", value: "exploring", score: 1 },
      { label: "Within the next month", value: "soon", score: 3 },
      { label: "This quarter", value: "quarter", score: 4 },
      { label: "Already overdue — we need to move fast", value: "urgent", score: 4 },
    ],
  },
];

// Score range: 8 questions × 1–4 pts = 8–32
export const auditResults: AuditResult[] = [
  {
    level: "early",
    title: "Early Stage",
    range: [8, 15],
    summary:
      "Your team is at the beginning of the AI adoption journey. This is actually a great position — you can build the right habits and workflows from the start, without having to undo bad practices.",
    recommendations: [
      "Start with an executive AI awareness workshop to align leadership",
      "Run a department-specific discovery session to find high-impact use cases",
      "Introduce foundational AI literacy training for the whole team",
      "Set up a small pilot project to build confidence and momentum",
    ],
  },
  {
    level: "developing",
    title: "Developing",
    range: [16, 21],
    summary:
      "Your team has started experimenting with AI but hasn't yet built consistent practices. The biggest risk at this stage is scattered adoption — some people racing ahead while others fall behind.",
    recommendations: [
      "Standardize AI tool usage with role-based training programs",
      "Create shared workflows and prompt libraries for your most common tasks",
      "Train team leads to become internal AI champions",
      "Assess which departments would benefit most from structured AI education",
    ],
  },
  {
    level: "advancing",
    title: "Advancing",
    range: [22, 27],
    summary:
      "Your team is already using AI meaningfully. The opportunity now is to go deeper — moving from individual productivity gains to organization-wide AI capability that compounds over time.",
    recommendations: [
      "Build advanced AI workflows tailored to each department's specific needs",
      "Develop internal AI governance and responsible use guidelines",
      "Train teams on custom automation and AI integration patterns",
      "Measure AI impact with clear KPIs tied to business outcomes",
    ],
  },
  {
    level: "leading",
    title: "Leading",
    range: [28, 32],
    summary:
      "Your organization is ahead of most companies in AI adoption. The next step is building a sustainable AI culture — continuous learning, advanced tooling, and staying ahead as the technology evolves.",
    recommendations: [
      "Implement advanced AI agent workflows and custom automation",
      "Establish a continuous AI learning program to keep pace with rapid changes",
      "Explore AI-driven strategic initiatives unique to your industry",
      "Consider building proprietary AI tools tailored to your business processes",
    ],
  },
];

export function getAuditResult(totalScore: number): AuditResult {
  for (const result of auditResults) {
    if (totalScore >= result.range[0] && totalScore <= result.range[1]) {
      return result;
    }
  }
  // Clamp to nearest
  return totalScore < 16 ? auditResults[0] : auditResults[auditResults.length - 1];
}

export function getScorePercentage(totalScore: number): number {
  const min = 8;
  const max = 32;
  return Math.round(((totalScore - min) / (max - min)) * 100);
}

/* ────────── Dimension breakdown ────────── */

export type DimensionLabel = {
  questionId: string;
  label: string;
  short: string;
};

export const dimensionLabels: DimensionLabel[] = [
  { questionId: "team-size", label: "Team Scale", short: "Scale" },
  { questionId: "ai-usage", label: "Current AI Usage", short: "Usage" },
  { questionId: "department", label: "Department Coverage", short: "Departments" },
  { questionId: "challenge", label: "Adoption Maturity", short: "Maturity" },
  { questionId: "tools", label: "Tooling Sophistication", short: "Tools" },
  { questionId: "goal", label: "Strategic Ambition", short: "Ambition" },
  { questionId: "budget", label: "Investment Readiness", short: "Investment" },
  { questionId: "timeline", label: "Urgency to Start", short: "Urgency" },
];

export function getDimensionScores(
  answers: Record<string, { values: string[]; score: number }>
): { label: string; short: string; score: number; max: number }[] {
  return dimensionLabels.map((dim) => ({
    label: dim.label,
    short: dim.short,
    score: answers[dim.questionId]?.score ?? 0,
    max: 4,
  }));
}

/* ────────── TEAM Framework ────────── */
/**
 * The TEAM Framework — our own AI readiness model designed
 * specifically for company teams adopting AI:
 *
 *   T — Talent      — Who's on the team and which departments
 *   E — Education   — Current AI usage and learning maturity
 *   A — Application — Real-world AI tools and strategic intent
 *   M — Momentum    — Investment readiness and urgency to act
 *
 * Each dimension is fed by 2 of the 8 audit questions, scoring 2–8 pts.
 */

export type TeamDimensionKey = "T" | "E" | "A" | "M";

export type TeamDimension = {
  key: TeamDimensionKey;
  letter: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  questionIds: string[];
  industryAvg: number; // out of 8 — illustrative benchmark
};

export const teamDimensions: TeamDimension[] = [
  {
    key: "T",
    letter: "T",
    name: "Talent",
    short: "Talent",
    tagline: "Your people and reach",
    description:
      "The size of your team and the breadth of departments AI training would touch.",
    questionIds: ["team-size", "department"],
    industryAvg: 5,
  },
  {
    key: "E",
    letter: "E",
    name: "Education",
    short: "Education",
    tagline: "Your learning maturity",
    description:
      "How embedded AI usage is today, and what's blocking deeper adoption.",
    questionIds: ["ai-usage", "challenge"],
    industryAvg: 4,
  },
  {
    key: "A",
    letter: "A",
    name: "Application",
    short: "Application",
    tagline: "Your real-world use",
    description:
      "The tools your team uses and the strategic outcomes you're chasing.",
    questionIds: ["tools", "goal"],
    industryAvg: 4,
  },
  {
    key: "M",
    letter: "M",
    name: "Momentum",
    short: "Momentum",
    tagline: "Your readiness to act",
    description:
      "The budget allocated and the timeline driving how fast you need to move.",
    questionIds: ["budget", "timeline"],
    industryAvg: 5,
  },
];

export type TeamScore = {
  key: TeamDimensionKey;
  name: string;
  short: string;
  letter: string;
  tagline: string;
  description: string;
  score: number; // 2–8
  max: number; // 8
  industryAvg: number;
  percentage: number;
};

export function getTeamScores(
  answers: Record<string, { values: string[]; score: number }>
): TeamScore[] {
  return teamDimensions.map((dim) => {
    const score = dim.questionIds.reduce(
      (sum, qid) => sum + (answers[qid]?.score ?? 0),
      0
    );
    const max = dim.questionIds.length * 4;
    return {
      key: dim.key,
      name: dim.name,
      short: dim.short,
      letter: dim.letter,
      tagline: dim.tagline,
      description: dim.description,
      score,
      max,
      industryAvg: dim.industryAvg,
      percentage: max === 0 ? 0 : Math.round((score / max) * 100),
    };
  });
}

/* Recommendations per dimension, varying by score level */
export type DimensionAdvice = {
  priority: "high" | "medium" | "low";
  headline: string;
  detail: string;
};

export function getDimensionAdvice(
  dim: TeamScore
): DimensionAdvice {
  const isLow = dim.percentage < 50;
  const isMid = dim.percentage >= 50 && dim.percentage < 75;
  const priority: "high" | "medium" | "low" = isLow ? "high" : isMid ? "medium" : "low";

  const advice: Record<TeamDimensionKey, [string, string][]> = {
    T: [
      [
        "Map AI exposure across all your departments",
        "Run a quick capability survey department-by-department to find which teams are AI-ready and which need foundational training.",
      ],
      [
        "Roll out role-based AI training to your priority teams",
        "With your team scale, group training sessions tailored per function will get adoption faster than one-size-fits-all workshops.",
      ],
      [
        "Develop internal AI champions across functions",
        "You have the talent base to sustain organization-wide AI literacy — build a lasting program with department leads as multipliers.",
      ],
    ],
    E: [
      [
        "Start with foundational AI literacy training",
        "Get everyone on the same baseline — what AI is, what it can and can't do, and how to use it responsibly.",
      ],
      [
        "Standardize practices with shared workflows and prompt libraries",
        "Move beyond scattered individual experimentation. Create the shared knowledge layer that lets the team compound learning.",
      ],
      [
        "Establish governance and an advanced-use curriculum",
        "Your team is mature enough to need responsible-use guidelines and deeper training on advanced patterns.",
      ],
    ],
    A: [
      [
        "Audit your toolkit and define a recommended stack",
        "Replace ad-hoc tool sprawl with a small, well-chosen set of AI tools, plus training on how to use each well.",
      ],
      [
        "Build workflow templates inside the tools you already use",
        "Stop reinventing each task — package recurring AI workflows so they're easy to share and improve.",
      ],
      [
        "Invest in custom automations and proprietary AI workflows",
        "Your toolkit is solid. Now build automations and integrations that competitors can't easily copy.",
      ],
    ],
    M: [
      [
        "Build a small business case to unlock budget for a pilot",
        "Quantify expected time savings or revenue impact for one team. A small win unlocks the budget for the bigger rollout.",
      ],
      [
        "Convert your interest into a structured 90-day plan",
        "Budget and intent are there — now define concrete milestones, KPIs, and a pilot scope that can ship in a quarter.",
      ],
      [
        "Move fast — your readiness window is wide open",
        "You have urgency, budget, and intent aligned. Don't lose momentum; lock in a kickoff in the next two weeks.",
      ],
    ],
  };

  const adviceList = advice[dim.key];
  const idx = isLow ? 0 : isMid ? 1 : 2;
  const [headline, detail] = adviceList[idx];

  return { priority, headline, detail };
}

/* Find the dimension with the biggest gap (lowest %) */
export function getBiggestGap(scores: TeamScore[]): TeamScore {
  return scores.reduce((min, s) => (s.percentage < min.percentage ? s : min));
}

/* Find the dimension where the user is strongest */
export function getStrongestDimension(scores: TeamScore[]): TeamScore {
  return scores.reduce((max, s) => (s.percentage > max.percentage ? s : max));
}

/* ────────── Roadmap ────────── */

export type RoadmapPhase = {
  window: string;
  title: string;
  bullets: string[];
};

export const roadmapByLevel: Record<string, RoadmapPhase[]> = {
  early: [
    {
      window: "First 30 days",
      title: "Set the foundation",
      bullets: [
        "Run a leadership AI awareness session to align on direction",
        "Audit current tools and shadow IT — what's already in use?",
        "Pick one department for a focused pilot",
      ],
    },
    {
      window: "30 — 60 days",
      title: "Build literacy",
      bullets: [
        "Roll out foundational AI training for the pilot team",
        "Establish shared prompt and workflow library",
        "Define responsible-use guidelines for the company",
      ],
    },
    {
      window: "60 — 90 days",
      title: "Prove value",
      bullets: [
        "Measure pilot impact with concrete KPIs",
        "Plan rollout to the next two departments",
        "Recruit internal AI champions in each function",
      ],
    },
  ],
  developing: [
    {
      window: "First 30 days",
      title: "Standardize practices",
      bullets: [
        "Map current AI usage and surface scattered experiments",
        "Pick top 3 use cases per department to formalize",
        "Set up role-based training tracks",
      ],
    },
    {
      window: "30 — 60 days",
      title: "Train and enable",
      bullets: [
        "Deliver department-specific AI workshops",
        "Document shared workflows and prompt libraries",
        "Equip team leads as AI champions",
      ],
    },
    {
      window: "60 — 90 days",
      title: "Scale impact",
      bullets: [
        "Connect AI workflows to existing tools and processes",
        "Set measurable adoption KPIs",
        "Identify advanced use cases for next quarter",
      ],
    },
  ],
  advancing: [
    {
      window: "First 30 days",
      title: "Deepen capability",
      bullets: [
        "Map advanced workflows ready for AI augmentation",
        "Run advanced training for power users",
        "Define internal AI governance standards",
      ],
    },
    {
      window: "30 — 60 days",
      title: "Embed AI in operations",
      bullets: [
        "Build custom automations for top recurring workflows",
        "Train teams on responsible AI integration patterns",
        "Tie AI usage to business KPIs",
      ],
    },
    {
      window: "60 — 90 days",
      title: "Compound advantage",
      bullets: [
        "Launch organization-wide AI literacy program",
        "Establish review cadence for new AI tools",
        "Plan strategic AI initiatives unique to your industry",
      ],
    },
  ],
  leading: [
    {
      window: "First 30 days",
      title: "Sharpen the edge",
      bullets: [
        "Audit AI maturity across departments — find remaining gaps",
        "Identify proprietary AI opportunities unique to your business",
        "Align leadership on long-term AI strategy",
      ],
    },
    {
      window: "30 — 60 days",
      title: "Build proprietary leverage",
      bullets: [
        "Prototype a custom AI workflow that competitors can't copy",
        "Stand up internal AI center of excellence",
        "Establish continuous learning rhythm for the team",
      ],
    },
    {
      window: "60 — 90 days",
      title: "Lead the market",
      bullets: [
        "Ship the proprietary AI workflow into production",
        "Externalize learnings — case studies, talks, hiring brand",
        "Measure compounded business impact and reinvest",
      ],
    },
  ],
};

/* ────────── Peer benchmark (illustrative) ────────── */

// Approximate distribution of teams across maturity levels — used purely
// for the "you're ahead of X%" peer comparison.
export function getPeerBenchmark(percentage: number): {
  ahead: number;
  description: string;
} {
  // Map our percentage to a curved peer-ahead value
  const ahead = Math.max(5, Math.min(96, Math.round(percentage * 0.95 + 4)));
  let description = "";
  if (percentage < 25) {
    description = "You're earlier than most teams we assess — and that's a real opportunity.";
  } else if (percentage < 55) {
    description = "You're moving in the right direction, on pace with most peers.";
  } else if (percentage < 80) {
    description = "You're meaningfully ahead of most peer teams.";
  } else {
    description = "You're in the top tier — very few teams reach this level.";
  }
  return { ahead, description };
}

