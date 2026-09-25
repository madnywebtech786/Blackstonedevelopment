# Construction Renovation Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **STRICT RULE — DO NOT COMMIT:** Do not run `git add`, `git commit`, `git push`, or any other command that changes git history at any point while executing this plan, even if a step below shows a `git commit` example or a general workflow habit suggests committing after a task. The user reviews and commits all changes themselves. This overrides any default commit-after-task behavior. Every "Commit" step below is replaced by a "Stop for review" step instead — leave changes uncommitted and wait for the user.

**Goal:** Build the Awwwards-level construction/renovation marketing website described in `docs/superpowers/specs/2026-09-24-construction-site-design.md` — homepage, 14 service pages, project gallery, about, contact (with working email backend), and FAQ — as a placeholder-branded, fully re-themeable Next.js site.

**Architecture:** Next.js 16 App Router, Server Components by default with `"use client"` only on interactive leaves. All content (services, projects, FAQs, site info) lives in plain JS data arrays under `lib/`, consumed by shared page templates — so new services/projects are new array entries, not new components. Visual design driven entirely by Tailwind v4 `@theme` CSS custom properties in `globals.css` for one-file re-theming.

**Tech Stack:** Next.js 16.3.6, React 19.2.8, Tailwind CSS v4, Motion (`motion` package, formerly Framer Motion), `@react-spring/web` (before/after slider only), `lucide-react`, `nodemailer`.

---

## Progress Tracker

Update this checklist as work completes. This is the single source of truth for "what's done" — keep it current after every task.

- [x] Task 1: Dependencies & project config
- [x] Task 2: Design tokens & global styles
- [x] Task 3: Fonts & root layout shell
- [x] Task 4: Site config & data layer (services, projects, FAQs)
- [x] Task 5: Core UI primitives (Button, Badge, SectionLabel, Card)
- [x] Task 6: Animation primitives (Reveal, StaggerText)
- [x] Task 7: Navigation (Nav, MobileNav, useScrollDirection)
- [x] Task 8: Footer & WhatsApp button
- [x] Task 9: Homepage — Hero section (auto-advancing slider, revised mid-build — see Task 9 note)
- [x] Task 10: Homepage — Trust stats section (left-aligned, hairline dividers — user-approved via visual companion)
- [x] Task 11: Homepage — Services preview section (scroll-active sticky list, desktop-only; card grid fallback on mobile)
- [x] Task 12: Homepage — Featured projects section (pinned horizontal scroll-jack at all breakpoints — including mobile — driven by vertical scroll progress via Motion's `useScroll`/`useTransform`; reduced-motion gets a native horizontal-swipe fallback instead)
- [x] Task 13: Homepage — Service area section (Hub Card design — Calgary as a dark HQ bar over a 2-col wrapping chip grid of the other 5 areas, same compact layout at all breakpoints, card stretched to full section width; landed after 3 rounds of Artifact comparisons — orbit diagram and typography/photo-led directions were both rejected before this one)
- [x] Task 14: Homepage — Process steps section (scroll-progress)
- [x] Task 15: Homepage — Testimonials section (revised from plan baseline — auto-playing single-quote stage with numbered index rail, per-quote service tag, and intro paragraph under heading, chosen after a 3-direction Artifact comparison)
- [x] Task 16: Homepage — CTA band & page assembly (dark inverted band as a contained `rounded-3xl` card, not full-bleed, chosen after a 3-direction Artifact comparison; Nav/Footer/WhatsAppButton wired into root layout)
- [x] Task 17: Services overview page (`/services`) — built as a "Numbered Index" editorial list (`ServiceIndexRow`), chosen from 3 Artifact-compared directions instead of the plan's baseline card grid, since the homepage's `ServicesPreview` already uses a card-free sticky/full-bleed treatment and a grid would have repeated a more generic pattern. Removed the unused baseline `ServiceCard.js`.
- [x] Task 18: Service detail template (`/services/[slug]`) with FAQ + schema — built per plan baseline (hero band, feature list, FAQ section, sticky quote sidebar, related projects), restyled to match established hairline-border/Oswald motifs instead of the plan's rounded-card sidebar. Extracted `ProjectCard` out of `FeaturedProjects.js` into `src/components/shared/ProjectCard.js` as a genuine shared component (needed here for "Related Projects" and again by Task 19's gallery) instead of duplicating it. All 14 service slugs verified via `next build` SSG output + spot-checked in dev (valid slugs 200, invalid slug 404, JSON-LD present).
- [ ] Task 19: Projects gallery page (`/projects`) with filtering
- [ ] Task 20: Before/After slider component (React Spring)
- [ ] Task 21: Project detail page (`/projects/[slug]`)
- [ ] Task 22: About page
- [ ] Task 23: FAQ page (`/faq`)
- [ ] Task 24: Contact page + ContactForm component
- [ ] Task 25: Contact API route + Nodemailer backend
- [ ] Task 26: Global SEO — sitemap.js, robots.js, JSON-LD schema helper
- [ ] Task 27: Final pass — responsiveness, reduced-motion, accessibility audit

---

## Task 1: Dependencies & Project Config

**Files:**
- Modify: `package.json`
- Modify: `next.config.mjs`
- Create: `.env.example`

- [ ] **Step 1: Install animation, icon, and email dependencies**

Run:
```bash
npm install motion @react-spring/web lucide-react nodemailer
```
Expected: `package.json` gains `motion`, `@react-spring/web`, `lucide-react`, `nodemailer` under `dependencies`.

- [ ] **Step 2: Allow Unsplash remote images**

Read `next.config.mjs`, then replace its contents:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
```

> **Gotcha confirmed during execution:** passing `port: ""` and `search: ""` (empty strings, matching one variant of the Next.js docs example) causes every page using a remote Unsplash image to fail at request time with "Invalid src prop ... hostname is not configured," even though `next dev` starts cleanly and logs no config error — the failure only surfaces when a page actually renders an `<Image>` with that host. Omit `port` and `search` entirely rather than passing empty strings; only include `pathname` if you need to restrict it.

- [ ] **Step 3: Document required contact-form env vars**

Create `.env.example`:

```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=
```

- [ ] **Step 4: Verify install**

Run: `npm run dev`
Expected: dev server starts on `http://localhost:3000` with no errors (still shows the default Next.js starter page — that's expected, it hasn't been replaced yet). Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 5: Stop for review**

Do not commit. Leave `package.json`, `package-lock.json`, `next.config.mjs`, and `.env.example` as uncommitted changes for the user to review.

---

## Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`

This is the single file that defines the re-themeable color system from the spec (section 3). Every component must consume these tokens via Tailwind utility classes (e.g. `bg-background`, `text-foreground`, `border-border`) — never hardcoded hex values.

- [ ] **Step 1: Replace globals.css with the full token system**

Read `src/app/globals.css`, then replace its contents:

```css
@import "tailwindcss";

:root {
  /* Base */
  --color-background: #f4f5f7;
  --color-foreground: #14161a;

  /* Surfaces */
  --color-surface: #eceef1;
  --color-surface-elevated: #ffffff;
  --color-border: #d7dbe1;

  /* Text */
  --color-muted-foreground: #6b7280;

  /* Accent — muted cool-blue, used ONLY for focus rings, tiny details, link-hover.
     Never as a large fill or background. */
  --color-accent: #5b7fb5;
  --color-accent-foreground: #ffffff;

  /* Primary — near-black, used for primary CTA buttons */
  --color-primary: #14161a;
  --color-primary-foreground: #f4f5f7;

  /* Fonts (set in layout via next/font, referenced here as CSS vars) */
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
}

@theme inline {
  --color-background: var(--color-background);
  --color-foreground: var(--color-foreground);
  --color-surface: var(--color-surface);
  --color-surface-elevated: var(--color-surface-elevated);
  --color-border: var(--color-border);
  --color-muted-foreground: var(--color-muted-foreground);
  --color-accent: var(--color-accent);
  --color-accent-foreground: var(--color-accent-foreground);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-foreground);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify Tailwind picks up the tokens**

Run: `npm run dev`, open `http://localhost:3000` in a browser.
Expected: page background is the light cool-gray (`#f4f5f7`), no console errors about unknown CSS. Stop the server once confirmed.

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/app/globals.css` as an uncommitted change.

---

## Task 3: Fonts & Root Layout Shell

**Files:**
- Modify: `src/app/layout.js`
- Modify: `src/app/page.js` (temporary placeholder body, replaced in Task 16)

Uses `next/font/google` per the fonts guide (`node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`) — self-hosted, no external font requests. `Oswald` provides the condensed uppercase grotesk display font approved during brainstorming; `Geist` (already in the project) remains the body/UI font.

- [ ] **Step 1: Update root layout with both fonts and base metadata**

Read `src/app/layout.js`, then replace its contents:

```jsx
import { Geist } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    template: "%s | Northgate Renovations",
    default: "Northgate Renovations — Calgary Home Renovation Contractor",
  },
  description:
    "Northgate Renovations is a Calgary-area renovation contractor specializing in kitchens, basements, bathrooms, and full home renovations.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
```

> Note: `metadataBase` uses a placeholder domain (`https://example.com`) since no real domain exists yet — update this in Task 26 or when a real domain is assigned (see spec section 12, Out of Scope).

- [ ] **Step 2: Simplify page.js to a temporary placeholder**

Read `src/app/page.js`, then replace its contents (this is intentionally minimal — Task 16 replaces it with the full assembled homepage):

