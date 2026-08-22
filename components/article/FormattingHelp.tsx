const RULES: [string, string][] = [
  ["## Heading", "Section heading"],
  ["### Subheading", "Smaller heading"],
  ["**bold**", "Bold text"],
  ["*italic*", "Italic text"],
  ["> quoted line", "Pull quote"],
  ["- item", "Bulleted list"],
  ["1. item", "Numbered list"],
  ["[text](https://…)", "Link"],
  ["---", "Divider"],
];

/** Cheat sheet shown under the article body editor. */
export default function FormattingHelp() {
  return (
    <details className="mt-2 text-xs text-muted">
      <summary className="cursor-pointer select-none hover:text-dark transition-colors">
        Formatting reference
      </summary>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        {RULES.map(([syntax, label]) => (
          <div key={syntax} className="contents">
            <dt className="font-mono text-[11px] text-dark whitespace-nowrap">{syntax}</dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2">
        One paragraph per line. Blank lines are ignored — don&apos;t use a heading for the
        title or excerpt, those already appear above the body.
      </p>
    </details>
  );
}
