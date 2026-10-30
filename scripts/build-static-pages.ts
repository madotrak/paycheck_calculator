import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { CONTACT_EMAIL, POLICY_UPDATED, PUBLISHER, PUBLISHER_PLACE, faqs, posts, type Block } from "../src/lib/site/content.ts";
import { AFFILIATE_DISCLOSURE, blockHasAffiliate, richParts } from "../src/lib/site/rich-text.ts";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}

function richHtml(input: string): string {
  return richParts(input)
    .map((part) => {
      if (part.kind === "text") return escapeHtml(part.value);
      const rel = part.affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer";
      const note = part.affiliate ? " (affiliate)" : "";
      return `<a href="${escapeHtml(part.href)}" rel="${rel}" target="_blank">${escapeHtml(part.label)}</a>${note}`;
    })
    .join("");
}

function blocksHtml(blocks: Block[]): string {
  return blocks
    .map((block) => {
      if (block.type === "h2") return `<h2>${escapeHtml(block.text)}</h2>`;
      if (block.type === "ul") {
        return `<ul>${block.items.map((item) => `<li>${richHtml(item)}</li>`).join("")}</ul>`;
      }
      if (block.type === "link") {
        const rel = block.affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer";
        const note = block.affiliate ? " (affiliate)" : "";
        return `<p><a href="${escapeHtml(block.href)}" rel="${rel}" target="_blank">${escapeHtml(block.text)}</a>${note}</p>`;
      }
      if (block.type === "img") {
        return `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" class="lockup" />`;
      }
      return `<p>${richHtml(block.text)}</p>`;
    })
    .join("\n");
}