```jsx
export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-screen">
      <p className="font-display uppercase text-4xl tracking-tight">
        Northgate Renovations
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Verify fonts load correctly**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: text renders in the condensed Oswald font, no hydration warnings in console. Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave `src/app/layout.js` and `src/app/page.js` as uncommitted changes.

---

## Task 4: Site Config & Data Layer

**Files:**
- Create: `src/lib/site-config.js`
- Create: `src/lib/services-data.js`
- Create: `src/lib/projects-data.js`
- Create: `src/lib/faq-data.js`

This is the data layer the entire site reads from (spec sections 2, 4, 6). No component in later tasks should hardcode brand name, phone number, service list, or FAQ copy — everything pulls from here.

- [ ] **Step 1: Create the site config**

Create `src/lib/site-config.js`:

```js
export const siteConfig = {
  name: "Northgate Renovations",
  shortName: "Northgate",
  tagline: "Spaces rebuilt right.",
  description:
    "Northgate Renovations is a Calgary-area renovation contractor specializing in kitchens, basements, bathrooms, and full home renovations.",
  url: "https://example.com",
  phone: "+1 (403) 555-0142",
  phoneHref: "tel:+14035550142",
  email: "hello@northgaterenovations.example",
  whatsappNumber: "14035550142",
  address: {
    streetAddress: "123 Example Street NW",
    addressLocality: "Calgary",
    addressRegion: "AB",
    postalCode: "T2N 0A1",
    addressCountry: "CA",
  },
  serviceAreas: [
    "Calgary",
    "Airdrie",
    "Okotoks",
    "Cochrane",
    "Chestermere",
    "Strathmore",
  ],
  social: {
    instagram: "https://instagram.com/example",
    facebook: "https://facebook.com/example",
  },
  stats: {
    yearsInBusiness: 12,
    projectsCompleted: 340,
    satisfactionPercent: 98,
  },
};
```

- [ ] **Step 2: Create the services data array**

Create `src/lib/services-data.js`. Each entry includes an `faqs` array per spec section 10.

```js
export const services = [
  {
    slug: "kitchen-remodeling",
    title: "Kitchen Remodeling",
    summary:
      "Full kitchen renovations from layout redesign to custom cabinetry, countertops, and lighting.",
    heroDescription:
      "From open-concept layout redesigns to custom cabinetry, countertops, and lighting, we turn outdated kitchens into the space your home deserves.",
    heroImage:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80",
    features: [
      "Custom cabinetry and storage design",
      "Countertop and backsplash installation",
      "Layout redesign and open-concept conversions",
      "Lighting and electrical updates",
    ],
    faqs: [
      {
        question: "How long does a kitchen remodel take?",
        answer:
          "A typical full kitchen remodel takes 4 to 8 weeks depending on scope, from demolition through final inspection.",
      },
      {
        question: "Do I need permits for a kitchen renovation?",
        answer:
          "Permits are typically required for electrical, plumbing, or structural changes. We handle permit applications as part of every project.",
      },
      {
        question: "Can I stay in my home during the remodel?",
        answer:
          "Most clients stay in their home during a kitchen remodel. We set up a temporary kitchen area and minimize disruption to the rest of the house.",
      },
    ],
  },
  {
    slug: "basement-development",
    title: "Basement Development",
    summary:
      "Transform unfinished basements into legal suites, home theaters, or additional living space.",
    heroDescription:
      "Turn unused square footage into a legal secondary suite, home theater, or additional living space — fully permitted, framed, and finished from start to end.",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    features: [
      "Legal secondary suite development",
      "Framing, insulation, and drywall",
      "Egress window installation",
      "Bathroom and wet bar rough-ins",
    ],
    faqs: [
      {
        question: "Can you build a legal basement suite?",
        answer:
          "Yes, we handle full legal secondary suite development including permits, egress windows, and required fire separation.",
      },
      {
        question: "How long does basement development take?",
        answer:
          "A full basement development typically takes 6 to 10 weeks depending on size and whether plumbing is being added.",
      },
    ],
  },
  {
    slug: "bathroom-renovation",
    title: "Bathroom Renovation",
    summary:
      "From powder room refreshes to full spa-style master bathroom transformations.",
    heroDescription:
      "From powder room refreshes to full spa-style master ensuites with curbless showers and heated flooring, we design bathrooms built around how you actually live.",
    heroImage:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1600&q=80",
    features: [
      "Custom tile and shower installation",
      "Vanity and fixture upgrades",
      "Heated flooring options",
      "Accessibility and aging-in-place modifications",
    ],
    faqs: [
      {
        question: "How long does a bathroom renovation take?",
        answer:
          "A standard bathroom renovation takes 2 to 4 weeks. Larger master ensuite projects can take up to 6 weeks.",
      },
      {
        question: "Can you make a bathroom more accessible?",
        answer:
          "Yes, we install curbless showers, grab bars, and other aging-in-place modifications as part of standard bathroom renovations.",
      },
    ],
  },
  {
    slug: "flooring",
    title: "Flooring Installation",
    summary:
      "Hardwood, engineered wood, tile, and luxury vinyl plank installation throughout the home.",
    heroImage:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1600&q=80",
    features: [
      "Hardwood and engineered wood installation",
      "Tile and luxury vinyl plank flooring",
      "Subfloor repair and leveling",
      "Whole-home flooring consistency planning",
    ],
    faqs: [
      {
        question: "What flooring material lasts the longest?",
        answer:
          "Solid hardwood and porcelain tile are the most durable options, often lasting 25+ years with proper care.",
      },
      {
        question: "How long does flooring installation take?",
        answer:
          "Most single-room flooring installs are completed in 1 to 3 days; whole-home projects typically take 1 to 2 weeks.",
      },
    ],
  },
  {
    slug: "electrical",
    title: "Electrical Services",
    summary:
      "Panel upgrades, rewiring, lighting design, and electrical work for renovations and additions.",
    heroImage:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80",
    features: [
      "Panel upgrades and rewiring",
      "Lighting design and installation",
      "EV charger installation",
      "Code-compliant renovation wiring",
    ],
    faqs: [
      {
        question: "Are your electricians licensed?",
        answer:
          "Yes, all electrical work is performed or supervised by licensed electricians and inspected to local code.",
      },
      {
        question: "Do I need an electrical permit for a renovation?",
        answer:
          "Most electrical work beyond fixture swaps requires a permit. We handle the permit process as part of the project.",
      },
    ],
  },
  {
    slug: "framing",
    title: "Framing",
    summary:
      "Structural framing for additions, basement suites, and interior wall reconfigurations.",
    heroImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80",
    features: [
      "Structural wall framing",
      "Load-bearing wall removal and beam installation",
      "Addition and extension framing",
      "Interior layout reconfiguration",
    ],
    faqs: [
      {
        question: "Can you remove a load-bearing wall?",
        answer:
          "Yes, we handle load-bearing wall removal including engineered beam installation and required permits.",
      },
    ],
  },
  {
    slug: "drywall",
    title: "Drywall & Finishing",
    summary:
      "Drywall installation, taping, mudding, and texture matching for seamless renovation finishes.",
    heroImage:
      "https://images.unsplash.com/photo-1595514535215-95762c5a0e88?w=1600&q=80",
    features: [
      "Drywall installation and repair",
      "Taping, mudding, and sanding",
      "Texture matching for additions",
      "Ceiling and wall finishing",
    ],
    faqs: [
      {
        question: "Can you match existing wall texture?",
        answer:
          "Yes, we match existing texture patterns so renovated areas blend seamlessly with the rest of your home.",
      },
    ],
  },
  {
    slug: "painting",
    title: "Interior & Exterior Painting",
    summary:
      "Professional painting services for full renovations, single rooms, or exterior refreshes.",
    heroImage:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&q=80",
    features: [
      "Interior and exterior painting",
      "Color consultation",
      "Trim, cabinet, and door refinishing",
      "Surface prep and repair",
    ],
    faqs: [
      {
        question: "Do you help with color selection?",
        answer:
          "Yes, our team provides color consultation as part of every painting project to match your renovation's design direction.",
      },
    ],
  },
  {
    slug: "decks-fencing",
    title: "Decks & Fencing",
    summary:
      "Custom deck construction and fencing for outdoor living and property definition.",
    heroImage:
      "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=1600&q=80",
    features: [
      "Custom deck design and construction",
      "Composite and pressure-treated wood options",
      "Privacy and boundary fencing",
      "Railing and stair installation",
    ],
    faqs: [
      {
        question: "Do you build permit-compliant decks?",
        answer:
          "Yes, all deck builds are designed and constructed to meet local building code and permit requirements.",
      },
    ],
  },
  {
    slug: "windows-doors",
    title: "Windows & Doors",
    summary:
      "Energy-efficient window and door replacement for renovations and additions.",
    heroImage:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80",
    features: [
      "Energy-efficient window replacement",
      "Exterior and interior door installation",
      "Egress window installation for basements",
      "Weatherproofing and sealing",
    ],
    faqs: [
      {
        question: "Will new windows lower my energy bills?",
        answer:
          "Energy-efficient window replacements typically reduce heating and cooling costs by improving insulation and reducing drafts.",
      },
    ],
  },
  {
    slug: "roofing",
    title: "Roofing",
    summary:
      "Roof replacement and repair as part of full home renovations or standalone projects.",
    heroImage:
      "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=1600&q=80",
    features: [
      "Asphalt shingle roof replacement",
      "Roof repair and leak detection",
      "Ventilation and insulation upgrades",
      "Storm damage assessment",
    ],
    faqs: [
      {
        question: "How long does a roof replacement take?",
        answer:
          "Most residential roof replacements are completed in 1 to 3 days, weather permitting.",
      },
    ],
  },
  {
    slug: "driveways-concrete",
    title: "Driveways & Concrete",
    summary:
      "Concrete driveways, walkways, and flatwork for renovation and curb appeal projects.",
    heroImage:
      "https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?w=1600&q=80",
    features: [
      "Concrete driveway installation and replacement",
      "Walkway and patio flatwork",
      "Exposed aggregate and stamped concrete finishes",
      "Grading and drainage correction",
    ],
    faqs: [
      {
        question: "How long does a concrete driveway take to cure?",
        answer:
          "Concrete driveways are typically drivable after 7 days and reach full cure strength after about 28 days.",
      },
    ],
  },
  {
    slug: "home-additions",
    title: "Home Additions",
    summary:
      "Room additions and second-story extensions to grow your home's livable space.",
    heroImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80",
    features: [
      "Single-story room additions",
      "Second-story extensions",
      "Sunrooms and enclosed porches",
      "Structural engineering and permits",
    ],
    faqs: [
      {
        question: "How long does a home addition take?",
        answer:
          "A typical single-room addition takes 8 to 14 weeks from permit approval to completion, depending on scope.",
      },
    ],
  },
  {
    slug: "general-contracting",
    title: "General Contracting",
    summary:
      "Full-service project management for multi-trade renovations from start to finish.",
    heroImage:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80",
    features: [
      "Single point of contact for multi-trade projects",
      "Permit management and inspections",
      "Subcontractor scheduling and quality control",
      "Budget and timeline management",
    ],
    faqs: [
      {
        question: "What does a general contractor do on my project?",
        answer:
          "We manage every trade involved in your renovation — scheduling, permits, inspections, and quality control — so you have one point of contact from start to finish.",
      },
    ],
  },
];

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug);
}
```

- [ ] **Step 2: Create the projects data array**

Create `src/lib/projects-data.js`:

```js
export const projects = [
  {
    slug: "hillhurst-kitchen-remodel",
    title: "Hillhurst Kitchen Remodel",
    category: "kitchen-remodeling",
    city: "Calgary",
    description:
      "A full kitchen remodel concept opening a closed-off galley kitchen into an open-concept layout with custom cabinetry.",
    beforeImage:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
  },
  {
    slug: "airdrie-basement-suite",
    title: "Airdrie Basement Suite",
    category: "basement-development",
    city: "Airdrie",
    description:
      "A legal basement suite development concept including a full kitchenette, bathroom, and separate entrance.",
    beforeImage:
      "https://images.unsplash.com/photo-1503389152951-9f343605f61e?w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
  },
  {
    slug: "okotoks-ensuite-renovation",
    title: "Okotoks Ensuite Renovation",
    category: "bathroom-renovation",
    city: "Okotoks",
    description:
      "A spa-style master ensuite concept with a curbless shower, heated flooring, and custom double vanity.",
    beforeImage:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80",
    ],
  },
  {
    slug: "cochrane-home-addition",
    title: "Cochrane Home Addition",
    category: "home-additions",
    city: "Cochrane",
    description:
      "A single-story room addition concept adding a sunroom and expanded living space to a bungalow.",
    beforeImage:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
    ],
  },
  {
    slug: "chestermere-flooring-refresh",
    title: "Chestermere Flooring Refresh",
    category: "flooring",
    city: "Chestermere",
    description:
      "A whole-home engineered hardwood flooring concept replacing carpet throughout the main living areas.",
    beforeImage:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&q=80",
    ],
  },
  {
    slug: "strathmore-deck-build",
    title: "Strathmore Deck Build",
    category: "decks-fencing",
    city: "Strathmore",
    description:
      "A custom composite deck concept with built-in seating and glass railing for unobstructed yard views.",
    beforeImage:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=1200&q=80",
    ],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(category) {
  if (!category || category === "all") return projects;
  return projects.filter((project) => project.category === category);
}
```

- [ ] **Step 3: Create the general FAQ data array**

Create `src/lib/faq-data.js`:

```js
export const generalFaqs = [
  {
    question: "What areas do you serve?",
    answer:
      "We serve Calgary and the surrounding communities of Airdrie, Okotoks, Cochrane, Chestermere, and Strathmore.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Fill out the contact form with a description of your project, or call us directly. We typically respond within one business day with next steps.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes, we are fully licensed and insured for residential renovation work in Alberta.",
  },
  {
    question: "How long does a typical renovation take?",
    answer:
      "Timelines vary by project scope — a single-room renovation like a bathroom may take 2 to 4 weeks, while larger projects like basement development or home additions can take 6 to 14 weeks.",
  },
  {
    question: "Do you handle permits?",
    answer:
      "Yes, permit applications and inspections are handled as part of every project that requires them.",
  },
];
```

- [ ] **Step 4: Verify the data imports without errors**

Run:
```bash
node -e "const { services } = require('./src/lib/services-data.js'); console.log(services.length)"
```

This will fail because the project uses ES modules (`export`), not CommonJS. Instead verify via the dev server:

Run: `npm run dev`
Expected: server starts with no import/syntax errors (nothing imports these files yet, so this just confirms valid JS syntax via Next.js's build step). Stop server.

- [ ] **Step 5: Stop for review**

Do not commit. Leave the four new `src/lib/*.js` files as uncommitted, untracked files.

---

## Task 5: Core UI Primitives

**Files:**
- Create: `src/components/ui/Button.js`
- Create: `src/components/ui/Badge.js`
- Create: `src/components/ui/SectionLabel.js`
- Create: `src/components/ui/Card.js`

These are the foundational, reusable pieces referenced throughout later sections/pages (spec section 6). All are Server Components (no `"use client"`) since they have no interactivity of their own beyond CSS `:hover`.

- [ ] **Step 1: Create the Button component**

Create `src/components/ui/Button.js`:

```jsx
import Link from "next/link";

const VARIANT_CLASSES = {
  primary:
    "bg-primary text-primary-foreground hover:bg-foreground/90 border border-primary",
  outline:
    "bg-transparent text-foreground border border-border hover:border-foreground",
};

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create the Badge component**

Create `src/components/ui/Badge.js`:

```jsx
export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create the SectionLabel component**

This implements the recurring "wide-letter-spaced uppercase micro-label" motif from spec section 3.

Create `src/components/ui/SectionLabel.js`:

```jsx
export function SectionLabel({ children, className = "" }) {
  return (
    <p
      className={`text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground ${className}`}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 4: Create the Card component**

Create `src/components/ui/Card.js`:

```jsx
export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface-elevated ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Verify components compile**

Run: `npm run dev`
Expected: no errors (components aren't imported anywhere yet, this just confirms valid JSX syntax by letting Next.js's dev compiler parse the files on next use — safe to skip a live check here since nothing imports them yet, but leave the server running for Task 6-7 verification instead of restarting each time).

- [ ] **Step 6: Stop for review**

Do not commit. Leave the four new files in `src/components/ui/` as uncommitted, untracked files.

---

## Task 6: Animation Primitives

**Files:**
- Create: `src/components/animations/Reveal.js`
- Create: `src/components/animations/StaggerText.js`

Implements spec section 7's reduced-motion requirement and the one-time on-enter reveal pattern used by most sections (as opposed to the three scroll-progress sections built later). These are Client Components since they use Motion hooks. Motion's own `useReducedMotion` hook (from `motion/react`) is used directly everywhere reduced-motion needs to be detected — no separate custom hook is created, since Motion already ships one and duplicating it would just be two sources of truth for the same media query.

- [ ] **Step 1: Create the Reveal component (one-time on-enter fade/slide)**

Create `src/components/animations/Reveal.js`:

```jsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as: Tag = "div",
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[Tag] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
```

- [ ] **Step 2: Create the StaggerText component (word-by-word headline reveal)**

Create `src/components/animations/StaggerText.js`:

```jsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export function StaggerText({ text, className = "", as: Tag = "h2" }) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag] ?? motion.h2;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
```

- [ ] **Step 3: Verify Motion package resolves correctly**

Run: `npm run dev`
Expected: no "module not found" errors for `motion/react`. Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave the two new `src/components/animations/*.js` files as uncommitted, untracked files.

---

## Task 7: Navigation

**Files:**
- Create: `src/hooks/useScrollDirection.js`
- Create: `src/components/navigation/Nav.js`
- Create: `src/components/navigation/MobileNav.js`

Implements spec section 5 (floating/transparent, scroll-aware nav) and section 9 (touch targets, keyboard navigation).

- [ ] **Step 1: Create the scroll-direction hook**

Create `src/hooks/useScrollDirection.js`:

```jsx
"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollDirection() {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    function updateScrollState() {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 24);

      const scrolledDown = currentScrollY > lastScrollY.current;
      const pastThreshold = currentScrollY > 120;
      setIsHidden(scrolledDown && pastThreshold);

      lastScrollY.current = currentScrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { isHidden, isScrolled };
}
```

- [ ] **Step 2: Create the MobileNav component**

Create `src/components/navigation/MobileNav.js`:

```jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-20 rounded-lg border border-border bg-surface-elevated p-4 shadow-lg"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium hover:bg-surface"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Create the Nav component**

Create `src/components/navigation/Nav.js`:

```jsx
"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  const { isHidden, isScrolled } = useScrollDirection();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 py-4 transition-colors duration-300 sm:px-6 lg:px-8 ${
          isScrolled ? "bg-background/80 backdrop-blur-sm" : ""
        }`}
      >
        <Link
          href="/"
          className="font-display text-lg uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {siteConfig.shortName}
        </Link>

        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium tracking-wide hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Button href="/contact" variant="primary">
            Get a Quote
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Verify Nav renders without errors**

Temporarily add `<Nav />` to `src/app/page.js` above the existing placeholder content to check it renders, then remove it again (Task 16 wires it into the real layout).

Run: `npm run dev`, open `http://localhost:3000`.
Expected: nav bar appears at top with "Northgate" logo, links, and "Get a Quote" button; resizing to mobile width shows the hamburger menu that opens/closes. Stop server, then revert `page.js` back to the Task 3 placeholder (remove the `<Nav />` you added).

- [ ] **Step 5: Stop for review**

Do not commit. Leave `src/hooks/useScrollDirection.js`, `src/components/navigation/Nav.js`, and `src/components/navigation/MobileNav.js` as uncommitted, untracked files.

---

## Task 8: Footer & WhatsApp Button

**Files:**
- Create: `src/components/layout/Footer.js`
- Create: `src/components/navigation/WhatsAppButton.js`

- [ ] **Step 1: Create the WhatsApp floating button**

Create `src/components/navigation/WhatsAppButton.js`:

```jsx
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <MessageCircle size={26} />
    </a>
  );
}
```

- [ ] **Step 2: Create the Footer component**

Create `src/components/layout/Footer.js`:

```jsx
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <p className="font-display text-xl uppercase tracking-wide">
              {siteConfig.shortName}
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <SectionLabel>Navigate</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-accent">Services</Link></li>
              <li><Link href="/projects" className="hover:text-accent">Projects</Link></li>
              <li><Link href="/about" className="hover:text-accent">About</Link></li>
              <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <SectionLabel>Service Areas</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {siteConfig.serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel>Contact</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={siteConfig.phoneHref} className="hover:text-accent">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/components/layout/Footer.js` and `src/components/navigation/WhatsAppButton.js` as uncommitted, untracked files. Verification happens in Task 16 once these are wired into the real layout.

---

## Task 9: Homepage — Hero Section

**Files:**
- Create: `src/components/sections/Hero.js`

> **Revision history:** this component went through several rounds of user feedback after the original design brief (a static layered photo collage hero per spec section 5) was replaced mid-build:
> 1. Collage → full-bleed auto-advancing slider, 3 slides sourced from `services-data.js`, each a complete "moment" (image + headline + description + two CTAs) animating together on slide change. The scroll-progress parallax requirement from spec section 5 no longer applies to the hero specifically (its motion is slide-transition-driven, not scroll-driven) — the other two approved scroll-progress sections (Featured Projects, Process Steps) are unaffected.
> 2. `min-h-screen` instead of `85vh`; larger fluid headline clamp; longer per-slide paragraph.
> 3. Fixed a white-flash flicker between slide transitions (root cause: `AnimatePresence mode="wait"` fully unmounted the outgoing image before the incoming one painted, briefly exposing the page background) by splitting into two independent `AnimatePresence` blocks — one for the background image crossfade (pure opacity, no `mode="wait"`, both slides can briefly overlap), one for the text content (`mode="wait"`, fine since text has no background to gap). Vertically centered content on all screen sizes (`items-center` instead of `items-end`). Added a dedicated `heroDescription` field per featured service (separate from the shorter `summary` used on service cards/detail pages) so the hero paragraph reads as genuine 3-line copy instead of a clipped one-liner. Changed the "Get a Quote" button to a white background with black text.
> 4. Text content (label, heading, paragraph) reverted to always-left-aligned (no `text-center`/`sm:text-left` split) — only the CTA buttons keep their own centered label text and full-width mobile stacking.

Implements the final slider hero: 3 slides drawn from the `kitchen-remodeling`, `basement-development`, and `bathroom-renovation` entries in `services-data.js`, each with its own `heroDescription` field (already included in Task 4's `services-data.js` above, alongside the shorter `summary` field used elsewhere on service cards/detail pages). Auto-advances every 6 seconds, pausing on hover/focus, disabled entirely under `prefers-reduced-motion`. Manual prev/next arrow controls and dot indicators allow direct navigation. Each slide's primary CTA links to that slide's own service page; the secondary CTA always links to `/contact` with a white background. Text content is always left-aligned and vertically centered in the viewport; CTA buttons sit in one row on desktop and stack full-width on mobile.

- [ ] **Step 1: Create the Hero component**

Create `src/components/sections/Hero.js`:

```jsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services-data";

const SLIDE_SLUGS = ["kitchen-remodeling", "basement-development", "bathroom-renovation"];

const SLIDES = SLIDE_SLUGS.map((slug) => services.find((service) => service.slug === slug)).filter(
  Boolean
);

const AUTOPLAY_MS = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef(null);

  const goTo = useCallback((nextIndex) => {
    setIndex(((nextIndex % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    timerRef.current = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timerRef.current);
  }, [goNext, isPaused, prefersReducedMotion]);

  const slide = SLIDES[index];

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative min-h-screen w-full bg-foreground">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.slug}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0.01 : 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.heroImage}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-1 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.slug}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -16 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <SectionLabel className="text-white/80">Featured Service</SectionLabel>
                <h1 className="mt-4 max-w-3xl font-display text-[clamp(3.5rem,13vw,8rem)] uppercase leading-[0.92] tracking-tight text-white">
                  {slide.title}
                </h1>
                <p className="mt-6 max-w-lg text-lg text-white/85">
                  {slide.heroDescription}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button
                    href={`/services/${slide.slug}`}
                    variant="primary"
                    className="w-full justify-center text-center sm:w-auto"
                  >
                    Explore {slide.title}
                  </Button>
                  <Button
                    href="/contact"
                    variant="outline"
                    className="w-full justify-center border-transparent bg-white text-center text-foreground hover:bg-white/90 sm:w-auto"
                  >
                    Get a Quote
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div
          className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {SLIDES.map((item, slideIndex) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={`Show ${item.title} slide`}
              onClick={() => goTo(slideIndex)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                slideIndex === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Temporarily mount Hero to verify**

Add `import { Hero } from "@/components/sections/Hero";` and `<Hero />` to `src/app/page.js` in place of the placeholder text.

Run: `npm run dev`, open `http://localhost:3000`.
Expected: first slide (Kitchen Remodeling) fills the full viewport height (`min-h-screen`) with left-aligned, vertically centered content — a large uppercase headline, a full 3-line description paragraph, and two CTA buttons in one row (desktop, primary dark + secondary white) or stacked full-width (mobile, resize via devtools); after ~6 seconds the slide crossfades seamlessly to Basement Development with no white flash or gap; clicking the dot indicators or arrow buttons navigates directly; hovering the hero pauses auto-play. No layout shift or console errors. Stop server, but leave `page.js` with `<Hero />` in place — Task 16 continues building on this file.

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/lib/services-data.js`, `src/components/sections/Hero.js`, and the updated `src/app/page.js` as uncommitted changes.

---

## Task 10: Homepage — Trust Stats Section

**Files:**
- Create: `src/components/ui/AnimatedCounter.js`
- Create: `src/components/sections/TrustStats.js`

Per spec section 5 addendum: a standard one-time count-up on first view, not scroll-tied. Layout confirmed with the user via the visual companion (4 options shown: simple centered row, left-aligned with hairline dividers, label-above-number dashboard style, inverted dark band) — the user chose **left-aligned numbers with hairline vertical dividers**, matching the design spec's "hairline borders instead of heavy shadows" signature motif (spec section 3).

- [ ] **Step 1: Create the AnimatedCounter component**

Create `src/components/ui/AnimatedCounter.js`:

```jsx
"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, animate } from "motion/react";

export function AnimatedCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      motionValue.set(value);
      if (ref.current) ref.current.textContent = `${value}${suffix}`;
      return;
    }

    const controls = animate(motionValue, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, suffix, prefersReducedMotion, motionValue]);

  return <span ref={ref}>0{suffix}</span>;
}
```

- [ ] **Step 2: Create the TrustStats component**

Create `src/components/sections/TrustStats.js`:

```jsx
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { siteConfig } from "@/lib/site-config";

const STATS = [
  { key: "yearsInBusiness", suffix: "+", label: "Years in Business" },
  { key: "projectsCompleted", suffix: "+", label: "Projects Completed" },
  { key: "satisfactionPercent", suffix: "%", label: "Client Satisfaction" },
];

export function TrustStats() {
  return (
    <section className="border-y border-border bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat, index) => (
            <Reveal key={stat.key} delay={index * 0.1} className="py-6 text-left sm:px-8 sm:py-0 sm:first:pl-0">
              <p className="font-display text-5xl uppercase tracking-tight">
                <AnimatedCounter value={siteConfig.stats[stat.key]} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount and verify**

Add `TrustStats` under `Hero` in `src/app/page.js`.

Run: `npm run dev`, open `http://localhost:3000`, scroll to the stats section.
Expected: three numbers count up from 0 to their target values (12+, 340+, 98%) once scrolled into view, only once (scrolling away and back doesn't re-trigger). Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave the new files and updated `src/app/page.js` as uncommitted changes.

---

## Task 11: Homepage — Services Preview Section

**Files:**
- Create: `src/components/sections/ServicesPreview.js`

> **Note:** an earlier version of this task also created `src/components/shared/ServiceCard.js` for use in a card-grid layout. After the revisions below, this section no longer uses `ServiceCard` (see revision 2). The `ServiceCard` component is still needed later, for the `/services` overview page — its creation has moved to Task 17, Step 1.

- [ ] **Step 1: Create the ServicesPreview section**

Only shows a curated subset (6 of 14) on the homepage, linking to the full `/services` overview — keeps the homepage scannable per spec section 18 (UX: clarity over completeness on the landing page).

> **Revision history:**
> 1. Shown to the user via the visual companion with four options (even image grid, numbered editorial list with hover preview, asymmetric featured card, horizontal scroll strip). The user chose the editorial list direction but with two changes: (1) the active/inactive state is driven by **scroll position**, not hover — a sticky/pinned image panel stays fixed while the list of service names scrolls past it, and whichever name is currently in view becomes active, swapping the pinned image and switching to a visually prominent style (larger, full-color) while inactive names stay smaller and muted; (2) no numbering (no "01", "02" prefixes) so the service name has more room.
> 2. After seeing it, the user asked why mobile and desktop looked different, and asked for a short 1-2 line description per service. Response: added a short description under each service name (reusing the `summary` field already on every `services-data.js` entry — no new data field needed). Initially unified mobile to the same numberless *text-only* list styling as desktop.
> 3. The user then reported two problems with a screenshot: (a) the active-service highlight was clearly wrong — a service was shown as active while its row wasn't actually centered in the viewport, and the next service's name was already rendering large while still off-screen; (b) the "unified" mobile list from revision 2 had no images at all, which wasn't the "modern, scroll-based" mobile design intended. Fixes:
>    - **Threshold bug root cause:** the original implementation computed `activeIndex` by dividing `scrollYProgress` (0–1 across the whole pinned container, from Motion's `useScroll`) into `featured.length` even segments. This doesn't reliably correspond to which row is actually centered in the viewport, since progress-based segmentation doesn't account for real DOM layout/rendering nuances. Replaced with a direct, standard technique: each row gets a ref, and on every scroll frame (throttled via `requestAnimationFrame`), the code measures each row's `getBoundingClientRect()` and picks whichever row's vertical center is closest to the viewport's vertical center. This is measuring the actual rendered position, not inferring it from an abstract progress value, so it can't drift out of sync with what's visually on screen.
>    - **Mobile redesign:** replaced the text-only list with full-bleed stacked image panels — each service is a tall (`70vh`) full-width photo with a bottom gradient overlay and the name + description overlaid at the bottom, stacked vertically with gaps between them, each fading in via `Reveal` as it scrolls into view. This keeps images on mobile (addressing the missing-image complaint) using a native, well-established "story/editorial scroll" pattern rather than trying to force the desktop's sticky-pin mechanic onto a small screen.

Create `src/components/sections/ServicesPreview.js`:

```jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services-data";

const FEATURED_SLUGS = [
  "kitchen-remodeling",
  "basement-development",
  "bathroom-renovation",
  "home-additions",
  "flooring",
  "general-contracting",
];

export function ServicesPreview() {
  const featured = useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => services.find((service) => service.slug === slug)).filter(
        Boolean
      ),
    []
  );

  const rowRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function updateActiveIndex() {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveIndex();
          ticking = false;
        });
        ticking = true;
      }
    }

    updateActiveIndex();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>What We Do</SectionLabel>
            <StaggerText
              text="Renovation services, done right."
              className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
            />
          </div>
          <Button href="/services" variant="outline">
            View All Services
          </Button>
        </div>

        {/* Desktop: sticky pinned image + scroll-active list */}
        <div className="relative mt-16 hidden lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="sticky top-24 h-[60vh] self-start">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              {featured.map((service, i) => (
                <motion.div
                  key={service.slug}
                  className="absolute inset-0"
                  animate={{ opacity: i === activeIndex ? 1 : 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                >
                  <Image
                    src={service.heroImage}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            {featured.map((service, i) => (
              <div
                key={service.slug}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="flex min-h-[60vh] flex-col justify-center border-b border-border"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className={`font-display uppercase tracking-tight transition-all duration-300 ${
                    i === activeIndex
                      ? "text-4xl text-foreground"
                      : "text-2xl text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {service.title}
                </Link>
                <p
                  className={`mt-3 max-w-sm text-sm text-muted-foreground transition-opacity duration-300 ${
                    i === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {service.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/tablet: full-bleed stacked image panels, fade/scale in on scroll */}
        <div className="mt-12 flex flex-col gap-4 lg:hidden">
          {featured.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 3) * 0.06}>
              <Link
                href={`/services/${service.slug}`}
                className="group relative block h-[70vh] min-h-105 overflow-hidden rounded-lg"
              >
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-active:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-3xl uppercase tracking-tight text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-white/85">{service.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount and verify**

Add `ServicesPreview` under `TrustStats` in `src/app/page.js`.

Run: `npm run dev`, open `http://localhost:3000` at a desktop-width viewport (≥1024px), and scroll slowly through the section.
Expected: a sticky image panel on the left stays pinned in place while scrolling; the service name list scrolls past it on the right; whichever name's row is actually centered in the viewport (verify visually, not just "roughly near the top") is shown large and full-color with its description fading in, while others stay smaller and muted — the active name should change exactly as its row crosses the vertical center of the screen, not early or late. At mobile/tablet widths (resize via devtools), the section becomes a vertically stacked series of full-bleed photo panels, each ~70% of the viewport tall with the service name and description overlaid at the bottom on a dark gradient, fading in as each one scrolls into view — no sticky/pin behavior, just plain scroll reveals. Clicking any name or panel navigates to its `/services/[slug]` page (will 404 until Task 18 — that's expected at this point). No console errors. Stop server.

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/components/sections/ServicesPreview.js` and the updated `page.js` as uncommitted changes.

---

## Task 12: Homepage — Featured Projects Section (Scroll-Progress Reveal)

**Files:**
- Create: `src/components/shared/ProjectCard.js`
- Create: `src/components/sections/FeaturedProjects.js`

Per spec section 5 addendum, project images scale/reveal progressively as each one scrolls through the viewport — one of the three approved scroll-progress sections.

- [ ] **Step 1: Create the ProjectCard component**

Create `src/components/shared/ProjectCard.js`:

```jsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], prefersReducedMotion ? [1, 1, 1] : [0.92, 1, 0.92]);

  return (
    <Link href={`/projects/${project.slug}`} ref={cardRef} className="group block">
      <motion.div
        style={{ scale }}
        className="relative h-72 overflow-hidden rounded-lg sm:h-80"
      >
        <Image
          src={project.afterImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">{project.city}</p>
          <p className="mt-1 font-display text-lg uppercase text-white">{project.title}</p>
        </div>
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 2: Create the FeaturedProjects section**

Create `src/components/sections/FeaturedProjects.js`:

```jsx
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { projects } from "@/lib/projects-data";

export function FeaturedProjects() {
  const featured = projects.slice(0, 3);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Recent Work</SectionLabel>
            <StaggerText
              text="Proof, not just promises."
              className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
            />
          </div>
          <Button href="/projects" variant="outline">
            View All Projects
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount and verify**

Add `FeaturedProjects` under `ServicesPreview` in `src/app/page.js`.

Run: `npm run dev`, open `http://localhost:3000`, scroll through the projects grid slowly.
Expected: each project card subtly scales up as it enters the center of the viewport and scales back down as it leaves — a continuous scroll-tied effect, not a one-time trigger. Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave the new files and updated `page.js` as uncommitted changes.

---

## Task 13: Homepage — Service Area Section

**Files:**
- Create: `src/components/sections/ServiceAreaSection.js`

Per spec section 5 and explicit exclusion in section 11: a custom diagram, not a literal map embed.

- [ ] **Step 1: Create the ServiceAreaSection component**

Create `src/components/sections/ServiceAreaSection.js`:

```jsx
import { Reveal } from "@/components/animations/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { siteConfig } from "@/lib/site-config";

export function ServiceAreaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>Where We Work</SectionLabel>
        <StaggerText
          text="Proudly serving Calgary and area."
          className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
        />

        <div className="relative mt-16 flex min-h-80 items-center justify-center">
          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            <div className="absolute inset-0 rounded-full border border-border" />
            <div className="absolute inset-8 rounded-full border border-border" />
            <div className="absolute inset-16 rounded-full border border-border" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-sm uppercase tracking-widest">
                {siteConfig.serviceAreas[0]}
              </span>
            </div>

            {siteConfig.serviceAreas.slice(1).map((area, index) => {
              const angle = (index / (siteConfig.serviceAreas.length - 1)) * 2 * Math.PI;
              const radius = 46;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);

              return (
                <Reveal
                  key={area}
                  delay={index * 0.08}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  as="span"
                >
                  <span
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium"
                  >
                    {area}
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

> Note: the `Reveal` component's `as` prop wraps a positioned `<span>` — the inline `style` on the inner span controls the radial layout position, independent of the Reveal wrapper's own transform, so the two don't conflict.

- [ ] **Step 2: Mount and verify**

Add `ServiceAreaSection` under `FeaturedProjects` in `src/app/page.js`.

Run: `npm run dev`, open `http://localhost:3000`, scroll to the service area section.
Expected: a radial diagram with "Calgary" centered and the five other service areas arranged in a circle around it, each fading in as the section scrolls into view. No overlapping text at desktop or mobile widths. Stop server.

- [ ] **Step 3: Stop for review**

Do not commit. Leave the new file and updated `page.js` as uncommitted changes.

---

## Task 14: Homepage — Process Steps Section (Scroll-Progress)

**Files:**
- Create: `src/components/sections/ProcessSteps.js`

Per spec section 5 addendum: steps progressively highlight/connect as the user scrolls through — the second of three approved scroll-progress sections. Per spec section 9 (responsiveness), pinned/sticky behavior is desktop-only; mobile gets normal vertical flow with on-enter reveals instead, since scroll-pinning behaves poorly on mobile browsers.

- [ ] **Step 1: Create the ProcessSteps component**

Create `src/components/sections/ProcessSteps.js`:

```jsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";

const STEPS = [
  { number: "01", title: "Quote", description: "Tell us about your project and get a detailed quote within one business day." },
  { number: "02", title: "Plan", description: "We finalize design details, materials, permits, and a project timeline together." },
  { number: "03", title: "Build", description: "Our crews execute the work with regular updates and on-site quality checks." },
  { number: "04", title: "Handover", description: "A final walkthrough ensures every detail meets our standard before we call it done." },
];

export function ProcessSteps() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>How It Works</SectionLabel>
        <StaggerText
          text="From first call to final walkthrough."
          className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
        />

        <div ref={containerRef} className="relative mt-16">
          {!prefersReducedMotion && (
            <div className="absolute left-[19px] top-2 hidden h-[calc(100%-16px)] w-px bg-border sm:block">
              <motion.div
                style={{ scaleY: lineScale }}
                className="h-full w-full origin-top bg-foreground"
              />
            </div>
          )}

          <div className="space-y-12 sm:space-y-16">
            {STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.05}>
                <div className="flex gap-6 sm:pl-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated font-display text-sm">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount and verify**

Add `ProcessSteps` under `ServiceAreaSection` in `src/app/page.js`.

Run: `npm run dev`, open `http://localhost:3000`, scroll through the process section at desktop width, then resize to mobile width and scroll through again.
Expected: at desktop width, a vertical line fills in (scales from 0 to full height) as you scroll past the four steps; at mobile width the connecting line is hidden (per the `sm:block` class) and steps simply reveal on scroll without a pinned/connecting-line effect. Stop server.

- [ ] **Step 3: Stop for review**

Do not commit. Leave the new file and updated `page.js` as uncommitted changes.

---

## Task 15: Homepage — Testimonials Section

**Files:**
- Create: `src/lib/testimonials-data.js`
- Create: `src/components/sections/Testimonials.js`

Per spec section 5: editorial layout, not a generic carousel-card cliché — implemented as a static asymmetric grid instead.

- [ ] **Step 1: Create the testimonials data**

Create `src/lib/testimonials-data.js`:

```js
export const testimonials = [
  {
    quote:
      "Northgate turned our outdated kitchen into the best room in the house. Communication was clear from the first call to the final walkthrough.",
    author: "Sarah M.",
    location: "Calgary, AB",
  },
  {
    quote:
      "The basement suite they built for us has been a fantastic source of rental income. Every detail was handled professionally, including all the permits.",
    author: "James T.",
    location: "Airdrie, AB",
  },
  {
    quote:
      "We interviewed four contractors before choosing Northgate. Their quote was detailed and the work matched it exactly — no surprises.",
    author: "Priya K.",
    location: "Okotoks, AB",
  },
];
```

- [ ] **Step 2: Create the Testimonials section**

Create `src/components/sections/Testimonials.js`:

```jsx
import { Reveal } from "@/components/animations/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { testimonials } from "@/lib/testimonials-data";

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>Client Words</SectionLabel>
        <StaggerText
          text="Trusted across Calgary and area."
          className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <blockquote className="border-l-2 border-foreground pl-6">
              <p className="font-display text-2xl leading-snug tracking-tight sm:text-3xl">
                &ldquo;{featured.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-muted-foreground">
                {featured.author} — {featured.location}
              </footer>
            </blockquote>
          </Reveal>

          <div className="flex flex-col gap-8">
            {rest.map((testimonial, index) => (
              <Reveal key={testimonial.author} delay={0.1 + index * 0.08}>
                <blockquote className="border-l border-border pl-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-xs font-medium">
                    {testimonial.author} — {testimonial.location}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount and verify**

Add `Testimonials` under `ProcessSteps` in `src/app/page.js`.

Run: `npm run dev`, open `http://localhost:3000`, scroll to testimonials.
Expected: one large featured quote on the left (2/3 width on desktop) with two smaller quotes stacked on the right, all fading in on scroll. Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave the new files and updated `page.js` as uncommitted changes.

---

## Task 16: Homepage — CTA Band & Page Assembly

**Files:**
- Create: `src/components/sections/CTABand.js`
- Modify: `src/app/layout.js`
- Modify: `src/app/page.js`

This task assembles the complete homepage in final order (spec section 5) and wires `Nav`, `Footer`, and `WhatsAppButton` into the root layout so they appear on every page going forward.

- [ ] **Step 1: Create the CTABand component**

Create `src/components/sections/CTABand.js`:

```jsx
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export function CTABand() {
  return (
    <section className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl uppercase tracking-tight sm:text-4xl">
            Ready to start your renovation?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tell us about your project and we&apos;ll get back to you within one business day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary">
              Get a Quote
            </Button>
            <Button href={siteConfig.phoneHref} variant="outline">
              Call {siteConfig.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire Nav, Footer, and WhatsAppButton into the root layout**

Read `src/app/layout.js`, then update the `<body>` contents:

```jsx
import { Geist } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/navigation/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    template: "%s | Northgate Renovations",
    default: "Northgate Renovations — Calgary Home Renovation Contractor",
  },
  description:
    "Northgate Renovations is a Calgary-area renovation contractor specializing in kitchens, basements, bathrooms, and full home renovations.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Assemble the final homepage**

Read `src/app/page.js`, then replace its contents with the full section order from spec section 5 (Nav/Footer are now in the layout, so `page.js` only contains sections 2–9):

```jsx
import { Hero } from "@/components/sections/Hero";
import { TrustStats } from "@/components/sections/TrustStats";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABand } from "@/components/sections/CTABand";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStats />
      <ServicesPreview />
      <FeaturedProjects />
      <ServiceAreaSection />
      <ProcessSteps />
      <Testimonials />
      <CTABand />
    </>
  );
}
```

- [ ] **Step 4: Full homepage verification**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: nav fixed at top (hides on scroll-down, reappears on scroll-up), full homepage in the order Hero → TrustStats → ServicesPreview → FeaturedProjects → ServiceAreaSection → ProcessSteps → Testimonials → CTABand → Footer, WhatsApp button floating bottom-right on every scroll position. No console errors, no horizontal scroll at 375px width (test via browser devtools device toolbar). Stop server.

- [ ] **Step 5: Stop for review**

Do not commit. Leave `src/components/sections/CTABand.js`, `src/app/layout.js`, and `src/app/page.js` as uncommitted changes. Update the Progress Tracker at the top of this file: check off Tasks 1–16.

---

## Task 17: Services Overview Page

**Files:**
- Create: `src/components/shared/ServiceCard.js`
- Create: `src/app/services/page.js`

- [ ] **Step 1: Create the ServiceCard component**

This was originally planned for Task 11's homepage preview section, but that section no longer uses card-style thumbnails (see Task 11's revision history) — `ServiceCard` is used here instead, for the full `/services` grid where a photo-forward thumbnail per service makes sense.

Create `src/components/shared/ServiceCard.js`:

```jsx
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function ServiceCard({ service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-surface-elevated"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between p-5">
        <div>
          <h3 className="font-display text-lg uppercase tracking-tight">
            {service.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {service.summary}
          </p>
        </div>
        <ArrowUpRight
          size={20}
          className="shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
        />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create the services overview page**

Create `src/app/services/page.js`:

```jsx
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Reveal } from "@/components/animations/Reveal";
import { services } from "@/lib/services-data";

export const metadata = {
  title: "Services",
  description:
    "Explore all renovation services offered by Northgate Renovations, from kitchen remodeling to full home additions across Calgary and area.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
      <SectionLabel>All Services</SectionLabel>
      <h1 className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Renovation services
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={(index % 3) * 0.06}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3000/services`.
Expected: a grid of all 14 services renders (links will 404 until Task 18). Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave `src/components/shared/ServiceCard.js` and `src/app/services/page.js` as uncommitted, untracked files.

---

## Task 18: Service Detail Template with FAQ + Schema

**Files:**
- Create: `src/lib/schema.js`
- Create: `src/app/services/[slug]/page.js`

Implements spec section 10 in full: per-page metadata, `Service` JSON-LD, `FAQPage` JSON-LD, `BreadcrumbList` JSON-LD, plus the FAQ content section.

- [ ] **Step 1: Create the schema.js helper**

Create `src/lib/schema.js`:

```js
import { siteConfig } from "@/lib/site-config";

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    areaServed: siteConfig.serviceAreas,
  };
}

export function getServiceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    description: service.summary,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
    },
    areaServed: siteConfig.serviceAreas,
  };
}

