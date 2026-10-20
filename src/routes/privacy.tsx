import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site-chrome";
import { CONTACT_URL, POLICY_UPDATED, PUBLISHER } from "@/lib/site/content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy · Takehome" },
      {
        name: "description",
        content: "How Takehome handles calculator entries, browser storage, and advertising.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage eyebrow="Privacy" title="Privacy policy" lede={`Updated ${POLICY_UPDATED}.`}>
      <p>
        This policy covers the Takehome paycheck calculator published by {PUBLISHER}. The calculator estimates take-home pay. It does not
        ask you to create an account.
      </p>
      <h2 className="font-display text-xl font-semibold tracking-tight">What you type</h2>
      <p>
        Wage, hours, filing status, state, and any deductions you enter are used in your browser to calculate the estimate. Those entries
        are saved in local storage on that browser so the form can reopen with the same numbers. They are not sent to a Takehome account,
        because there is no account. Clearing the site data, or using a private window that discards storage when it closes, removes them.
      </p>
      <h2 className="font-display text-xl font-semibold tracking-tight">What we do not collect</h2>
      <p>
        The calculator does not ask for your name, Social Security number, bank account, employer, or address. Do not type those into the
        wage or notes fields. There is no sale of personal information.
      </p>
      <h2 className="font-display text-xl font-semibold tracking-tight">Advertising</h2>
      <p>
        Pages may show a banner reserved for Google AdSense. Until a publisher ID and ad unit are connected, that space is an empty
        placeholder and does not load an ad. If ads are turned on, Google and its partners may use cookies to serve and measure ads,
        including ads based on your visits to this and other sites. That activity is governed by Google’s policies, not by this
        calculator’s math.
      </p>
      <p>
        You can read how Google uses data from sites that use its services at{" "}
        <a
          className="font-medium underline decoration-line underline-offset-2"
          href="https://policies.google.com/technologies/ads"
          rel="noopener noreferrer"
        >
          Google’s advertising policy
        </a>
        . Ad personalization can be changed at{" "}
        <a
          className="font-medium underline decoration-line underline-offset-2"
          href="https://adssettings.google.com"
          rel="noopener noreferrer"
        >
          Google ad settings
        </a>
        . You can also block third-party cookies in your browser.
      </p>
      <h2 className="font-display text-xl font-semibold tracking-tight">Children</h2>
      <p>The calculator is written for adults looking at wages. It is not directed at children under 13, and it does not knowingly collect their information.</p>
      <h2 className="font-display text-xl font-semibold tracking-tight">Changes and contact</h2>
      <p>
        If this policy changes, the date at the top of the page will change with it. Questions about privacy can be sent through the
        publisher’s GitHub profile at{" "}
        <a className="font-medium underline decoration-line underline-offset-2" href={CONTACT_URL} rel="noopener noreferrer">
          {CONTACT_URL}
        </a>
        .
      </p>
    </InfoPage>
  );
}
