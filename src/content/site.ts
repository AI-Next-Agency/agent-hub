import { FAQItem, NavItem, SiteMeta } from "@/content/types";

export const SITE_NAME = "AI Automation Agent";
export const BASE_URL = "https://www.aiautomationagent.com";
export const CONTACT_EMAIL = "contact@aiautomationagent.com";
export const BOOK_CALL_URL = "https://forms.fillout.com/t/6hCpLMsMhKus";
export const CTA_LABEL = "Book a Free Call";
export const SITE_UPDATED_AT = "2026-04-16";
export const DEFAULT_OG_IMAGE = "/images/site/og-education.svg";
export const SITE_KEYWORDS = [
  "AI workshops for companies",
  "AI training for teams",
  "AI education",
  "AI capability building",
  "department AI training",
  "AI workshops",
  "AI courses for business teams",
];

export function absoluteUrl(path: string) {
  return new URL(path, BASE_URL).toString();
}

export const navigationItems: NavItem[] = [
  {
    name: "Programs",
    href: "/#services",
  },
  {
    name: "Process",
    href: "/#process",
  },
  {
    name: "Departments",
    href: "/applications",
  },
  {
    name: "FAQ",
    href: "/#faq",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "AI Audit",
    href: "/ai-audit",
  },
];

export const siteMetadata = {
  home: {
    title: "AI Workshops, Trainings, and Courses for Company Teams",
    description:
      "AI workshops, team trainings, and hands-on courses that help companies build practical AI capability across leadership and functional teams.",
    image: DEFAULT_OG_IMAGE,
    keywords: [
      "AI workshops",
      "AI training for companies",
      "AI courses for teams",
      "executive AI education",
    ],
  } satisfies SiteMeta,
  blog: {
    title: "AI Education Insights for Business Teams",
    description:
      "Practical articles on training teams to use AI well across finance, marketing, sales, operations, HR, and engineering.",
    image: DEFAULT_OG_IMAGE,
    keywords: [
      "AI education blog",
      "AI training insights",
      "business AI adoption",
      "department AI training",
    ],
  } satisfies SiteMeta,
  applications: {
    title: "Department-Specific AI Education Programs",
    description:
      "Explore department-specific AI education programs built by assessing current technical ability, existing tools, and the real work each team already does.",
    image: DEFAULT_OG_IMAGE,
    keywords: [
      "department AI education",
      "AI training for finance teams",
      "AI training for marketing teams",
      "AI training for operations teams",
    ],
  } satisfies SiteMeta,
  linkedinOutreach: {
    title: "LinkedIn Outreach Agent Crew",
    description:
      "A landing page for an AI-powered LinkedIn outreach workflow that helps teams find leads, personalize outreach, and follow up at scale.",
    image: DEFAULT_OG_IMAGE,
    keywords: [
      "LinkedIn outreach automation",
      "AI outreach agents",
      "AI sales outreach",
      "LinkedIn lead generation",
    ],
  } satisfies SiteMeta,
  contactSuccess: {
    title: "Thank You",
    description:
      "Confirmation page shown after a contact form submission.",
    image: DEFAULT_OG_IMAGE,
  } satisfies SiteMeta,
};

export const homePageContent = {
  heroTitle: "AI Education",
  heroSubtitle: "for companies.",
  heroDescription:
    "Workshops, trainings, and courses that help teams use AI with confidence, clear workflows, and real business context.",
  dotTitle: "We help teams to adopt AI tools & mindset",
  dotDescription:
    "Role-based AI training for real teams and real work.",
  departmentsTitle: "Department-Specific AI Education",
  departmentsDescription:
    "We first assess the department's technical ability and the tools already in use, then shape a tailored curriculum designed to add value to existing workflows whether AI exposure is near zero or already advanced.",
  departmentsButton: "Explore Department Focus",
  featureGridTitle: "What we do",
  processTitle: "How we work",
  contactTitle: "Book a free call",
  contactDescription:
    "Let's talk about your vision, your team's needs, and how AI can be integrated into your company in a practical, valuable way.",
};

export const faqItems: FAQItem[] = [
  {
    question: "What kinds of companies do you work with?",
    answer:
      "We work with companies of different sizes, from growing teams to established organizations. The common need is practical AI education that helps people work better, make stronger decisions, and adopt new tools responsibly.",
  },
  {
    question: "What formats do you offer?",
    answer:
      "We offer executive workshops, department-specific trainings, hands-on courses, and follow-up enablement sessions. Programs can be delivered as single workshops, multi-session training series, or tailored learning tracks.",
  },
  {
    question: "Do you tailor training for different departments?",
    answer:
      "Yes. We shape examples, exercises, and workflows around the team in the room. Finance, marketing, sales, operations, HR, and engineering teams each need different use cases, risks, and adoption patterns.",
  },
  {
    question: "Are the sessions suitable for beginners?",
    answer:
      "Yes. We can start from fundamentals or build advanced sessions for teams already experimenting with AI. The program depth depends on current capability, goals, and how quickly the team needs to apply what they learn.",
  },
  {
    question: "Do you teach specific AI tools?",
    answer:
      "Yes. We can teach general AI concepts, prompt and workflow design, or practical usage with the tools your team already uses. The focus stays on applying AI well in day-to-day work rather than chasing novelty.",
  },
  {
    question: "How hands-on are the workshops and trainings?",
    answer:
      "They are designed to be practical. We combine clear frameworks with real examples, exercises, and team discussions so participants leave with concrete ideas they can use immediately after the session.",
  },
  {
    question: "What happens after the training?",
    answer:
      "We can support adoption with follow-up sessions, office hours, playbooks, and role-specific recommendations. The goal is not just to run a workshop, but to help the learning turn into better work habits and better outcomes.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Pricing depends on audience size, session length, preparation depth, and how tailored the program needs to be. We scope engagements around the learning goals and format that make sense for your team.",
  },
];
