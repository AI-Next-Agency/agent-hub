"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/content/site";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <section
      className="px-6 py-16 lg:py-24"
      id="faq"
      style={{ scrollMarginTop: 80 }}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
          Common{" "}
          <span className="font-display-italic text-accent">questions.</span>
        </h2>

        <div className="mt-10 divide-y divide-border">
          {faqItems.map((item, index) => {
            const isOpen = openItems.has(index);
            return (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-text">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "mt-0.5 shrink-0 text-text-muted transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-text-secondary">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
