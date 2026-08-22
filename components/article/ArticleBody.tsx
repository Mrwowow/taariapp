import React from "react";

/**
 * Renders an article body stored as one paragraph per line.
 * Supports a markdown-lite subset that editors actually paste:
 *   # / ## / ###        headings
 *   > quote             blockquote
 *   - or * or 1.        lists (consecutive lines group into one list)
 *   ---                 divider
 *   **bold**  *italic*  `code`  [text](url)
 *   "Pull quote"        a line wrapped in quote marks
 */

type Props = { body: string[] };

/** Inline markdown: bold, italic, code, links. Order matters — links first. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Single pass over the union of inline patterns so nesting can't double-wrap.
  // `*` emphasis must not wrap whitespace (so "2 * 3 * 4" stays arithmetic) and
  // `_` emphasis must not sit inside a word (so "snake_case_word" stays intact).
  const pattern =
    /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+?)\*\*|(?<![A-Za-z0-9])__([^_]+?)__(?![A-Za-z0-9])|\*(?!\s)([^*\n]*[^*\s])\*|(?<![A-Za-z0-9])_(?!\s)([^_\n]*[^_\s])_(?![A-Za-z0-9])|`([^`]+)`/g;

  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-i${i++}`;

    if (match[1] !== undefined) {
      const href = match[2];
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-accent underline underline-offset-2 decoration-accent/40 hover:decoration-accent transition-colors"
        >
          {match[1]}
        </a>
      );
    } else if (match[3] !== undefined || match[4] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-dark">
          {match[3] ?? match[4]}
        </strong>
      );
    } else if (match[5] !== undefined || match[6] !== undefined) {
      nodes.push(<em key={key}>{match[5] ?? match[6]}</em>);
    } else if (match[7] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="font-mono text-[0.9em] bg-cream border border-cream-dark rounded px-1.5 py-0.5"
        >
          {match[7]}
        </code>
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { kind: "heading"; level: 2 | 3 | 4; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "pullquote"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "divider" };

/** Group the flat line array into renderable blocks. */
function parseBlocks(body: string[]): Block[] {
  const blocks: Block[] = [];

  for (const raw of body) {
    // Editors paste &nbsp; from word processors; treat it as whitespace.
    const line = raw.replace(/&nbsp;/gi, " ").trim();
    if (!line) continue;

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ kind: "divider" });
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      // h1 is the article title, so body headings start at h2.
      const level = Math.min(Math.max(heading[1].length, 2), 4) as 2 | 3 | 4;
      blocks.push({ kind: "heading", level, text: heading[2].trim() });
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      blocks.push({ kind: "quote", text: quote[1].trim() });
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      const item = (bullet ? bullet[1] : numbered![1]).trim();
      const prev = blocks[blocks.length - 1];
      if (prev && prev.kind === "list" && prev.ordered === ordered) {
        prev.items.push(item);
      } else {
        blocks.push({ kind: "list", ordered, items: [item] });
      }
      continue;
    }

    // A line fully wrapped in quote marks reads as a pull quote.
    if (/^["“].*["”]$/.test(line) && line.length > 1) {
      blocks.push({ kind: "pullquote", text: line });
      continue;
    }

    blocks.push({ kind: "paragraph", text: line });
  }

  return blocks;
}

export default function ArticleBody({ body }: Props) {
  const blocks = parseBlocks(body);

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const key = `b${i}`;

        switch (block.kind) {
          case "divider":
            return <hr key={key} className="my-10 border-0 border-t border-cream-dark" />;

          case "heading": {
            const Tag = (`h${block.level}` as const);
            const size =
              block.level === 2
                ? "text-2xl md:text-3xl mt-10"
                : block.level === 3
                ? "text-xl md:text-2xl mt-8"
                : "text-lg md:text-xl mt-6";
            return (
              <Tag
                key={key}
                className={`font-serif font-bold text-dark leading-snug ${size}`}
              >
                {renderInline(block.text, key)}
              </Tag>
            );
          }

          case "quote":
          case "pullquote":
            return (
              <blockquote
                key={key}
                className="border-l-[3px] border-accent pl-5 md:pl-8 py-4 my-8 md:my-10"
              >
                <p className="font-serif text-xl md:text-[28px] italic text-accent leading-relaxed">
                  {renderInline(block.text, key)}
                </p>
              </blockquote>
            );

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={key}
                className={`pl-6 space-y-2 text-lg leading-[1.8] text-dark ${
                  block.ordered ? "list-decimal" : "list-disc"
                } marker:text-accent`}
              >
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>
                ))}
              </Tag>
            );
          }

          default:
            return (
              <p key={key} className="text-lg leading-[1.8] text-dark">
                {renderInline(block.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}
