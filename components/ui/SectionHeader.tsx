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
        <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
          {title}
        </p>
        <div className="w-10 h-[2px] bg-accent/50" />
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted hover:text-accent transition-colors"
        >
          View All &rarr;
        </Link>
      )}
    </div>
  );
}
