import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site-chrome";

const SOURCES = [
  { name: "Internal Revenue Service (IRS)", href: "https://www.irs.gov" },
  { name: "IRS Publication 15-T", href: "https://www.irs.gov/forms-pubs/about-publication-15-t" },
  { name: "Social Security Administration (SSA)", href: "https://www.ssa.gov" },
  { name: "Centers for Medicare & Medicaid Services (CMS)", href: "https://www.cms.gov" },
  { name: "U.S. Department of Labor", href: "https://www.dol.gov" },
] as const;

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Government Information Sources · Takehome" },
      {
        name: "description",
        content: "Official government sources used as background for the Paycheck estimate. Paycheck is not a government app.",
      },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  return (
    <InfoPage
      eyebrow="Sources"
      title="Government Information Sources"
      lede="This application uses publicly available government information and tax guidance from the following official sources."
    >
      <p>
        Paycheck is not affiliated with, endorsed by, or operated by any of these agencies. The links below are the original sources. The
        numbers in the calculator are estimates, not official rulings.
      </p>
      <ul className="flex flex-col gap-3">
        {SOURCES.map((source) => (
          <li key={source.href}>
            <a
              className="font-medium underline decoration-line underline-offset-2"
              href={source.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {source.name}
            </a>
            <span className="mt-0.5 block text-sm text-muted">{source.href}</span>
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}
