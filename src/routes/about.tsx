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
      title="A paycheck calculator for hourly work"
      lede="Takehome estimates what is left from an hourly wage after federal tax, Social Security, Medicare, and the state or local taxes you include."
    >
      <p>
        You enter a wage, the hours on one paycheck, and any overtime. The result is an estimate of that check and of a year made of checks
        like it. Filing status, state, a 401(k) percent, health premiums, extra withholding, and a local wage tax can all be included.
      </p>
      <h2 className="font-display text-xl font-semibold tracking-tight">What it is for</h2>
      <p>
        It is for reading an offer, planning a week with overtime, or seeing why a stub is smaller than the hours times the wage. It is
        built around W-2 hourly pay in the United States, using 2026 federal rules and a simplified picture of each state.
      </p>
      <h2 className="font-display text-xl font-semibold tracking-tight">What it is not</h2>
      <p>
        It is not a payroll department and it is not tax advice. It does not file a return, calculate a refund, or apply tax credits. State
        amounts in graduated-tax states are estimates, not official withholding tables. The short version of those limits is on the{" "}
        <Link to="/faq" className="font-medium underline decoration-line underline-offset-2">
          FAQ
        </Link>{" "}
        and in the{" "}
        <Link to="/blog" className="font-medium underline decoration-line underline-offset-2">
          articles
        </Link>
        .
      </p>
      <img src="/brand-lockup.png" alt="Paycheck by Mado Apps" className="w-full max-w-xs rounded-3xl" />
      <h2 className="font-display text-xl font-semibold tracking-tight">Who publishes it</h2>
      <p>
        Takehome is published by {PUBLISHER} in {PUBLISHER_PLACE}. Questions about the calculator, a correction, or advertising on the site
        go through the{" "}
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
