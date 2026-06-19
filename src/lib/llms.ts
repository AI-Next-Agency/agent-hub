import { blogPosts } from "@/content/blog";
import { departments } from "@/content/departments";
import {
  BASE_URL,
  SITE_NAME,
  SITE_UPDATED_AT,
  absoluteUrl,
  faqItems,
  homePageContent,
  siteMetadata,
} from "@/content/site";

function linkLine(title: string, path: string, description: string) {
  return `- [${title}](${absoluteUrl(path)}): ${description}`;
}

export function buildLlmsIndex() {
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${siteMetadata.home.description}`,
    "",
    "This file is a concise map of the public site for LLMs, agents, and retrieval systems. Prefer the canonical URLs below. Use the full context file for expanded summaries of services, departments, FAQs, and articles.",
    "",
    "## Main Pages",
    linkLine("Home", "/", "Overview of the company, offer, process, FAQ, and contact CTA."),
    linkLine("Applications", "/applications", "Department-specific AI education programs for business teams."),
    linkLine("Blog", "/blog", "Articles on practical AI education and capability-building for companies."),
    linkLine("LinkedIn Outreach Agent Crew", "/linkedin-outreach", "Landing page for an AI-driven LinkedIn outreach workflow."),
    linkLine("Full LLM Context", "/llms-full.txt", "Expanded markdown summary of the site's public content."),
    "",
    "## Department Programs",
    ...departments.map((department) =>
      linkLine(department.title, `/applications/${department.slug}`, department.metaDescription)
    ),
    "",
    "## Articles",
    ...blogPosts.map((post) =>
      linkLine(post.title, `/blog/${post.slug}`, post.metaDescription)
    ),
    "",
    "## Optional",
    `- [Sitemap](${BASE_URL}/sitemap.xml): XML index of canonical crawlable URLs.`,
    "",
  ].join("\n");
}

export function buildLlmsFull() {
  return [
    `# ${SITE_NAME} Full Context`,
    "",
    `> ${siteMetadata.home.description}`,
    "",
    `Canonical site: ${BASE_URL}`,
    `Updated: ${SITE_UPDATED_AT}`,
    "",
    "## Business Summary",
    homePageContent.heroDescription,
    "",
    "## Core Offer",
    `- ${homePageContent.dotDescription}`,
    `- ${homePageContent.departmentsDescription}`,
    `- Contact CTA: ${homePageContent.contactTitle}`,
    "",
    "## Main Pages",
    `- Home: ${absoluteUrl("/")}`,
    `- Applications: ${absoluteUrl("/applications")}`,
    `- Blog: ${absoluteUrl("/blog")}`,
    `- LinkedIn Outreach Agent Crew: ${absoluteUrl("/linkedin-outreach")}`,
    "",
    "## FAQ",
    ...faqItems.flatMap((item) => [`### ${item.question}`, item.answer, ""]),
    "## Department Programs",
    ...departments.flatMap((department) => [
      `### ${department.title}`,
      `URL: ${absoluteUrl(`/applications/${department.slug}`)}`,
      department.intro,
      "",
      `Why it matters: ${department.whyItMatters}`,
      "",
      "Topics:",
      ...department.topics.map(
        (topic) => `- ${topic.title}: ${topic.description}`
      ),
      "Outcomes:",
      ...department.outcomes.map((outcome) => `- ${outcome}`),
      "",
    ]),
    "## Blog Articles",
    ...blogPosts.flatMap((post) => [
      `### ${post.title}`,
      `URL: ${absoluteUrl(`/blog/${post.slug}`)}`,
      `Published: ${post.publishDate}`,
      `Summary: ${post.description}`,
      `Excerpt: ${post.excerpt}`,
      "",
    ]),
  ].join("\n");
}
