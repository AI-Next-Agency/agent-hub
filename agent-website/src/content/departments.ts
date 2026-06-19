import { Department } from "@/content/types";

export const departments: Department[] = [
  {
    slug: "finance",
    title: "Finance",
    cardDescription: "Train finance teams to use AI for analysis, reporting, and better decision support.",
    intro:
      "Finance teams can use AI to move faster on analysis, reporting, and internal support work without compromising judgment or control.",
    whyItMatters:
      "AI education helps finance teams understand where AI is useful, where review is essential, and how to apply it to high-volume work without introducing avoidable risk.",
    topics: [
      {
        title: "AI for reporting and analysis",
        description:
          "Teach teams how to summarize numbers, draft commentary, and accelerate recurring reporting workflows.",
      },
      {
        title: "Prompting for precision",
        description:
          "Show how to structure requests so outputs are more reliable, auditable, and easier to review.",
      },
      {
        title: "Controls, review, and risk awareness",
        description:
          "Cover where human checks matter, how to validate outputs, and how to avoid over-trusting generated content.",
      },
      {
        title: "Workflow opportunities inside finance",
        description:
          "Identify specific tasks where AI can reduce manual effort across planning, reconciliation support, and internal requests.",
      },
    ],
    outcomes: [
      "Faster first drafts for recurring reports and analysis",
      "Clearer team guidance on where AI can and cannot be used",
      "More confidence using AI with review and accountability",
    ],
    image: "/images/departments/finance.webp",
    metaTitle: "AI Education for Finance Teams",
    metaDescription:
      "See how AI workshops and finance training can improve reporting, analysis, and day-to-day efficiency for finance teams.",
    updatedAt: "2026-04-16",
  },
  {
    slug: "marketing",
    title: "Marketing",
    cardDescription: "Help marketing teams use AI for content, research, campaign planning, and creative production.",
    intro:
      "Marketing teams can use AI to speed up content development, campaign preparation, research, and experimentation without flattening their voice.",
    whyItMatters:
      "Marketing teams often adopt AI quickly, but without shared standards the results become inconsistent. Training creates a practical foundation for quality, speed, and responsible usage.",
    topics: [
      {
        title: "Content workflows with AI",
        description:
          "Teach how to move from blank page to usable draft faster across messaging, copy, and campaign assets.",
      },
      {
        title: "Research and idea generation",
        description:
          "Use AI to organize research, spot angles, and turn scattered inputs into stronger creative direction.",
      },
      {
        title: "Brand and quality guardrails",
        description:
          "Define review criteria so AI supports the team without diluting tone, accuracy, or strategic intent.",
      },
      {
        title: "Department-specific prompt patterns",
        description:
          "Build reusable prompting approaches for campaign planning, messaging, and performance reviews.",
      },
    ],
    outcomes: [
      "Faster content and campaign preparation",
      "More consistent quality across AI-assisted work",
      "Reusable workflows the team can adopt immediately",
    ],
    image: "/images/departments/marketing.webp",
    metaTitle: "AI Education for Marketing Teams",
    metaDescription:
      "Explore AI workshops and training for marketing teams across content, research, campaigns, and creative workflows.",
    updatedAt: "2026-04-16",
  },
  {
    slug: "sales",
    title: "Sales",
    cardDescription: "Equip sales teams to use AI for preparation, outreach support, and account planning.",
    intro:
      "Sales teams can use AI to prepare faster, personalize better, and spend more time on actual conversations and relationship building.",
    whyItMatters:
      "Without training, AI in sales often becomes generic automation. Education helps teams use it for sharper thinking, better preparation, and stronger customer-facing work.",
    topics: [
      {
        title: "AI-assisted account research",
        description:
          "Teach how to summarize accounts, gather context, and prepare for meetings more efficiently.",
      },
      {
        title: "Message drafting and refinement",
        description:
          "Show how to use AI for better first drafts while keeping relevance, accuracy, and tone under control.",
      },
      {
        title: "Call prep and follow-up workflows",
        description:
          "Train teams to structure prompts and outputs around meetings, objections, and next-step planning.",
      },
      {
        title: "Practical sales adoption guidelines",
        description:
          "Set boundaries for what should stay human-led and what AI can support productively.",
      },
    ],
    outcomes: [
      "Better-prepared reps with less manual prep time",
      "More useful AI-assisted drafts and follow-ups",
      "Clearer guidance on responsible AI use in customer-facing work",
    ],
    image: "/images/departments/sales.webp",
    metaTitle: "AI Education for Sales Teams",
    metaDescription:
      "Learn how AI education can help sales teams improve research, preparation, outreach support, and follow-up workflows.",
    updatedAt: "2026-04-16",
  },
  {
    slug: "operations",
    title: "Operations",
    cardDescription: "Teach operations teams to apply AI to recurring work, documentation, and internal coordination.",
    intro:
      "Operations teams are often closest to repetitive work, process friction, and knowledge bottlenecks, which makes AI education especially valuable.",
    whyItMatters:
      "Operations teams need practical guidance on spotting the right opportunities, documenting better workflows, and using AI to support consistency rather than creating more noise.",
    topics: [
      {
        title: "AI for recurring operational tasks",
        description:
          "Identify where AI can help with summaries, internal requests, SOP drafts, and coordination work.",
      },
      {
        title: "Documentation and knowledge support",
        description:
          "Teach teams how to turn internal knowledge into clearer, faster-to-use resources with AI assistance.",
      },
      {
        title: "Workflow mapping for AI adoption",
        description:
          "Help teams evaluate where AI adds leverage and where processes need cleanup first.",
      },
      {
        title: "Team adoption and consistency",
        description:
          "Create shared ways of working so AI usage becomes repeatable and useful across the team.",
      },
    ],
    outcomes: [
      "Clearer understanding of high-value operational use cases",
      "Faster internal documentation and response workflows",
      "More consistent team habits around AI-supported work",
    ],
    image: "/images/departments/operations.webp",
    metaTitle: "AI Education for Operations Teams",
    metaDescription:
      "See how AI workshops and operations training can improve documentation, coordination, and recurring internal workflows.",
    updatedAt: "2026-04-16",
  },
  {
    slug: "human-resources",
    title: "Human Resources",
    cardDescription: "Support HR teams with AI education for communication, enablement, and internal knowledge work.",
    intro:
      "HR teams can use AI to support communication, policy drafting, onboarding materials, and internal enablement while keeping people judgment at the center.",
    whyItMatters:
      "HR work is sensitive, high-context, and people-centered. Good training helps teams understand how to use AI as support without outsourcing empathy, discretion, or responsibility.",
    topics: [
      {
        title: "AI for internal communication",
        description:
          "Use AI to draft clearer internal messages, updates, and employee-facing resources.",
      },
      {
        title: "Onboarding and enablement materials",
        description:
          "Teach teams how to speed up training content, FAQs, and resource creation for new hires and managers.",
      },
      {
        title: "Policy and documentation support",
        description:
          "Show where AI can help draft, organize, and summarize materials while preserving review and compliance.",
      },
      {
        title: "Responsible use in people-focused work",
        description:
          "Clarify boundaries for when AI can support HR and when judgment must remain fully human-led.",
      },
    ],
    outcomes: [
      "Faster creation of HR communication and enablement materials",
      "More confidence around appropriate AI usage in sensitive contexts",
      "Shared understanding of review and accountability standards",
    ],
    image: "/images/departments/human-resources.webp",
    metaTitle: "AI Education for HR Teams",
    metaDescription:
      "Discover AI workshops and training for HR teams across communication, onboarding, documentation, and responsible adoption.",
    updatedAt: "2026-04-16",
  },
  {
    slug: "engineering",
    title: "Engineering",
    cardDescription: "Help engineering teams use AI for exploration, documentation, debugging support, and delivery habits.",
    intro:
      "Engineering teams can use AI to accelerate exploration, documentation, debugging support, and internal collaboration without lowering technical standards.",
    whyItMatters:
      "Engineering teams usually experiment early, but results vary widely across individuals. Training helps the team align on useful patterns, review standards, and where AI genuinely improves throughput.",
    topics: [
      {
        title: "AI for coding support and exploration",
        description:
          "Train engineers to use AI for investigation, scaffolding, and iteration without weakening review discipline.",
      },
      {
        title: "Documentation and knowledge transfer",
        description:
          "Use AI to speed up internal docs, handoff notes, and technical summaries across teams.",
      },
      {
        title: "Prompting for technical workflows",
        description:
          "Show how to frame context, constraints, and verification steps for better technical output.",
      },
      {
        title: "Engineering standards for AI usage",
        description:
          "Create shared norms around testing, review, security awareness, and when to trust or reject AI output.",
      },
    ],
    outcomes: [
      "More consistent AI usage across the engineering team",
      "Stronger prompting and review habits in technical workflows",
      "Better documentation and knowledge sharing with less manual effort",
    ],
    image: "/images/departments/engineering.webp",
    metaTitle: "AI Education for Engineering Teams",
    metaDescription:
      "Learn how AI education can help engineering teams improve exploration, documentation, debugging support, and delivery habits.",
    updatedAt: "2026-04-16",
  },
];

export function getDepartmentBySlug(slug: string) {
  return departments.find((department) => department.slug === slug);
}
