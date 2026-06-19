"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navigationItems, BOOK_CALL_URL, CTA_LABEL } from "@/content/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-border/50">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <Image
            src="/images/site/logo.svg"
            alt="AI Automation Agent"
            width={160}
            height={60}
            className="relative top-[2px] h-8 w-auto lg:h-10"
            priority
          />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navigationItems.map((item) =>
            item.href === "/ai-audit" ? (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm"
              >
                <span className="nav-shimmer font-medium">{item.name}</span>
                <span className="absolute -top-2 -right-5 rounded-full bg-accent px-1 py-px text-[8px] font-semibold leading-none text-white tracking-wide">
                  FREE
                </span>
              </Link>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-text-secondary transition-colors hover:text-text"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="elegant-btn-primary px-4 py-1.5 text-sm font-medium"
          >
            {CTA_LABEL}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-text-secondary hover:text-text md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="elegant-card mx-4 mt-1 p-4 md:hidden">
          {navigationItems.map((item) =>
            item.href === "/ai-audit" ? (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="relative inline-block py-2.5"
              >
                <span className="nav-shimmer text-sm font-medium">{item.name}</span>
                <span className="absolute -top-0 -right-5 rounded-full bg-accent px-1 py-px text-[8px] font-semibold leading-none text-white tracking-wide">
                  FREE
                </span>
              </Link>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-text-secondary transition-colors hover:text-text"
              >
                {item.name}
              </Link>
            )
          )}
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="elegant-btn-primary mt-3 block px-4 py-2.5 text-center text-sm font-medium"
          >
            {CTA_LABEL}
          </a>
        </div>
      )}
    </header>
  );
}
