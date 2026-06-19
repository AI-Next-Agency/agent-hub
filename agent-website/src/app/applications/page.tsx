import { StructuredData } from "@/components/StructuredData";
import { TerminalPreview } from "@/components/TerminalPreview";
import { departments } from "@/content/departments";
import { siteMetadata } from "@/content/site";
import {
  createBreadcrumbStructuredData,
  createCollectionPageStructuredData,
  createMetadata,
} from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: siteMetadata.applications.title,
    description: siteMetadata.applications.description,
    path: "/applications",
    image: siteMetadata.applications.image,
    keywords: siteMetadata.applications.keywords,
  });
}

export default function ApplicationsPage() {
  const structuredData = [
    createCollectionPageStructuredData({
      title: siteMetadata.applications.title,
      description: siteMetadata.applications.description,
      path: "/applications",
      items: departments.map((department) => ({
        name: department.title,
        path: `/applications/${department.slug}`,
        description: department.metaDescription,
      })),
    }),
    createBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Applications", path: "/applications" },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />

      <section className="px-6 pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
              Department-Specific{" "}
              <span className="font-display-italic text-accent">AI Education</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
              Different departments need different AI education. We first assess
              the team&apos;s technical ability, current AI exposure, and the
              tools already being used, then build an education formula and
              curriculum around that reality.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Link
                key={dept.slug}
                href={`/applications/${dept.slug}`}
                className="elegant-card group flex flex-col overflow-hidden"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <TerminalPreview slug={dept.slug} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-base font-medium text-text">
                    {dept.title}
                  </h2>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">
                    {dept.cardDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors group-hover:text-text">
                    View program
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
