import { StructuredData } from "@/components/StructuredData";
import { CTASection } from "@/components/sections/CTASection";
import { BOOK_CALL_URL, CTA_LABEL } from "@/content/site";
import { departments, getDepartmentBySlug } from "@/content/departments";
import {
  createBreadcrumbStructuredData,
  createMetadata,
  createServiceStructuredData,
} from "@/lib/seo";
import { TerminalPreview } from "@/components/TerminalPreview";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ applicationSlug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const department = getDepartmentBySlug(params.applicationSlug);

  if (!department) {
    return createMetadata({
      title: "Page Not Found",
      description: "The requested application page could not be found.",
      path: `/applications/${params.applicationSlug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: department.metaTitle,
    description: department.metaDescription,
    path: `/applications/${params.applicationSlug}`,
    image: department.image,
    keywords: [department.title, "department AI education", "AI training program"],
  });
}

export async function generateStaticParams() {
  return departments.map((department) => ({
    applicationSlug: department.slug,
  }));
}

export default async function DepartmentPage(props: PageProps) {
  const params = await props.params;
  const department = getDepartmentBySlug(params.applicationSlug);

  if (!department) {
    notFound();
  }

  const structuredData = [
    createServiceStructuredData({
      name: department.metaTitle,
      description: department.metaDescription,
      path: `/applications/${department.slug}`,
    }),
    createBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Applications", path: "/applications" },
      { name: department.title, path: `/applications/${department.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />

      <article className="px-6 pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text"
          >
            <ArrowLeft size={14} />
            All departments
          </Link>

          {/* Title */}
          <h1 className="mt-8 text-3xl font-normal tracking-tight text-text md:text-4xl">
            {department.metaTitle}
          </h1>

          {/* Terminal preview */}
          <div className="mt-8 aspect-[4/3] w-full overflow-hidden border border-border">
            <TerminalPreview slug={department.slug} />
          </div>

          {/* Content */}
          <div className="mt-12 space-y-10">
            <p className="text-base leading-relaxed text-text-secondary">
              {department.intro}
            </p>

            <div className="elegant-container p-6">
              <h2 className="text-lg font-medium text-text">
                Why AI education matters for {department.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {department.whyItMatters}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-text">
                Workshop and training topics
              </h2>
              <div className="mt-4 space-y-3">
                {department.topics.map((topic) => (
                  <div
                    key={topic.title}
                    className="elegant-card p-5"
                  >
                    <h3 className="text-sm font-medium text-text">
                      {topic.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {topic.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-text">
                What teams should be able to do afterward
              </h2>
              <ul className="mt-4 space-y-3">
                {department.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-success"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm leading-relaxed text-text-secondary">
              If this team is a priority area, the next step is a workshop call
              to scope the audience, skill level, and the workflows that matter
              most.
            </p>
          </div>

          {/* Inline CTA */}
          <div className="mt-12 text-center">
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
      </article>

      <CTASection />
    </>
  );
}
