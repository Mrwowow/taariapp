import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/data";

export default function Hero() {
  const featured = articles[0];

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      <Image
        src={featured.featuredImage}
        alt={featured.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />

      {/* Content — bottom-left overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1280px] mx-auto">
        {/* City badge */}
        <span className="inline-block bg-accent text-white text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 mb-4">
          {featured.city.name}
        </span>
        <div className="w-12 h-[2px] bg-cream/40 mb-4" />

        <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream leading-tight mb-4 max-w-3xl">
          {featured.title}
        </h1>
        <p className="text-cream/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
          {featured.excerpt}
        </p>
        <Link
          href={`/stories/${featured.slug}`}
          className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-cream border border-cream px-8 py-4 hover:bg-cream hover:text-dark transition-colors"
        >
          Read Story &rarr;
        </Link>
      </div>
    </section>
  );
}
