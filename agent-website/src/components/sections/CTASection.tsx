import { ArrowRight } from "lucide-react";
import { BOOK_CALL_URL, CTA_LABEL, homePageContent } from "@/content/site";

export function CTASection() {
  return (
    <section className="px-6 py-6 pb-12" id="contact">
      <div className="elegant-container mx-auto max-w-6xl px-8 py-16 text-center md:px-16 md:py-20">
        <h2 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
          {homePageContent.contactTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-secondary">
          {homePageContent.contactDescription}
        </p>
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="elegant-btn-primary mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
        >
          {CTA_LABEL}
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