export function getFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
```

- [ ] **Step 2: Create the service detail page**

Create `src/app/services/[slug]/page.js`. Uses `generateStaticParams` and `generateMetadata` per the Next.js 16 conventions confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` (params is a Promise).

```jsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { services, getServiceBySlug } from "@/lib/services-data";
import { projects, getProjectsByCategory } from "@/lib/projects-data";
import { siteConfig } from "@/lib/site-config";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { ProjectCard } from "@/components/shared/ProjectCard";
import {
  getServiceSchema,
  getFaqSchema,
  getBreadcrumbSchema,
} from "@/lib/schema";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: `${service.summary} Serving ${siteConfig.serviceAreas.join(", ")}.`,
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.summary,
      images: [service.heroImage],
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedProjects = getProjectsByCategory(service.slug).slice(0, 3);

  const jsonLd = [
    getServiceSchema(service),
    getFaqSchema(service.faqs),
    getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
  ];

  return (
    <div>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative h-[50vh] min-h-90 w-full overflow-hidden">
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <SectionLabel className="text-white/80">Service</SectionLabel>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-white sm:text-5xl">
            {service.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg text-muted-foreground">{service.summary}</p>

            <h2 className="mt-10 font-display text-2xl uppercase tracking-tight">
              What&apos;s Included
            </h2>
            <ul className="mt-4 space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-14 font-display text-2xl uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="mt-4 divide-y divide-border">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-border bg-surface p-6">
            <p className="font-display text-lg uppercase tracking-tight">
              Ready to get started?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Get a detailed quote for your {service.title.toLowerCase()} project.
            </p>
            <Button href="/contact" variant="primary" className="mt-6 w-full">
              Request a Quote
            </Button>
          </aside>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl uppercase tracking-tight">
              Related Projects
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify all 14 service pages render**

Run: `npm run dev`, then visit each of these in a browser (or spot-check at least 4, including the first and last):
- `http://localhost:3000/services/kitchen-remodeling`
- `http://localhost:3000/services/general-contracting`
- `http://localhost:3000/services/roofing`
- `http://localhost:3000/services/nonexistent-slug` (should show the Next.js 404 page via `notFound()`)

