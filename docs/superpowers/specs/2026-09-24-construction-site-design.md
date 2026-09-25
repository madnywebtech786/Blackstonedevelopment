# Construction Renovation Company Website — Design Spec

Date: 2026-09-24

## 1. Purpose

Build an Awwwards-level marketing website for a residential renovation contractor, modeled on the same business model and feature set as a prior reference project ("Reliable Building Developers" — a Calgary renovation contractor lead-generation site), but with a distinct, more premium/futuristic visual identity and no real company details yet.

The site must:
- Look distinctive, premium, and intentionally art-directed (per `AGENTS.md` / `frontend-developer-prompt.md` quality bar)
- Be structured so a real company's name, copy, images, services, and colors can be swapped in later without restructuring code
- Support a realistic lead-generation funnel: browse services, see proof of work, request a quote

## 2. Placeholder Brand

Since no real company details exist yet, use a fictional placeholder brand, centralized in one config file (`lib/site-config.js`):

- **Name**: Northgate Renovations
- **City / service area**: Calgary, AB + surrounding towns (Airdrie, Okotoks, Cochrane, Chestermere, Strathmore) — same regional pattern as the reference project
- **Contact**: placeholder phone, email, WhatsApp number
- **Stats**: placeholder years-in-business, projects-completed, satisfaction % (used in the animated trust strip)

All homepage/page copy, contact details, and stats read from this config or the `services-data.js` / `projects-data.js` arrays — never hardcoded inline in components. This is the single file to edit when real company info arrives.

**Images**: Unsplash placeholder photography (construction, renovation, architecture, interiors) used throughout — hero, service pages, project gallery. Swappable for real project photos later; no fabricated "before/after" claims presented as real client work in copy (labeled generically, e.g. "Kitchen Remodel — Concept").

## 3. Visual System

**Direction**: "Soft Futurist" — light, cool-toned, near-monochrome, architectural.

**Color palette** (Tailwind v4 `@theme` custom properties in `globals.css`, all semantic and swappable):

| Token | Purpose |
|---|---|
| `--color-background` | Page base — light off-white/cool gray |
| `--color-foreground` | Primary text — near-black |
| `--color-surface` | Card/panel background, one step off background |
| `--color-surface-elevated` | Elevated panel (modals, elevated cards) |
| `--color-border` | Hairline 1px borders/rules |
| `--color-muted-foreground` | Secondary/metadata text |
| `--color-accent` | Muted cool-blue — used ONLY for focus rings, tiny accent details, link-hover states. Never large fills or backgrounds. |
| `--color-accent-foreground` | Text/icon color on top of accent fills (buttons, if ever used) |
| `--color-primary` | Near-black, used for primary CTA buttons |
| `--color-primary-foreground` | Light text on primary buttons |

