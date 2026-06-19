import { StructuredData } from "@/components/StructuredData";
import { siteMetadata } from "@/content/site";
import {
  createFAQStructuredData,
  createOrganizationStructuredData,
  createWebPageStructuredData,
  createWebSiteStructuredData,
} from "@/lib/seo";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DepartmentsPreview } from "@/components/sections/DepartmentsPreview";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  const structuredData = [
    createOrganizationStructuredData(),
    createWebSiteStructuredData(),
    createWebPageStructuredData({
      title: siteMetadata.home.title,
      description: siteMetadata.home.description,
      path: "/",
    }),
    createFAQStructuredData(),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <HeroSection />
      <ServicesSection />
      <DepartmentsPreview />
      <ProcessSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
