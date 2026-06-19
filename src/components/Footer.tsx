import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL, navigationItems } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <p className="text-center text-sm text-text-secondary sm:text-left">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-text-secondary transition-colors hover:text-text"
            >
              {item.name}
            </Link>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm text-text-secondary transition-colors hover:text-text"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