No dark mode for this pass (explicit decision — matches the brief's "light-themed" direction and keeps the design fully art-directed around one theme).

**Typography**:
- Display/headline font: condensed uppercase grotesk (e.g. Oswald or Archivo Condensed via `next/font/google`) — used for H1/H2 and major visual-moment type
- Body/UI font: Geist Sans (already in project) — body copy, nav, buttons, form labels
- Fluid sizing via CSS `clamp()` for display headlines
- Small uppercase metadata labels (wide letter-spacing, muted-foreground color) used as a recurring motif above headings (e.g. "CALGARY & AREA")

**Signature motifs** (recur across pages so the site reads as one system):
- Layered/overlapping photo compositions at slight rotation angles with soft drop shadows (hero treatment)
- Hairline 1px borders/rules instead of heavy box-shadows
- Wide-letter-spaced uppercase micro-labels for section eyebrows and metadata

## 4. Site Structure (App Router)

```
/                          Homepage
/services                  Services overview grid
/services/[slug]           14 service detail pages, shared template, data-driven
/projects                  Filterable project gallery
/projects/[slug]           Individual project detail (before/after slider, description)
/about                     Company story, credentials, service-area section
/contact                   Contact form (working backend), click-to-call, WhatsApp
/faq                       General company-wide FAQ (schema-marked, AEO-focused)
```

**14 services** (slugs, placeholder set matching reference project scope): kitchen-remodeling, basement-development, bathroom-renovation, flooring, electrical, framing, drywall, painting, decks-fencing, windows-doors, roofing, driveways-concrete, home-additions, general-contracting.

Each service and project entry lives in a data array (`services-data.js`, `projects-data.js`) with slug, title, summary, feature list, image references, and SEO metadata (title/description/OG) — adding a new one is a new array entry, no new component code, matching the reference project's scaling approach.

## 5. Homepage Section Order

1. **Nav** — floating/transparent, scroll-aware show/hide, mobile menu
2. **Hero** — layered photo collage (2-3 overlapping project photos at slight rotation, soft shadows) beside a condensed uppercase headline; small "SCROLL" indicator
3. **Trust strip** — animated live-counting stats (years in business, projects completed, satisfaction %)
4. **Services preview** — editorial grid linking to `/services/[slug]`, not generic icon cards
5. **Featured projects** — gallery teaser, links to `/projects`
6. **Service-area section** — redesigned "areas served" concept (custom radial/diagram treatment, not a literal Google Maps embed)
7. **Process** — scroll-choreographed steps: quote → plan → build → handover
8. **Testimonials** — editorial layout, not a generic carousel-card cliché
9. **CTA band** — contact/quote prompt
10. **Footer** — nav, service area list, contact info, social links

**Scroll-progress animation** (animation tied continuously to scroll position within a section, not a one-time on-enter reveal) is used in exactly three places — deliberately limited, not applied everywhere:
- **Hero** — the layered photo collage shifts at different rates per layer (parallax) as the hero scrolls past, reinforcing depth
- **Featured projects** — images scale/reveal progressively as each project scrolls through the viewport
- **Process steps** — steps progressively highlight/connect (e.g. a connecting line fills) as the user scrolls through the pinned/sticky sequence

The trust strip counter remains a standard one-time count-up triggered on first view (not scroll-tied) — this is the more legible pattern for a number counter and avoids a gimmicky feel. All other entrance animations across the site use one-time on-enter reveals per section 7 (Animation System), not continuous scroll-tied progress.

## 6. Component Architecture

```
components/
  layout/        Header, Footer, PageShell
  navigation/    Nav, MobileNav, WhatsAppButton
  sections/      Hero, TrustStats, ServicesPreview, FeaturedProjects,
                 ServiceAreaSection, ProcessSteps, Testimonials, CTABand
  ui/            Button, Badge, Card, SectionLabel, AnimatedCounter
  animations/    Reveal, StaggerText, ParallaxImage, PageTransition
  shared/        ServiceCard, ProjectCard, ContactForm, BeforeAfterSlider
lib/
  site-config.js     Brand name, contact info, service areas, stats, social links
  services-data.js   Array of 14 services (slug, title, summary, features, images, SEO meta)
  projects-data.js   Array of gallery projects (slug, title, category, city, images, description)
  mailer.js          Nodemailer transport + branded HTML email template builder
hooks/
  useScrollDirection.js   Drives nav show/hide
  useReducedMotion.js     Wraps prefers-reduced-motion media query
```

## 7. Animation System

- **Framer Motion (Motion for React)**: entrance reveals, staggered text reveals, scroll-linked transforms (via `useScroll`/`useTransform` for the three scroll-progress sections above), hover/scale micro-interactions, page-level choreography
- **React Spring**: used only for the before/after image comparison slider on project detail pages (inherently physics/drag-driven) — not adopted anywhere else just because the brief mentions it
- **No magnetic cursor/button interactions** — explicitly excluded per user direction
- **No custom cursor** — not requested; default cursor throughout
- All animation respects `prefers-reduced-motion` via a shared hook/CSS media query — reduced-motion users get simplified (not broken) transitions
- Entrance/scroll animations use `transform`/`opacity` only; no layout-triggering properties animated

## 8. Contact Backend

- `app/api/contact/route.js` — Next.js Route Handler
- Accepts `multipart/form-data` (name, email, phone, message, optional file attachment)
- Nodemailer SMTP transport, configured via env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`
- Sends branded HTML email to business inbox with inline logo via CID embedding, matching reference project's approach
- File attachment passthrough from form submission to email
- Env vars documented in `.env.example`; real credentials supplied later by user via `.env.local` (not committed)
- Client-side form validation + loading/success/error states in `ContactForm`

## 9. Performance, Responsiveness & Accessibility

**Performance targets** (measured via Lighthouse/PageSpeed Insights on mobile, not just desktop):
- Core Web Vitals in the "good" band: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Server Components by default; `"use client"` only on interactive leaves (nav, form, animated counters, motion-driven wrappers, before/after slider, scroll-progress sections)
- `next/image` everywhere with explicit `sizes`, correct aspect ratios, `priority` only on the hero image — zero cumulative layout shift
- Fonts loaded via `next/font` (already self-hosted/subset, no render-blocking font requests)
- Route-level code splitting is automatic per page (App Router); heavy client-only libraries (Framer Motion, React Spring) are only imported into the components that use them, not the root layout
- No unnecessary client-side state, no polling, no unbounded event listeners (scroll/resize listeners are throttled via `requestAnimationFrame` or passive listeners where used)

**Responsiveness**:
- Breakpoints tested at five widths: large desktop (1440px+), standard desktop (1280px), tablet (768px), and mobile (390px and 360px)
- Complex desktop compositions (layered hero collage, multi-column service grids, sticky process steps) get a distinct, intentionally re-composed mobile layout — not a shrunk copy. E.g. the hero collage stacks vertically on mobile instead of overlapping; sticky/pinned scroll sections degrade to normal vertical flow with on-enter reveals instead of scroll-pinning (which behaves poorly on mobile browsers)
- Touch targets minimum 44×44px; no hover-only affordances (every hover interaction has a tap-equivalent state)
- No horizontal overflow at any breakpoint

**Accessibility**:
- Semantic HTML, visible focus states, proper heading hierarchy (one H1 per page), keyboard-navigable nav and form, meaningful alt text on all images (descriptive, not filler)
- `prefers-reduced-motion` respected globally — reduced-motion users get simplified crossfades instead of the parallax/scroll-progress/stagger treatments

## 10. SEO, AEO & GEO

Traditional SEO plus concrete practices for being surfaced/cited well by AI answer engines (ChatGPT, Perplexity, Google AI Overviews — "AEO"/"GEO") and local search ("GEO" also read here as geo-targeted local SEO, matching the reference project's city-based approach). No separate tooling — all implemented as standard Next.js metadata + structured data:

**Per-page metadata** (via App Router `generateMetadata`, data-driven from `services-data.js`/`projects-data.js`):
- Unique `<title>` and meta description per page, including all 14 service pages and project pages (city + service keyword combinations, matching the reference project's local-SEO pattern)
- Open Graph + Twitter Card tags per page (title, description, image)
- Canonical URLs on every page

**Structured data (JSON-LD)**, added via a shared `lib/schema.js` helper:
- `LocalBusiness` (or `HomeAndConstructionBusiness`) schema on the homepage/global layout — name, address, phone, service area, hours
- `Service` schema on each `/services/[slug]` page
- `FAQPage` schema wherever FAQ content exists (see below)
- `BreadcrumbList` schema on all nested pages (services, service detail, projects, project detail)

**FAQ content** (the concrete implementation of AEO — clear question/answer pairs are what answer engines extract and cite):
- Each service detail page includes a "Frequently Asked Questions" section with 3-5 service-specific Q&As (e.g. "How long does a kitchen remodel take?"), written in direct, extractable answer form
- A general FAQ page at `/faq` covering company-wide questions (service area, quote process, timelines, licensing/insurance placeholders)
- FAQ content lives in `services-data.js` per service (or a dedicated `faq-data.js` for general FAQs) — same data-driven pattern as the rest of the site

**Semantic/technical foundations that support both traditional SEO and AEO/GEO**:
- Clean semantic HTML heading hierarchy (H1 → H2 → H3) so both crawlers and LLM extraction tools can parse page structure and topic hierarchy correctly
- `sitemap.xml` and `robots.txt` generated via Next.js's built-in `app/sitemap.js` / `app/robots.js` conventions, covering all static and dynamic (`[slug]`) routes
- Descriptive, keyword-relevant URL slugs (already the case — e.g. `/services/kitchen-remodeling`)
- Fast, crawlable server-rendered HTML (Server Components by default supports this — content is present in initial HTML, not client-rendered after the fact)

## 11. Explicit Exclusions (this pass)

- No dark mode
- No custom cursor
- No magnetic button/cursor interactions
- No literal map embed for service areas (custom diagram instead)
- Real company name/branding/photography — placeholder only, swappable later

## 12. Out of Scope / Future

- Real SMTP credentials (user supplies later)
- Real brand name, logo, copy, and photography
- CMS integration (data currently lives in local JS arrays — could migrate later without restructuring components, since components already consume data via props/arrays)
- Google Search Console / Bing Webmaster verification and submission (requires a live deployed domain — not applicable until the site is deployed)
