import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Blocks, InfoPage } from "@/components/site-chrome";
import { getPost } from "@/lib/site/content";
import { AFFILIATE_DISCLOSURE, blockHasAffiliate } from "@/lib/site/rich-text";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Takehome` },
          { name: "description", content: loaderData.description },
        ]
      : [{ title: "Article · Takehome" }],
  }),
  notFoundComponent: PostMissing,
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  return (
    <InfoPage eyebrow={post.date} title={post.title} lede={post.description}>
      {post.blocks.some(blockHasAffiliate) ? <p>{AFFILIATE_DISCLOSURE}</p> : null}
      <Blocks blocks={post.blocks} />
      <p>
        <Link to="/blog" className="font-medium underline decoration-line underline-offset-2">
          All articles
        </Link>
      </p>
    </InfoPage>
  );
}

function PostMissing() {
  return (
    <InfoPage eyebrow="Blog" title="Article not found">
      <p>That article is not on this site.</p>
      <p>
        <Link to="/blog" className="font-medium underline decoration-line underline-offset-2">
          Back to the blog
        </Link>
      </p>
    </InfoPage>
  );
}
