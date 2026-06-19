import { StructuredData } from "@/components/StructuredData";
import { CTASection } from "@/components/sections/CTASection";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { formatDateForHumans } from "@/lib/date";
import {
  createArticleStructuredData,
  createBreadcrumbStructuredData,
  createMetadata,
} from "@/lib/seo";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ blogSlug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const post = getBlogPostBySlug(params.blogSlug);

  if (!post) {
    return createMetadata({
      title: "Page Not Found",
      description: "The requested blog post could not be found.",
      path: `/blog/${params.blogSlug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${params.blogSlug}`,
    image: post.image,
    keywords: [post.title, "AI education article", "team AI training"],
    type: "article",
    publishedTime: post.publishDate,
    modifiedTime: post.publishDate,
  });
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    blogSlug: post.slug,
  }));
}

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params;
  const post = getBlogPostBySlug(params.blogSlug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter(
    (candidate) => candidate.slug !== post.slug
  );

  const structuredData = [
    createArticleStructuredData({
      title: post.metaTitle,
      description: post.metaDescription,
      path: `/blog/${post.slug}`,
      image: post.image,
      publishedTime: post.publishDate,
      modifiedTime: post.publishDate,
      abstract: post.excerpt,
    }),
    createBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />

      <article className="px-6 pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text"
          >
            <ArrowLeft size={14} />
            All articles
          </Link>

          {/* Title */}
          <h1 className="mt-8 text-3xl font-normal leading-tight tracking-tight text-text md:text-4xl">
            {post.title}
          </h1>

          <time
            className="mt-3 block text-sm text-text-muted"
            dateTime={post.publishDate}
          >
            {formatDateForHumans(post.publishDate)}
          </time>

          {/* Hero image */}
          <div className="relative mt-8 aspect-square w-full overflow-hidden border border-border">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
          </div>

          {/* Article body */}
          <div
            className="mt-12 max-w-none space-y-5 text-base leading-[1.8] text-text-secondary [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-text [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_li]:text-sm [&_a]:text-text [&_a]:underline [&_a]:underline-offset-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-medium text-text">Related Articles</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="elegant-card group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-5">
                    <time
                      className="block text-xs text-text-muted"
                      dateTime={related.publishDate}
                    >
                      {formatDateForHumans(related.publishDate)}
                    </time>
                    <h3 className="mt-2 text-sm font-medium leading-snug text-text">
                      {related.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors group-hover:text-text">
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

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text"
              >
                <ArrowLeft size={14} />
                All articles
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
