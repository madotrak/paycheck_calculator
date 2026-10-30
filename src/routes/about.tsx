import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/site-chrome";
import { PUBLISHER, PUBLISHER_PLACE } from "@/lib/site/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Takehome" },
      {
        name: "description",
        content: "What the Takehome paycheck calculator estimates, and who publishes it.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoPage
      eyebrow="About"
      title="About Paycheck"
      lede="Paycheck is an independent paycheck estimation tool designed to help users estimate take-home pay, taxes, overtime earnings, and payroll deductions."
    >
      <p>
        The calculations provided by this app are estimates only and should not be considered financial, tax, legal, or payroll advice.
      </p>
      <p>
        Results may differ from actual paycheck amounts depending on employer payroll systems, tax elections, credits, deductions, exemptions,
        and individual circumstances.
      </p>
      <p>
        Always consult official government resources, a tax professional, or your payroll department before making financial decisions. Those
        sources are listed on the{" "}
        <Link to="/sources" className="font-medium underline decoration-line underline-offset-2">
          Government Sources
        </Link>{" "}
        page.
      </p>
      <h2 className="font-display text-xl font-semibold tracking-tight">What you can enter</h2>
      <p>
        You enter a wage, the hours on one paycheck, and any overtime. Filing status, state, a 401(k) percent, health premiums, extra
        withholding, and a local wage tax can all be included. The result estimates that check, and a year made of checks like it, from
        publicly available tax information. It is not an official government calculation.
      </p>
      <img src="/brand-lockup.png" alt="Paycheck by Mado Apps" className="w-full max-w-xs rounded-3xl" />
      <h2 className="font-display text-xl font-semibold tracking-tight">Who publishes it</h2>
      <p>
        Paycheck is published by {PUBLISHER} in {PUBLISHER_PLACE}. It is not affiliated with any government agency. Questions go through the{" "}
        <Link to="/contact" className="font-medium underline decoration-line underline-offset-2">
          contact page
        </Link>
        . How the site handles information is in the{" "}
        <Link to="/privacy" className="font-medium underline decoration-line underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </InfoPage>
  );
}
