import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { departments } from "@/content/departments";
import { homePageContent } from "@/content/site";
import { TerminalPreview } from "@/components/TerminalPreview";

export function DepartmentsPreview() {
  return (
    <section className="px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
            {homePageContent.departmentsTitle.split(" ").slice(0, 2).join(" ")}{" "}
            <span className="font-display-italic text-accent">
              {homePageContent.departmentsTitle.split(" ").slice(2).join(" ")}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            {homePageContent.departmentsDescription}
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
                <h3 className="text-base font-medium text-text">
                  {dept.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">
                  {dept.cardDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors group-hover:text-text">
                  Learn more
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/applications"
            className="elegant-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm text-text-secondary"
          >
            {homePageContent.departmentsButton}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
