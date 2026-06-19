# AI Education Website — Elegant Variant

## Business Context

This is the marketing website for **AI Automation Agent** (`aiautomationagent.com`), a consultancy that delivers AI workshops, trainings, and courses to business teams. The service is department-specific — finance, marketing, sales, operations, HR, and engineering each get tailored programs. The primary conversion action is booking a free call via Fillout form.

This is the **elegant design variant**. A separate `website` project exists with different styling but identical content and routing. Changes to content structure, pages, or SEO should stay consistent across both.

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router, static export via `output: "export"`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **Package manager**: Bun (not npm)
- **Icons**: lucide-react
- **Fonts**: Google Fonts — Inter, Playfair Display, JetBrains Mono
- **Utilities**: clsx + tailwind-merge (`cn()` helper in `src/lib/utils.ts`), date-fns
- **Images**: Unoptimized (static export) — WebP for photos, SVG for logos/illustrations

## Design System

The visual identity is monochromatic and minimal, inspired by editorial/agency aesthetics.

### Key Rules

- **Zero border-radius** on cards, containers, buttons, and images. Only `.elegant-pill` uses `rounded-full`.
- **Thin 1px borders** (`border-border` / `#E5E7EB`) define all containers and cards — no shadows.
- **Accent red `#C22C2F`** is used sparingly for emphasis (italic words, dots, hover states). It comes from the logo.
- **Grid background** on `body`: 20px squares with `#F0F0F1` lines on `#FAFAFA` base. This is global, not per-section.
- **Serif italic emphasis**: Key words in headings use `.font-display-italic` (Playfair Display italic) with `text-accent`.

### Color Tokens (CSS custom properties in `globals.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#111827` | Buttons, headings, main text |
| `--color-accent` | `#C22C2F` | Highlights, emphasis, logo red |
| `--color-surface` | `#FFFFFF` | Card/container backgrounds |
| `--color-surface-alt` | `#FAFAFA` | Page background |
| `--color-text` | `#111827` | Primary text |
| `--color-text-secondary` | `#6B7280` | Body text, descriptions |
| `--color-text-muted` | `#9CA3AF` | Dates, metadata |
| `--color-border` | `#E5E7EB` | All borders |

### CSS Utility Classes (defined in `globals.css`)

- `.elegant-container` — White background, thin border (used for hero, CTA)
- `.elegant-card` — White background, thin border, darker border on hover
- `.elegant-btn` — Outlined button with hover fill
- `.elegant-btn-primary` — Solid dark button (`#111827`)
- `.elegant-pill` — Rounded-full badge with thin border
- `.font-display-italic` — Playfair Display italic for heading emphasis

### Typography

- **Sans (body)**: Inter — weights 300, 400, 500, 600
- **Serif (display)**: Playfair Display — italic only, for heading accent words
- **Mono**: JetBrains Mono — terminal previews, process steps

## Project Structure

```
src/
  app/                          # Next.js App Router pages
    layout.tsx                  # Root layout (Navbar + Footer wrapper)
    page.tsx                    # Home — assembles all section components
    globals.css                 # Design system: theme tokens + utility classes
    robots.ts                   # SEO robots.txt generation
    sitemap.ts                  # Dynamic sitemap generation
    applications/
      page.tsx                  # Department listing grid
      [applicationSlug]/page.tsx # Department detail page
    blog/
      page.tsx                  # Blog listing grid
      [blogSlug]/page.tsx       # Blog post detail page
    contact-success/page.tsx    # Post-form-submission thank you page
    linkedin-outreach/page.tsx  # LinkedIn agent crew landing page
  components/
    Navbar.tsx                  # Sticky header with logo, nav, mobile menu
    Footer.tsx                  # Minimal footer with links
    StructuredData.tsx          # JSON-LD schema.org injection
    TerminalPreview.tsx         # Interactive terminal animation (hover-triggered)
    sections/                   # Home page section components
      HeroSection.tsx
      ServicesSection.tsx
      DepartmentsPreview.tsx
      ProcessSection.tsx
      FAQSection.tsx
      CTASection.tsx
  content/                      # All site content as TypeScript data
    site.ts                     # Metadata, nav items, FAQ, home page copy
    departments.ts              # 6 department objects with topics & outcomes
    blog.ts                     # Blog posts with HTML content strings
    types.ts                    # Shared TypeScript types
  lib/
    seo.ts                      # Metadata builders + structured data generators
    utils.ts                    # cn() class merge helper
    date.ts                     # formatDateForHumans() using date-fns
    llms.ts                     # LLM-friendly content index builders
public/
  images/site/                  # logo.svg, og-education.svg
  images/departments/           # *.webp department photos (used on blog)
  images/blog/                  # Legacy SVGs (no longer referenced)
```

## Content Architecture

All content lives in `src/content/` as typed TypeScript objects — there is no CMS, no markdown, no database.

- **`site.ts`** — Site name, base URL, contact email, CTA URL/label, navigation items, FAQ items, all home page copy. Constants: `SITE_NAME`, `BASE_URL`, `BOOK_CALL_URL`, `CTA_LABEL`.
- **`departments.ts`** — Array of 6 departments. Each has: slug, title, descriptions, 4 topics, 3 outcomes, image path, SEO metadata.
- **`blog.ts`** — Array of blog posts. Each has: slug, title, dates, excerpt, image, SEO metadata, HTML content string (rendered via `dangerouslySetInnerHTML`).
- **`types.ts`** — TypeScript interfaces: `Department`, `BlogPost`, `FAQItem`, `NavItem`, `SiteMeta`, `DepartmentTopic`.

## Key Patterns

### Static Export
The site uses `output: "export"` — no server-side runtime. All dynamic routes use `generateStaticParams()`. No API routes, no server actions, no middleware.

### SEO
Every page has `generateMetadata()` returning OpenGraph, Twitter cards, canonical URLs, and robots directives. Structured data (JSON-LD) is added via the `StructuredData` component. The `seo.ts` lib has builders for Organization, WebSite, WebPage, FAQ, Breadcrumb, CollectionPage, Article, and Service schemas.

### TerminalPreview Component
Department cards (home page and `/applications` listing) use an interactive terminal animation instead of static images. Each department has 8 lines of simulated AI agent output. On hover, lines appear one by one at 400ms intervals. On mouse leave, it resets to showing only the first line. The department detail pages also use this component.

### Layout
The root layout uses `flex min-h-screen flex-col` on `<body>` with `flex-1` on `<main>` to keep the footer at the bottom on short pages. The Navbar is sticky with `backdrop-blur-xl` and a subtle bottom border.

## Departments (6)

`finance`, `marketing`, `sales`, `operations`, `human-resources`, `engineering`

Each maps to `/applications/{slug}` and has a terminal preview script in `TerminalPreview.tsx`.

## Common Pitfalls

- **No rounded corners**: Do not add `rounded-*` classes to cards, buttons, containers, or images. Only `.elegant-pill` is rounded.
- **No shadows**: The design uses borders only — no `shadow-*` classes.
- **Bun, not npm**: Use `bun install`, `bun run dev`, etc.
- **Static export**: No server features (API routes, middleware, server actions). All pages must be statically renderable.
- **Image paths**: Department images are at `/images/departments/{slug}.webp`. Blog posts currently reference department images (engineering.webp, marketing.webp).
- **Content changes**: Edit TypeScript files in `src/content/`, not component files. Components read from content objects.
- **Next.js version**: This uses Next.js 16.x which may have breaking changes from earlier versions. Check `node_modules/next/dist/docs/` if unsure about APIs.
