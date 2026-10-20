import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site-chrome";
import { faqs } from "@/lib/site/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ · Takehome" },
      { name: "description", content: "Common questions about the Takehome paycheck estimate." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <InfoPage eyebrow="FAQ" title="Questions about the estimate" lede="Short answers. The blog goes further on overtime, FICA, and local tax.">
      <div className="flex flex-col gap-3">
        {faqs.map((item) => (
          <details key={item.question} className="rounded-3xl border border-line bg-card px-4 py-3" open>
            <summary className="cursor-pointer py-1 font-medium">{item.question}</summary>
            <p className="pt-2 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </InfoPage>
  );
}
