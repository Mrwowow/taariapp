import { sponsors } from "@/lib/data";

export default function SponsorHighlight() {
  const sponsor = sponsors[0];

  return (
    <section className="py-10 px-6 border-t border-b border-border">
      <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted shrink-0">
          Presented by
        </span>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-border/50 flex items-center justify-center text-xs text-muted font-medium">
            LOGO
          </div>
          <span className="text-sm text-muted">
            {sponsor.name} &mdash; &ldquo;{sponsor.tagline}&rdquo;
          </span>
        </div>
        <a
          href={sponsor.url}
          className="text-xs font-medium uppercase tracking-[0.1em] text-muted hover:text-dark transition-colors md:ml-auto"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}
