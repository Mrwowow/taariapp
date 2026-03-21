import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  light?: boolean;
}

export default function SectionHeader({ title, viewAllHref, light }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h2 className={`font-serif text-sm uppercase tracking-[0.15em] ${light ? "text-cream" : "text-dark"}`}>
          {title}
        </h2>
        <div className={`mt-2 w-12 h-[1px] ${light ? "bg-cream/30" : "bg-dark/20"}`} />
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={`text-xs font-medium uppercase tracking-[0.1em] ${light ? "text-cream/60 hover:text-cream" : "text-muted hover:text-dark"} transition-colors`}
        >
          View All &rarr;
        </Link>
      )}
    </div>
  );
}
