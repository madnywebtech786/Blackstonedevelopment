"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  const { isScrolled } = useScrollDirection();
  const pathname = usePathname();
  const hasDarkHero =
    pathname === "/" || /^\/services\/[^/]+$/.test(pathname);
  const showLightText = hasDarkHero && !isScrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-sm" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 py-4 transition-colors duration-300 sm:px-6 lg:px-8 ${
          isScrolled
            ? "text-foreground"
            : showLightText
              ? "text-white"
              : "text-foreground"
        }`}
      >
        <Logo />

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

        <MobileNav isScrolled={!showLightText} />
      </div>
    </header>
  );
}
