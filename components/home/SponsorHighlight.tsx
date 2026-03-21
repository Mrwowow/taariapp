import { sponsors } from "@/lib/data";

export default function SponsorHighlight() {
  const sponsor = sponsors[0];

  return (
    <section className="py-10 px-6 border-t border-border bg-dark">
      <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted shrink-0">
          Presented by
        </span>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/5 border border-border flex items-center justify-center text-xs text-muted font-medium">
            LOGO
          </div>
          <span className="text-sm text-muted">
            {sponsor.name} &mdash; &ldquo;{sponsor.tagline}&rdquo;
          </span>
        </div>
        <a
          href={sponsor.url}
          className="text-[11px] font-bold uppercase tracking-[0.15em] text-accent hover:text-accent-dark transition-colors md:ml-auto"
        >
          Learn More &rarr;
        </a>
      </div>
    </section>
  );
}
