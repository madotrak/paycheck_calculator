import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site-chrome";
import { CONTACT_EMAIL, PUBLISHER, PUBLISHER_PLACE } from "@/lib/site/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Takehome" },
      { name: "description", content: "How to reach the publisher of the Takehome paycheck calculator." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  const subject = encodeURIComponent("Takehome calculator");
  const body = encodeURIComponent([name && `Name: ${name}`, email && `Email: ${email}`, "", message].filter(Boolean).join("\n"));
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <InfoPage
      eyebrow="Contact"
      title="Reach the publisher"
      lede={`${PUBLISHER} publishes Takehome from ${PUBLISHER_PLACE}. Use this page for a correction, a missing tax, or a question about the estimate.`}
    >
      <p>
        Email{" "}
        <a className="font-medium underline decoration-line underline-offset-2" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        . The form opens that address with your note filled in. Nothing is stored on a server.
      </p>
      <form
        className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (message.trim() === "") return;
          setReady(true);
          window.location.href = mailto;
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium text-muted" htmlFor="contact-name">
          Name
          <input
            id="contact-name"
            className="h-11 rounded-lg border border-line bg-paper px-3 text-base text-ink"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setReady(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-muted" htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            type="email"
            className="h-11 rounded-lg border border-line bg-paper px-3 text-base text-ink"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setReady(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-muted" htmlFor="contact-message">
          Message
          <textarea
            id="contact-message"
            required
            rows={5}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-base text-ink"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setReady(false);
            }}
          />
        </label>
        <button type="submit" className="h-11 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg">
          Email {CONTACT_EMAIL}
        </button>
        {ready ? <p>Your mail app should open with this note addressed to {CONTACT_EMAIL}.</p> : null}
      </form>
    </InfoPage>
  );
}
