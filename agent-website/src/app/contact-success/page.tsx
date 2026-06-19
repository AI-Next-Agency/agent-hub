import { siteMetadata } from "@/content/site";
import { createMetadata } from "@/lib/seo";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: siteMetadata.contactSuccess.title,
  description: siteMetadata.contactSuccess.description,
  path: "/contact-success",
  image: siteMetadata.contactSuccess.image,
  noIndex: true,
});

export default function ContactSuccessPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="elegant-container px-10 py-16 text-center">
        <CheckCircle2 size={32} strokeWidth={1.5} className="mx-auto text-success" />
        <h1 className="mt-6 text-2xl font-normal text-text">
          Thank you for your message!
        </h1>
        <p className="mt-3 text-base text-text-secondary">
          We have received your message and will get back to you as soon as
          possible.
        </p>
        <Link
          href="/"
          className="elegant-btn mt-8 inline-flex px-5 py-2.5 text-sm text-text-secondary"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
