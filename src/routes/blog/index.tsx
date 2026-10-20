import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/site-chrome";
import { posts } from "@/lib/site/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog · Takehome" },
      {
        name: "description",
        content: "Articles on hourly pay, overtime, 2026 federal tax, FICA, and local wage taxes.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <InfoPage
      eyebrow="Blog"
      title="Paycheck notes"
      lede="How an hourly wage becomes a take-home number, and where a simple estimate stops."
    >
      <ul className="flex flex-col gap-3">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-3xl border border-line bg-card p-4">
            <p className="text-sm text-faint">{post.date}</p>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="underline decoration-line underline-offset-2">
                {post.title}
              </Link>
            </h2>
            <p className="mt-1 text-muted">{post.description}</p>
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}
