import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AdsenseBanner } from "@/components/adsense-banner";

const LINKS = [
  { to: "/", label: "Calculator" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  return (
    <nav aria-label="Site" className="-mx-1 flex flex-wrap">
      {LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          activeOptions={{ exact: link.to === "/" }}
          className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium text-muted"
          activeProps={{
            className: "inline-flex h-11 items-center rounded-lg bg-inset px-3 text-sm font-medium text-ink",
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-line pt-4 text-sm text-muted">
      <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1">
        <Link to="/about" className="underline decoration-line underline-offset-2">
          About
        </Link>
        <Link to="/privacy" className="underline decoration-line underline-offset-2">
          Privacy
        </Link>
        <Link to="/faq" className="underline decoration-line underline-offset-2">
          FAQ
        </Link>
        <Link to="/contact" className="underline decoration-line underline-offset-2">
          Contact
        </Link>
        <Link to="/blog" className="underline decoration-line underline-offset-2">
          Blog
        </Link>
      </nav>
      <p className="text-faint">Estimates for a W-2 paycheck. Not tax or payroll advice.</p>
    </footer>
  );
}

export function InfoPage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <AdsenseBanner />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <SiteNav />
        <header>
          <p className="text-sm font-medium text-muted">{eyebrow}</p>
          <h1 className="font-display text-title font-semibold tracking-tight">{title}</h1>
          {lede ? <p className="mt-3 max-w-prose text-muted">{lede}</p> : null}
        </header>
        <article className="flex max-w-prose flex-col gap-4">{children}</article>
        <SiteFooter />
      </div>
    </main>
  );
}

export function Blocks({ blocks }: { blocks: { type: string; text?: string; items?: string[] }[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={index} className="font-display text-xl font-semibold tracking-tight">
              {block.text}
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc pl-5">
              {(block.items ?? []).map((item) => (
                <li key={item} className="mt-1">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </>
  );
}
