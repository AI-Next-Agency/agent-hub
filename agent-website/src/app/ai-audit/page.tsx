import { AuditQuiz } from "@/components/AuditQuiz";
import { StructuredData } from "@/components/StructuredData";
import {
  createMetadata,
  createWebPageStructuredData,
  createBreadcrumbStructuredData,
} from "@/lib/seo";
import { BOOK_CALL_URL, CTA_LABEL } from "@/content/site";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

const pageTitle = "Free AI Readiness Audit";

const pageDescription =
  "Take a 2-minute assessment to discover your team's AI maturity level and get personalized recommendations for building practical AI capability.";

export const metadata: Metadata = createMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/ai-audit",
  keywords: [
    "AI readiness assessment",
    "AI maturity audit",
    "AI adoption quiz",
    "team AI readiness",
  ],
});

export default function AiAuditPage() {
  return (
    <>
      <StructuredData
        data={createWebPageStructuredData({
          title: pageTitle,
          description: pageDescription,
          path: "/ai-audit",
        })}
      />
      <StructuredData
        data={createBreadcrumbStructuredData([
          { name: "Home", path: "/" },
          { name: "AI Audit", path: "/ai-audit" },
        ])}
      />

      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col justify-center px-4 py-6 sm:px-6 md:py-10">
        <div className="mb-6 text-center md:mb-8">
          <span className="elegant-pill mb-3 inline-block px-3 py-1 text-xs text-text-muted">
            2-minute assessment
          </span>
          <h1 className="mb-2 text-2xl font-medium tracking-tight md:text-3xl">
            How{" "}
            <span className="font-display-italic text-accent">AI-ready</span>{" "}
            is your team?
          </h1>
          <p className="mx-auto max-w-lg text-sm text-text-secondary leading-relaxed">
            8 quick questions for a personalized snapshot of your team&apos;s
            AI maturity — plus actionable next steps.
          </p>
        </div>

        <AuditQuiz />

        <div className="mt-6 text-center">
          <p className="mb-2 text-xs text-text-muted">
            Prefer to skip the quiz and talk to us directly?
          </p>
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text"
          >
            {CTA_LABEL}
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
