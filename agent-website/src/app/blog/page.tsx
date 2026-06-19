import { StructuredData } from "@/components/StructuredData";
import { blogPosts } from "@/content/blog";
import { siteMetadata } from "@/content/site";
import { formatDateForHumans } from "@/lib/date";
import {
  createBreadcrumbStructuredData,
  createCollectionPageStructuredData,
  createMetadata,
} from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: siteMetadata.blog.title,
    description: siteMetadata.blog.description,
    path: "/blog",
    image: siteMetadata.blog.image,
    keywords: siteMetadata.blog.keywords,
  });
}

export default function BlogPage() {
  const structuredData = [
    createCollectionPageStructuredData({
      title: siteMetadata.blog.title,
      description: siteMetadata.blog.description,
      path: "/blog",
      items: blogPosts.map((post) => ({
        name: post.title,
        path: `/blog/${post.slug}`,
        description: post.metaDescription,
      })),
    }),
    createBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />

      <section className="px-6 pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
              AI Education{" "}
              <span className="font-display-italic text-accent">Insights</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
              Practical writing on AI education for companies, with an emphasis
              on team capability, adoption habits, and department-specific
              training.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="elegant-card group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <time
                    className="block text-xs text-text-muted"
                    dateTime={post.publishDate}
                  >
                    {formatDateForHumans(post.publishDate)}
                  </time>
                  <h2 className="mt-2 text-base font-medium leading-snug text-text">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors group-hover:text-text">
                    Read article
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