function page(options: {
  title: string;
  description: string;
  current: string;
  depth: "" | "../";
  body: string;
}): string {
  const { depth } = options;
  const nav = [
    ["Calculator", `${depth}index.html`],
    ["About", `${depth}about.html`],
    ["Government Sources", `${depth}sources.html`],
    ["Blog", `${depth}blog/index.html`],
    ["FAQ", `${depth}faq.html`],
    ["Contact", `${depth}contact.html`],
  ]
    .map(([label, href]) => {
      const current = label === options.current ? ' aria-current="page"' : "";
      return `<a href="${href}"${current}>${label}</a>`;
    })
    .join("\n          ");
  const footer = ["About", "Government Sources", "Privacy", "FAQ", "Contact", "Blog"]
    .map((label) => {
      const href =
        label === "Blog"
          ? `${depth}blog/index.html`
          : label === "Privacy"
            ? `${depth}privacy.html`
            : label === "Government Sources"
              ? `${depth}sources.html`
              : `${depth}${label.toLowerCase()}.html`;
      return `<a href="${href}">${label}</a>`;
    })
    .join("\n            ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(options.title)}</title>
    <meta name="description" content="${escapeHtml(options.description)}" />
    <meta name="theme-color" content="#f2f1ee" />
    <link rel="icon" href="${depth}favicon.png" type="image/png" />
    <link rel="apple-touch-icon" href="${depth}apple-touch-icon.png" />
    <link rel="stylesheet" href="${depth}styles.css" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9069566302664336" crossorigin="anonymous"></script>
  </head>
  <body>
    <main>
      <aside class="ad" aria-label="Advertisement">
        <div class="ad-inner">
          <p class="ad-label">Advertisement</p>
          <div class="ad-slot">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9069566302664336" data-ad-slot="6638467983" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </div>
        </div>
      </aside>
      <div class="wrap">
        <a class="brand" href="${depth}index.html"><img src="${depth}logo.png" alt="Takehome" /></a>
        <nav class="site-nav" aria-label="Site">
          ${nav}
        </nav>
        ${options.body}
        <footer class="site-footer">
          <nav aria-label="Footer">
            ${footer}
          </nav>
          <p>Not affiliated with any government agency. Estimates only.</p>
          <p>Estimates for a W-2 paycheck. Not tax or payroll advice.</p>
        </footer>
      </div>
    </main>
  </body>
</html>
`;
}

function write(root: string, relativePath: string, html: string) {
  const target = join(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
}

const about = page({
  title: "About · Takehome",
  description: "What the Takehome paycheck calculator estimates, and who publishes it.",
  current: "About",
  depth: "",
  body: `<header class="page">
          <p class="eyebrow">About</p>
          <h1>About Paycheck</h1>
          <p class="lede">Paycheck is an independent paycheck estimation tool designed to help users estimate take-home pay, taxes, overtime earnings, and payroll deductions.</p>
        </header>
        <article class="article">
          <p>The calculations provided by this app are estimates only and should not be considered financial, tax, legal, or payroll advice.</p>
          <p>Results may differ from actual paycheck amounts depending on employer payroll systems, tax elections, credits, deductions, exemptions, and individual circumstances.</p>
          <p>Always consult official government resources, a tax professional, or your payroll department before making financial decisions. Those sources are listed on the <a href="./sources.html">Government Sources</a> page.</p>
          <h2>What you can enter</h2>
          <p>You enter a wage, the hours on one paycheck, and any overtime. Filing status, state, a 401(k) percent, health premiums, extra withholding, and a local wage tax can all be included. The result estimates that check, and a year made of checks like it, from publicly available tax information. It is not an official government calculation.</p>
          <img src="./brand-lockup.png" alt="Paycheck by Mado Apps" class="lockup" />
          <h2>Who publishes it</h2>
          <p>Paycheck is published by ${escapeHtml(PUBLISHER)} in ${escapeHtml(PUBLISHER_PLACE)}. It is not affiliated with any government agency. Questions go through the <a href="./contact.html">contact page</a>. How the site handles information is in the <a href="./privacy.html">privacy policy</a>.</p>
        </article>`,
});

const sources = page({
  title: "Government Information Sources · Takehome",
  description: "Official government sources used as background for the Paycheck estimate. Paycheck is not a government app.",
  current: "Government Sources",
  depth: "",
  body: `<header class="page">
          <p class="eyebrow">Sources</p>
          <h1>Government Information Sources</h1>
          <p class="lede">This application uses publicly available government information and tax guidance from the following official sources.</p>
        </header>
        <article class="article">
          <p>Paycheck is not affiliated with, endorsed by, or operated by any of these agencies. The links below are the original sources. The numbers in the calculator are estimates, not official rulings.</p>
          <ul>
            <li><a href="https://www.irs.gov" rel="noopener noreferrer" target="_blank">Internal Revenue Service (IRS)</a><br />https://www.irs.gov</li>
            <li><a href="https://www.irs.gov/forms-pubs/about-publication-15-t" rel="noopener noreferrer" target="_blank">IRS Publication 15-T</a><br />https://www.irs.gov/forms-pubs/about-publication-15-t</li>
            <li><a href="https://www.ssa.gov" rel="noopener noreferrer" target="_blank">Social Security Administration (SSA)</a><br />https://www.ssa.gov</li>
            <li><a href="https://www.cms.gov" rel="noopener noreferrer" target="_blank">Centers for Medicare & Medicaid Services (CMS)</a><br />https://www.cms.gov</li>
            <li><a href="https://www.dol.gov" rel="noopener noreferrer" target="_blank">U.S. Department of Labor</a><br />https://www.dol.gov</li>
          </ul>
        </article>`,
});

const privacy = page({
  title: "Privacy policy · Takehome",
  description: "How Takehome handles calculator entries, browser storage, and advertising.",
  current: "Privacy",
  depth: "",
  body: `<header class="page">
          <p class="eyebrow">Privacy</p>
          <h1>Privacy policy</h1>
          <p class="lede">Updated ${escapeHtml(POLICY_UPDATED)}.</p>
        </header>
        <article class="article">
          <p>This policy covers the Takehome paycheck calculator published by ${escapeHtml(PUBLISHER)}. The calculator estimates take-home pay. It does not ask you to create an account.</p>
          <h2>What you type</h2>
          <p>Wage, hours, filing status, state, and any deductions you enter are used in your browser to calculate the estimate. Those entries are saved in local storage on that browser so the form can reopen with the same numbers. They are not sent to a Takehome account, because there is no account. Clearing the site data, or using a private window that discards storage when it closes, removes them.</p>
          <h2>What we do not collect</h2>
          <p>The calculator does not ask for your name, Social Security number, bank account, employer, or address. Do not type those into the wage or notes fields. There is no sale of personal information.</p>
          <h2>Advertising</h2>
          <p>Pages include a Google AdSense unit. Google and its partners may use cookies to serve and measure ads, including ads based on your visits to this and other sites.</p>
          <p>The Paycheck Android app shows ads with Google AdMob instead of AdSense. Google may use the device advertising ID to serve and measure those ads. Wage numbers typed into the app stay on the device.</p>
          <p>You can read how Google uses data from sites that use its services at <a href="https://policies.google.com/technologies/ads">Google’s advertising policy</a>. Ad personalization can be changed at <a href="https://adssettings.google.com">Google ad settings</a>. You can also block third-party cookies in your browser.</p>
          <h2>Children</h2>
          <p>The calculator is written for adults looking at wages. It is not directed at children under 13, and it does not knowingly collect their information.</p>
          <h2>Changes and contact</h2>
          <p>If this policy changes, the date at the top of the page will change with it. Questions about privacy can be sent to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
        </article>`,
});

const contact = page({
  title: "Contact · Takehome",
  description: "How to reach the publisher of the Takehome paycheck calculator.",
  current: "Contact",
  depth: "",
  body: `<header class="page">
          <p class="eyebrow">Contact</p>
          <h1>Reach the publisher</h1>
          <p class="lede">${escapeHtml(PUBLISHER)} publishes Takehome from ${escapeHtml(PUBLISHER_PLACE)}. Use this page for a correction, a missing tax, or a question about the estimate.</p>
        </header>
        <article class="article">
          <p>Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. The form opens that address with your note filled in. Nothing is stored on a server.</p>
          <form class="contact-form" id="contact-form">
            <label>Name <input id="contact-name" name="name" autocomplete="name" /></label>
            <label>Email <input id="contact-email" name="email" type="email" autocomplete="email" /></label>
            <label>Message <textarea id="contact-message" name="message" rows="5" required></textarea></label>
            <button type="submit">Email ${CONTACT_EMAIL}</button>
            <p id="contact-ready" hidden></p>
          </form>
        </article>
        <script>
          document.getElementById("contact-form").addEventListener("submit", function (event) {
            event.preventDefault();
            var name = document.getElementById("contact-name").value.trim();
            var email = document.getElementById("contact-email").value.trim();
            var message = document.getElementById("contact-message").value.trim();
            if (!message) return;
            var lines = [];
            if (name) lines.push("Name: " + name);
            if (email) lines.push("Email: " + email);
            lines.push("");
            lines.push(message);
            var href = "mailto:${CONTACT_EMAIL}?subject=" + encodeURIComponent("Takehome calculator") + "&body=" + encodeURIComponent(lines.join("\\n"));
            var ready = document.getElementById("contact-ready");
            ready.hidden = false;
            ready.textContent = "Your mail app should open with this note addressed to ${CONTACT_EMAIL}.";
            window.location.href = href;
          });
        </script>`,
});

const faq = page({
  title: "FAQ · Takehome",
  description: "Common questions about the Takehome paycheck estimate.",
  current: "FAQ",
  depth: "",
  body: `<header class="page">
          <p class="eyebrow">FAQ</p>
          <h1>Questions about the estimate</h1>
          <p class="lede">Short answers. The blog goes further on overtime, FICA, and local tax.</p>
        </header>
        <div class="faq-list">
          ${faqs
            .map(
              (item) => `<details open>
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>`,
            )
            .join("\n")}
        </div>`,
});

const blogIndex = page({
  title: "Blog · Takehome",
  description: "Articles on hourly pay, overtime, 2026 federal tax, FICA, and local wage taxes.",
  current: "Blog",
  depth: "../",
  body: `<header class="page">
          <p class="eyebrow">Blog</p>
          <h1>Paycheck notes</h1>
          <p class="lede">How an hourly wage becomes a take-home number, and where a simple estimate stops.</p>
        </header>
        <ul class="post-list">
          ${posts
            .map(
              (post) => `<li class="post">
            <p>${escapeHtml(post.date)}</p>
            <h2><a href="./${post.slug}.html">${escapeHtml(post.title)}</a></h2>
            <p>${escapeHtml(post.description)}</p>
          </li>`,
            )
            .join("\n")}
        </ul>`,
});

function postPage(slug: string): string {
  const post = posts.find((item) => item.slug === slug);
  if (!post) throw new Error(slug);
  return page({
    title: `${post.title} · Takehome`,
    description: post.description,
    current: "Blog",
    depth: "../",
    body: `<header class="page">
          <p class="eyebrow">${escapeHtml(post.date)}</p>
          <h1>${escapeHtml(post.title)}</h1>
          <p class="lede">${escapeHtml(post.description)}</p>
        </header>
        <article class="article">
          ${post.blocks.some(blockHasAffiliate) ? `<p>${escapeHtml(AFFILIATE_DISCLOSURE)}</p>` : ""}
          ${blocksHtml(post.blocks)}
          <p><a href="./index.html">All articles</a></p>
        </article>`,
  });
}

for (const root of ["docs", "export"]) {
  write(root, "about.html", about);
  write(root, "sources.html", sources);
  write(root, "privacy.html", privacy);
  write(root, "contact.html", contact);
  write(root, "faq.html", faq);
  write(root, "blog/index.html", blogIndex);
  for (const post of posts) write(root, `blog/${post.slug}.html`, postPage(post.slug));
}
