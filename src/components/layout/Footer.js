import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <Logo size="lg" light />
            <p className="mt-4 max-w-xs text-sm text-background/60">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <SectionLabel className="text-background/50">Navigate</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm text-background/80">
              <li><Link href="/services" className="hover:text-accent">Services</Link></li>
              <li><Link href="/projects" className="hover:text-accent">Projects</Link></li>
              <li><Link href="/about" className="hover:text-accent">About</Link></li>
              <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <SectionLabel className="text-background/50">Service Areas</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm text-background/60">
              {siteConfig.serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel className="text-background/50">Contact</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm text-background/80">
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

        <div className="mt-16 border-t border-background/15 pt-8 text-xs text-background/50">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
