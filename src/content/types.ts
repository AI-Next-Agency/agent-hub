export type SiteMeta = {
  title: string;
  description: string;
  image: string;
  keywords?: string[];
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type NavItem = {
  name: string;
  href: string;
};

export type DepartmentTopic = {
  title: string;
  description: string;
};

export type Department = {
  slug: string;
  title: string;
  cardDescription: string;
  intro: string;
  whyItMatters: string;
  topics: DepartmentTopic[];
  outcomes: string[];
  image: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  publishDate: string;
  description: string;
  excerpt: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
};