Expected: each valid slug renders hero image, feature list, FAQ accordion-style list, and (for kitchen-remodeling/basement-development/etc.) related project cards; the invalid slug shows a 404. View page source and confirm `<script type="application/ld+json">` blocks are present. Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave `src/lib/schema.js` and `src/app/services/[slug]/page.js` as uncommitted, untracked files.

---

## Task 19: Projects Gallery Page with Filtering

**Files:**
- Create: `src/app/projects/page.js`
- Create: `src/components/shared/ProjectFilter.js`

- [ ] **Step 1: Create the ProjectFilter client component**

Category filtering needs client-side state, so this is a small `"use client"` island inside an otherwise server-rendered page.

Create `src/components/shared/ProjectFilter.js`:

```jsx
"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { projects } from "@/lib/projects-data";
import { services } from "@/lib/services-data";

export function ProjectFilter() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const usedSlugs = new Set(projects.map((project) => project.category));
    return [
      { slug: "all", title: "All Projects" },
      ...services.filter((service) => usedSlugs.has(service.slug)),
    ];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActiveCategory(category.slug)}
            aria-pressed={activeCategory === category.slug}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent hover:border-foreground"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the projects gallery page**

Create `src/app/projects/page.js`:

```jsx
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectFilter } from "@/components/shared/ProjectFilter";

