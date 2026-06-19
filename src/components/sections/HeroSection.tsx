"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { homePageContent } from "@/content/site";
import { AsciiArt } from "../ui/ascii-art";
import { submitAuditLead } from "@/lib/audit-submit";

const BENEFITS = [
  "Walk away with an AI workflow you can use the next day",
  "Tailored to your team's tools and real work",
  "No tech background needed",
];

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid work email.");
      return;
    }
    setLoading(true);
    try {
      await submitAuditLead({ email, source: "hero" });
    } catch {
      // best-effort
    }
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section className="px-6 pb-12 pt-8">
      <div className="relative elegant-container mx-auto max-w-6xl px-8 py-16 md:px-16 md:py-20 lg:py-28">
        <span className="elegant-pill mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 text-xs text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Free 1-Hour Training Session
        </span>

        <h1 className="max-w-3xl text-4xl font-normal leading-[1.15] tracking-tight text-text md:text-5xl lg:text-6xl">
          {homePageContent.heroTitle}
          <br />
          with{" "}
          <span className="font-display-italic text-accent">precision</span>
          {" "}and{" "}
          <span className="font-display-italic text-accent">confidence.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary">
          {homePageContent.heroDescription}
        </p>

        <ul className="mt-4 space-y-1.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-text-secondary">
              <Check size={13} className="shrink-0 text-accent" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
          {submitted ? (
            <p className="flex items-center gap-2 text-sm text-text-secondary">
              <Check size={14} className="text-accent" />
              {"We'll be in touch shortly."}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                  placeholder="you@company.com"
                  required
                  className="border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary sm:w-64"
                />
                {error && <p className="text-xs text-danger">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="elegant-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Claim Free Training
                <ArrowRight size={14} />
              </button>
            </form>
          )}
          <Link
            href="/applications"
            className="elegant-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm text-text-secondary"
          >
            Explore departments
          </Link>
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-1/4 overflow-hidden hidden md:block">
          <AsciiArt
            src="https://artifio.b-cdn.net/public/ai/313FFC12-D448-42C3-AE49-FA4961DF7AD3.jpeg"
            resolution={80}
            color="var(--color-neutral-900)"
            animationStyle="matrix"
            animationDuration={10}
            animateOnView={false}
            colored={false}
            inverted={true}
            className="mx-auto h-full max-w-lg bg-neutral-500 absolute right-0 opacity-30"
          />
        </div>
      </div>
    </section>
  );
}
