import {
  BASE_URL,
  CONTACT_EMAIL,
  SITE_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  faqItems,
} from "@/content/site";
import type { Metadata } from "next";

type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

type StructuredData = Record<string, unknown>;

type BreadcrumbItem = {
  name: string;
  path: string;
};

type CollectionItem = {
  name: string;
  path: string;
  description?: string;
};

type ArticleStructuredDataOptions = {
  title: string;
  description: string;
  path: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  abstract?: string;
};

type ServiceStructuredDataOptions = {
  name: string;
  description: string;
  path: string;
};

function createRobots(noIndex = false): Metadata["robots"] {
  if (noIndex) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function createMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  keywords = [],
  publishedTime,
  modifiedTime,
  noIndex = false,
}: MetadataOptions): Metadata {
  const imageUrl = absoluteUrl(image ?? "/images/site/og-education.svg");

  return {
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "business",
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: {
      canonical: path,
    },
    robots: createRobots(noIndex),
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

function createOrganizationReference() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
  };
}

export function createOrganizationStructuredData(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT_EMAIL,
        availableLanguage: ["en"],
      },
    ],
  };
}

export function createWebSiteStructuredData(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    inLanguage: "en",
    publisher: createOrganizationReference(),
  };
}

export function createWebPageStructuredData({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

export function createFAQStructuredData(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createBreadcrumbStructuredData(
  items: BreadcrumbItem[]
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createCollectionPageStructuredData({
  title,
  description,
  path,
  items,
}: {
  title: string;
  description: string;
  path: string;
  items: CollectionItem[];
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
        description: item.description,
      })),
    },
  };
}

export function createArticleStructuredData({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  abstract,
}: ArticleStructuredDataOptions): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    abstract,
    image: absoluteUrl(image),
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    mainEntityOfPage: absoluteUrl(path),
    url: absoluteUrl(path),
    author: createOrganizationReference(),
    publisher: {
      ...createOrganizationReference(),
      email: CONTACT_EMAIL,
    },
  };
}

export function createServiceStructuredData({
  name,
  description,
  path,
}: ServiceStructuredDataOptions): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    provider: createOrganizationReference(),
    areaServed: "Worldwide",
    url: absoluteUrl(path),
  };
}