export const metadata = {
  title: "Projects",
  description:
    "Browse completed renovation projects from Northgate Renovations across Calgary, Airdrie, Okotoks, Cochrane, Chestermere, and Strathmore.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
      <SectionLabel>Our Work</SectionLabel>
      <h1 className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Project gallery
      </h1>

      <div className="mt-12">
        <ProjectFilter />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify filtering works**

Run: `npm run dev`, open `http://localhost:3000/projects`.
Expected: all 6 placeholder projects show by default; clicking a category filter (e.g. "Kitchen Remodeling") narrows the grid to matching projects only; clicking "All Projects" restores the full grid. Keyboard-only navigation (Tab + Enter) can operate the filter buttons. Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave `src/app/projects/page.js` and `src/components/shared/ProjectFilter.js` as uncommitted, untracked files.

---

## Task 20: Before/After Slider Component (React Spring)

**Files:**
- Create: `src/components/shared/BeforeAfterSlider.js`

This is the one place React Spring is used per spec section 7 — a drag-based comparison slider.

- [ ] **Step 1: Create the BeforeAfterSlider component**

Create `src/components/shared/BeforeAfterSlider.js`:

```jsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";

export function BeforeAfterSlider({ beforeImage, afterImage, beforeAlt, afterAlt }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(50);

  const [springProps, api] = useSpring(() => ({
    left: "50%",
    config: { tension: 300, friction: 30 },
  }));

  function updatePosition(clientX) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const rawPercent = ((clientX - rect.left) / rect.width) * 100;
    const clampedPercent = Math.min(100, Math.max(0, rawPercent));

    setPosition(clampedPercent);
    api.start({ left: `${clampedPercent}%`, immediate: isDragging });
  }

  function handlePointerDown(event) {
    setIsDragging(true);
    updatePosition(event.clientX);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;
    updatePosition(event.clientX);
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      const next = Math.max(0, position - 5);
      setPosition(next);
      api.start({ left: `${next}%` });
    } else if (event.key === "ArrowRight") {
      const next = Math.min(100, position + 5);
      setPosition(next);
      api.start({ left: `${next}%` });
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-lg"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Image
        src={afterImage}
        alt={afterAlt}
        fill
        sizes="(min-width: 1024px) 800px, 100vw"
        className="object-cover"
      />

      <animated.div
        style={{ width: springProps.left }}
        className="absolute inset-y-0 left-0 overflow-hidden"
      >
        <div className="relative h-full" style={{ width: containerRef.current?.offsetWidth ?? "100vw" }}>
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
          />
        </div>
      </animated.div>

      <animated.div
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare before and after images"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={handleKeyDown}
        style={{ left: springProps.left }}
        className="absolute inset-y-0 flex w-1 -translate-x-1/2 cursor-ew-resize items-center justify-center bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
          <span className="text-xs font-semibold">⇔</span>
        </span>
      </animated.div>
    </div>
  );
}
```

> Note: the inner "before" image wrapper reads `containerRef.current?.offsetWidth` to keep the clipped image at full container width regardless of the clip percentage — this avoids the before-image stretching/squashing as the slider moves. This value is read at render time; since `position` changes trigger re-renders on every drag frame, the width stays in sync without a separate effect.

- [ ] **Step 2: Verify in isolation**

Temporarily add this to `src/app/page.js` above `<Hero />` to test:
```jsx
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
// ...
<div className="mx-auto max-w-2xl p-8">
  <BeforeAfterSlider
    beforeImage="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1400&q=80"
    afterImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1400&q=80"
    beforeAlt="Before"
    afterAlt="After"
  />
</div>
```

Run: `npm run dev`, open `http://localhost:3000`.
Expected: dragging left/right on the image reveals more/less of the "before" image; the divider follows the cursor smoothly (spring-eased); clicking the divider and pressing arrow keys moves it in 5% increments. Stop server, then remove this temporary test block from `page.js` (Task 21 wires the real usage into the project detail page instead).

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/components/shared/BeforeAfterSlider.js` as an uncommitted, untracked file, and confirm `page.js` is back to its Task 16 state (no leftover test import).

---

## Task 21: Project Detail Page

**Files:**
- Create: `src/app/projects/[slug]/page.js`

- [ ] **Step 1: Create the project detail page**

Create `src/app/projects/[slug]/page.js`:

```jsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/projects-data";
import { getServiceBySlug } from "@/lib/services-data";
import { siteConfig } from "@/lib/site-config";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
import { getBreadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: `${project.description} A ${project.category.replace(/-/g, " ")} project in ${project.city}, ${siteConfig.address.addressRegion}.`,
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.description,
      images: [project.afterImage],
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const service = getServiceBySlug(project.category);

  const jsonLd = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SectionLabel>{project.city}</SectionLabel>
      <h1 className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl">
        {project.title}
      </h1>
      <p className="mt-6 max-w-2xl text-muted-foreground">{project.description}</p>

      <div className="mt-10">
        <BeforeAfterSlider
          beforeImage={project.beforeImage}
          afterImage={project.afterImage}
          beforeAlt={`${project.title} before renovation`}
          afterAlt={`${project.title} after renovation`}
        />
      </div>

      {project.gallery.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.gallery.map((image) => (
            <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={image}
                alt={`${project.title} gallery photo`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {service && (
        <div className="mt-12 rounded-lg border border-border bg-surface p-6">
          <p className="font-display text-lg uppercase tracking-tight">
            Interested in a similar project?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            This project falls under our {service.title} service.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href={`/services/${service.slug}`} variant="outline">
              View {service.title}
            </Button>
            <Button href="/contact" variant="primary">
              Request a Quote
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, open `http://localhost:3000/projects/hillhurst-kitchen-remodel`.
Expected: title, description, draggable before/after slider, gallery grid, and a link back to the related service render correctly. Try `http://localhost:3000/projects/nonexistent` and confirm it 404s. Stop server.

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/app/projects/[slug]/page.js` as an uncommitted, untracked file.

---

## Task 22: About Page

**Files:**
- Create: `src/app/about/page.js`

- [ ] **Step 1: Create the about page**

Create `src/app/about/page.js`:

```jsx
import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "About",
  description:
    "Learn about Northgate Renovations, a Calgary-area renovation contractor with over a decade of experience in home renovation and development.",
};

const STATS = [
  { key: "yearsInBusiness", suffix: "+", label: "Years in Business" },
  { key: "projectsCompleted", suffix: "+", label: "Projects Completed" },
  { key: "satisfactionPercent", suffix: "%", label: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
        <SectionLabel>About Us</SectionLabel>
        <StaggerText
          text="Built on craftsmanship and clear communication."
          className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl"
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-muted-foreground">
              {siteConfig.name} has spent over a decade helping homeowners across{" "}
              {siteConfig.serviceAreas.join(", ")} turn outdated spaces into homes they
              love. From kitchen remodels to full basement developments, every project
              is run by a dedicated team that manages permits, scheduling, and quality
              control from start to finish.
            </p>
            <p className="mt-4 text-muted-foreground">
              We believe a renovation should feel exciting, not stressful. That means
              detailed quotes with no surprises, regular updates during construction,
              and a final walkthrough to make sure every detail meets our standard.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="relative h-80 overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80"
              alt="Renovation crew reviewing project plans on site"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STATS.map((stat, index) => (
              <Reveal key={stat.key} delay={index * 0.1}>
                <p className="font-display text-5xl uppercase tracking-tight">
                  <AnimatedCounter value={siteConfig.stats[stat.key]} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionLabel>Where We Work</SectionLabel>
        <h2 className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl">
          Service areas
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {siteConfig.serviceAreas.map((area) => (
            <li
              key={area}
              className="rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm font-medium"
            >
              {area}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, open `http://localhost:3000/about`.
Expected: story section with image, animated stats (count up once on scroll into view), and service area list all render correctly. Stop server.

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/app/about/page.js` as an uncommitted, untracked file.

---

## Task 23: FAQ Page

**Files:**
- Create: `src/app/faq/page.js`

- [ ] **Step 1: Create the FAQ page**

Create `src/app/faq/page.js`:

```jsx
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { generalFaqs } from "@/lib/faq-data";
import { getFaqSchema } from "@/lib/schema";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about working with Northgate Renovations, including service areas, quotes, permits, and timelines.",
};

export default function FaqPage() {
  const jsonLd = getFaqSchema(generalFaqs);

  return (
    <div className="mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SectionLabel>FAQ</SectionLabel>
      <StaggerText
        text="Frequently asked questions."
        className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl"
      />

      <div className="mt-12 divide-y divide-border">
        {generalFaqs.map((faq, index) => (
          <Reveal key={faq.question} delay={(index % 4) * 0.05} className="py-6">
            <h2 className="font-medium">{faq.question}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, open `http://localhost:3000/faq`.
Expected: all 5 general FAQs render with reveal animation; view page source and confirm the `FAQPage` JSON-LD script is present. Stop server.

- [ ] **Step 3: Stop for review**

Do not commit. Leave `src/app/faq/page.js` as an uncommitted, untracked file.

---

## Task 24: Contact Page + ContactForm Component

**Files:**
- Create: `src/components/shared/ContactForm.js`
- Create: `src/app/contact/page.js`

- [ ] **Step 1: Create the ContactForm client component**

Create `src/components/shared/ContactForm.js`:

```jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const INITIAL_STATE = { status: "idle", message: "" };

export function ContactForm() {
  const [formState, setFormState] = useState(INITIAL_STATE);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormState({ status: "submitting", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setFormState({
        status: "success",
        message: "Thanks — we'll be in touch within one business day.",
      });
      form.reset();
    } catch (error) {
      setFormState({ status: "error", message: error.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full rounded-md border border-border bg-surface-elevated px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-md border border-border bg-surface-elevated px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-1.5 w-full rounded-md border border-border bg-surface-elevated px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Project details
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1.5 w-full rounded-md border border-border bg-surface-elevated px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div>
        <label htmlFor="attachment" className="block text-sm font-medium">
          Attach a photo (optional)
        </label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept="image/*,.pdf"
          className="mt-1.5 w-full text-sm"
        />
      </div>

      <Button type="submit" disabled={formState.status === "submitting"}>
        {formState.status === "submitting" ? "Sending..." : "Send Message"}
      </Button>

      {formState.status === "success" && (
        <p role="status" className="text-sm text-accent">
          {formState.message}
        </p>
      )}

      {formState.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {formState.message}
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Create the contact page**

Create `src/app/contact/page.js`:

```jsx
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { ContactForm } from "@/components/shared/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Northgate Renovations for a quote on your next renovation project in Calgary and area.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-32 sm:px-6 lg:px-8">
      <SectionLabel>Get In Touch</SectionLabel>
      <StaggerText
        text="Let's talk about your project."
        className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl"
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <SectionLabel>Phone</SectionLabel>
            <a href={siteConfig.phoneHref} className="mt-1 block hover:text-accent">
              {siteConfig.phone}
            </a>
          </div>
          <div>
            <SectionLabel>Email</SectionLabel>
            <a href={`mailto:${siteConfig.email}`} className="mt-1 block hover:text-accent">
              {siteConfig.email}
            </a>
          </div>
          <div>
            <SectionLabel>Service Areas</SectionLabel>
            <p className="mt-1 text-muted-foreground">
              {siteConfig.serviceAreas.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify the form UI (backend not yet built)**

Run: `npm run dev`, open `http://localhost:3000/contact`.
Expected: form renders with all fields, required-field browser validation triggers on empty submit, submitting shows "Sending..." then an error message (expected — `/api/contact` doesn't exist until Task 25). Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave `src/components/shared/ContactForm.js` and `src/app/contact/page.js` as uncommitted, untracked files.

---

## Task 25: Contact API Route + Nodemailer Backend

**Files:**
- Create: `src/lib/mailer.js`
- Create: `src/app/api/contact/route.js`

Implements spec section 8 in full. Uses Next.js Route Handler conventions confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` (FormData via `request.formData()`).

- [ ] **Step 1: Create the mailer helper**

Create `src/lib/mailer.js`:

```js
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildContactEmailHtml({ name, email, phone, message }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #14161a; padding: 24px; text-align: center;">
        <h1 style="color: #f4f5f7; font-size: 18px; margin: 0; letter-spacing: 0.05em; text-transform: uppercase;">
          ${siteConfig.name}
        </h1>
      </div>
      <div style="padding: 24px; border: 1px solid #d7dbe1; border-top: none;">
        <h2 style="font-size: 16px; margin-top: 0;">New quote request</h2>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
        ${phone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
        <p style="margin: 16px 0 4px;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>
    </div>
  `;
}

export async function sendContactEmail({ name, email, phone, message, attachment }) {
  const transporter = getTransporter();

  const attachments = [];
  if (attachment && attachment.size > 0) {
    const buffer = Buffer.from(await attachment.arrayBuffer());
    attachments.push({
      filename: attachment.name,
      content: buffer,
    });
  }

  await transporter.sendMail({
    from: `"${siteConfig.name} Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `New quote request from ${name}`,
    html: buildContactEmailHtml({ name, email, phone, message }),
    attachments,
  });
}
```

> Note: inline logo-via-CID embedding from the spec requires an actual logo image file, which doesn't exist yet (placeholder brand has no real logo asset). The email template above ships without it; add a `cid` attachment + `<img src="cid:logo">` tag once a real logo file is placed in the project — this is a one-line addition to `attachments` and the HTML template, not a structural change.

- [ ] **Step 2: Create the API route**

Create `src/app/api/contact/route.js`:

```js
import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailer";

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  let formData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim();
  const attachment = formData.get("attachment");

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (attachment instanceof File && attachment.size > MAX_ATTACHMENT_BYTES) {
    return NextResponse.json(
      { error: "Attachment must be smaller than 5MB." },
      { status: 400 }
    );
  }

  try {
    await sendContactEmail({
      name,
      email,
      phone,
      message,
      attachment: attachment instanceof File ? attachment : null,
    });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again or call us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Verify validation without real SMTP credentials**

Run: `npm run dev`, open `http://localhost:3000/contact`, submit the form with an invalid email (e.g. "notanemail").
Expected: client-side `type="email"` validation blocks submission first; bypass it via browser devtools or curl to confirm server-side validation also rejects it:

```bash
curl -X POST http://localhost:3000/api/contact -F "name=Test" -F "email=notanemail" -F "message=Test message"
```
Expected: `{"error":"Please enter a valid email address."}` with a 400 status.

Then submit a valid form (name, valid email, message) through the browser.
Expected: since `.env.local` has no real SMTP credentials yet, this returns a 500 with "We couldn't send your message..." — this is correct behavior given no credentials exist; it confirms the route reaches the mailer and fails gracefully rather than crashing. Stop server.

- [ ] **Step 4: Stop for review**

Do not commit. Leave `src/lib/mailer.js` and `src/app/api/contact/route.js` as uncommitted, untracked files. Remind the user that real SMTP credentials need to go in `.env.local` (gitignored) before the form can actually send email — `.env.local` is never committed regardless.

---

## Task 26: Global SEO — Sitemap, Robots, Verify Schema

**Files:**
- Create: `src/app/sitemap.js`
- Create: `src/app/robots.js`

Implements the remaining piece of spec section 10 using the Next.js 16 file conventions confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` and `robots.md`.

- [ ] **Step 1: Create the sitemap**

Create `src/app/sitemap.js`:

```js
import { services } from "@/lib/services-data";
import { projects } from "@/lib/projects-data";
import { siteConfig } from "@/lib/site-config";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/services",
    "/projects",
    "/about",
    "/faq",
    "/contact",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
```

- [ ] **Step 2: Create robots.js**

Create `src/app/robots.js`:

```js
import { siteConfig } from "@/lib/site-config";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Add LocalBusiness schema to the root layout**

Read `src/app/layout.js`, then add the schema import and script tag inside `<body>`, before `<Nav />`:

```jsx
import { Geist } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/navigation/WhatsAppButton";
import { getLocalBusinessSchema } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    template: "%s | Northgate Renovations",
    default: "Northgate Renovations — Calgary Home Renovation Contractor",
  },
  description:
    "Northgate Renovations is a Calgary-area renovation contractor specializing in kitchens, basements, bathrooms, and full home renovations.",
};

export default function RootLayout({ children }) {
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify sitemap, robots, and schema**

Run: `npm run dev`, then check:
- `http://localhost:3000/sitemap.xml` — should list homepage, `/services`, `/projects`, `/about`, `/faq`, `/contact`, all 14 `/services/[slug]` URLs, and all 6 `/projects/[slug]` URLs
- `http://localhost:3000/robots.txt` — should show `Allow: /`, `Disallow: /api/`, and a `Sitemap:` line pointing at `/sitemap.xml`
- View source on `http://localhost:3000/` and confirm a `HomeAndConstructionBusiness` JSON-LD script appears in `<body>`

Stop server.

- [ ] **Step 5: Stop for review**

Do not commit. Leave `src/app/sitemap.js`, `src/app/robots.js`, and the updated `src/app/layout.js` as uncommitted changes.

---

## Task 27: Final Pass — Responsiveness, Reduced-Motion, Accessibility Audit

**Files:** No new files — this task verifies the completed site against spec section 9.

- [ ] **Step 1: Responsive breakpoint check**

Run: `npm run dev`. Using browser devtools' device toolbar, check every page (`/`, `/services`, `/services/kitchen-remodeling`, `/projects`, `/projects/hillhurst-kitchen-remodel`, `/about`, `/faq`, `/contact`) at these widths: 1440px, 1280px, 768px, 390px, 360px.
Expected: no horizontal scrollbar at any width on any page; the hero collage stacks/resizes sensibly on mobile; the process-steps connecting line is hidden below the `sm` breakpoint (per Task 14); nav collapses to the hamburger menu below `md`.

- [ ] **Step 2: Reduced-motion check**

In Chrome devtools, open the Rendering tab (Cmd/Ctrl+Shift+P → "Show Rendering"), set "Emulate CSS media feature prefers-reduced-motion" to "reduce". Reload each page.
Expected: hero parallax layers no longer move on scroll (Task 9's `prefersReducedMotion` branch), stagger-text headlines render instantly instead of animating word-by-word (Task 6), Reveal-wrapped content appears without a slide/fade transition, and the global `globals.css` media query (Task 2, Step 1) suppresses any remaining CSS transitions.

- [ ] **Step 3: Keyboard navigation check**

On the homepage, press Tab repeatedly from the top of the page.
Expected: focus moves through nav links → mobile menu button (at narrow widths) → hero content → every interactive element in scroll order, with a visible focus ring (the `focus-visible:outline-accent` classes applied throughout) on each. On `/projects`, confirm the category filter buttons are reachable and toggleable via Tab + Enter/Space. On a project detail page, confirm the before/after slider's divider is reachable via Tab and its position changes with arrow keys (Task 20).

- [ ] **Step 4: Heading hierarchy check**

For each page, confirm exactly one `<h1>` exists and heading levels don't skip (h1 → h2 → h3, never h1 → h3). Use browser devtools' Accessibility Tree or view page source.

- [ ] **Step 5: Image alt text check**

Grep for every `<Image` usage and confirm none has an empty or filler `alt=""` (except genuinely decorative images, none of which exist in this build — every image used is either a hero, a project photo, or a service photo with descriptive alt text already written into Tasks 9–22).

Run: `grep -rn "alt=" src/components src/app --include="*.js"`
Expected: every match has a descriptive string, not `alt=""` or `alt="image"`.

- [ ] **Step 6: Record findings and stop for review**

If any check in Steps 1–5 fails, fix it directly in the relevant file from the task that created it (do not create new abstractions — these are small CSS/markup fixes). Do not commit any fixes. Update the Progress Tracker at the top of this document: check off Task 27 and confirm all prior tasks are checked.

Report to the user which checks passed, which needed fixes, and that the full site is now built and awaiting their review and commit.

---

## Notes for Future Work (Not Part of This Plan)

- Real SMTP credentials must be added to `.env.local` (gitignored) before the contact form can send actual email — see Task 25.
- Real brand name, logo, copy, and photography should replace the placeholder values in `src/lib/site-config.js`, `services-data.js`, `projects-data.js`, and `testimonials-data.js` — this is the single-file-per-concern swap the spec was designed around.
- `metadataBase` in `src/app/layout.js` uses `https://example.com` as a placeholder — update it to the real domain once one exists, and re-generate `sitemap.js`/`robots.js` output will follow automatically since they read from `siteConfig.url`.
- Once a real logo file exists, add CID-embedded inline logo to the contact email template per the note in Task 25, Step 1.
