import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { departments } from "@/content/departments";
import { BASE_URL, SITE_UPDATED_AT } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestBlogDate =
    blogPosts
      .map((post) => post.publishDate)
      .sort((left, right) => right.localeCompare(left))[0] ?? SITE_UPDATED_AT;

  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(SITE_UPDATED_AT),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(latestBlogDate),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/applications`,
      lastModified: new Date(SITE_UPDATED_AT),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/linkedin-outreach`,
      lastModified: new Date(SITE_UPDATED_AT),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...(departments.map((department) => ({
      url: `${BASE_URL}/applications/${department.slug}`,
      lastModified: new Date(department.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    })) as MetadataRoute.Sitemap),
    ...(blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishDate),
      changeFrequency: "weekly",
      priority: 0.7,
    })) as MetadataRoute.Sitemap),
  ];
}
