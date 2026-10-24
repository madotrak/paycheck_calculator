import type { Block } from "./content.ts";

export type TextPart =
  | { kind: "text"; value: string }
  | { kind: "link"; label: string; href: string; affiliate: boolean };

const LINK = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)(\{aff\})?/g;

export function richParts(input: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of input.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: "text", value: input.slice(last, index) });
    parts.push({
      kind: "link",
      label: match[1] ?? "",
      href: match[2] ?? "",
      affiliate: match[3] === "{aff}",
    });
    last = index + match[0].length;
  }
  if (last < input.length) parts.push({ kind: "text", value: input.slice(last) });
  if (parts.length === 0) parts.push({ kind: "text", value: input });
  return parts;
}

export function blockHasAffiliate(block: Block): boolean {
  if (block.type === "link") return block.affiliate === true;
  if (block.type === "p") return richParts(block.text).some((part) => part.kind === "link" && part.affiliate);
  if (block.type === "ul") {
    return block.items.some((item) => richParts(item).some((part) => part.kind === "link" && part.affiliate));
  }
  return false;
}

export const AFFILIATE_DISCLOSURE =
  "This article contains affiliate links. If you buy or sign up through one, the publisher may earn a commission. The estimate above does not change.";
