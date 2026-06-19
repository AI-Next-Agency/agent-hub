import { StructuredData } from "@/components/StructuredData";
import { CTASection } from "@/components/sections/CTASection";
import { siteMetadata } from "@/content/site";
import {
  createBreadcrumbStructuredData,
  createMetadata,
  createServiceStructuredData,
} from "@/lib/seo";
import {
  Search,
  UserPlus,
  MessageSquare,
  BarChart3,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";
import { BOOK_CALL_URL, CTA_LABEL } from "@/content/site";

export const metadata = createMetadata({
  title: siteMetadata.linkedinOutreach.title,
  description: siteMetadata.linkedinOutreach.description,
  path: "/linkedin-outreach",
  image: siteMetadata.linkedinOutreach.image,
  keywords: siteMetadata.linkedinOutreach.keywords,
});

const features = [
  {
    icon: Search,
    title: "Lead Discovery",
    description:
      "AI agents identify and qualify your ideal prospects based on industry, role, company size, and engagement signals.",
  },
  {
    icon: UserPlus,
    title: "Personalized Connection Requests",
    description:
      "Each connection request is tailored to the prospect's profile, activity, and mutual context.",
  },
  {
    icon: MessageSquare,
    title: "Custom Messaging Sequences",
    description:
      "Multi-step follow-up sequences that adapt tone and content based on engagement and response patterns.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track acceptance rates, response rates, and pipeline progression in real time.",
  },
  {
    icon: Clock,
    title: "24/7 Operation",
    description:
      "Agents work around the clock without fatigue, maintaining consistent quality and volume.",
  },
  {
    icon: Zap,
    title: "Rapid Scaling",
    description:
      "Scale outbound volume without adding headcount. Go from 50 to 500 touches per week seamlessly.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Define Your ICP",
    description:
      "We work with you to define your ideal customer profile, messaging tone, and qualification criteria.",
  },
  {
    step: "02",
    title: "Agent Training",
    description:
      "Our AI agents are configured with your brand voice, value propositions, and objection-handling patterns.",
  },
  {
    step: "03",
    title: "Launch & Optimize",
    description:
      "Agents begin outreach, and we continuously optimize based on response data and conversion signals.",
  },
  {
    step: "04",
    title: "Handoff Qualified Leads",
    description:
      "Warm, engaged leads are surfaced to your sales team with full context and conversation history.",
  },
];

export default function LinkedInOutreachPage() {
  const structuredData = [
    createServiceStructuredData({
      name: siteMetadata.linkedinOutreach.title,
      description: siteMetadata.linkedinOutreach.description,
      path: "/linkedin-outreach",
    }),
    createBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "LinkedIn Outreach Agent Crew", path: "/linkedin-outreach" },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />

      {/* Hero */}
      <section className="px-6 pb-12 pt-8">
        <div className="elegant-container mx-auto max-w-6xl px-8 py-16 md:px-16 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
              LinkedIn Outreach{" "}
              <span className="font-display-italic text-accent">Agent Crew</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              A team of specialized AI agents trained to find your ideal leads,
              send personalized connection requests, and follow up with custom
              messaging sequences. Whether you&apos;re growing your pipeline,
              validating a product, or scaling outbound, our agent crew gets it
              done — 24/7, without burnout.
            </p>
            <div className="mt-8">
              <a
                href={BOOK_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="elegant-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
              >
                {CTA_LABEL}
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="elegant-card flex flex-col justify-between p-7"
            >
              <div>
                <feature.icon size={22} strokeWidth={1.5} className="text-text-muted" />
                <h3 className="mt-6 text-base font-medium text-text">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
              <p className="mt-8 text-sm text-text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
            How it{" "}
            <span className="font-display-italic text-accent">works.</span>
          </h2>
          <div className="mt-10 divide-y divide-border">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="flex gap-6 py-6"
              >
                <span className="shrink-0 font-mono text-sm text-text-muted">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-medium text-text">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
