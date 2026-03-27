import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/store";

export default async function Hero() {
  const articles = await getArticles();
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
      {/* Dark overlay — deeper at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B]/90 via-[#0D0D0B]/40 to-transparent" />

      {/* Content — bottom-left */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1280px] mx-auto">
        {/* City badge */}
        <span className="inline-block bg-accent text-dark text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 mb-5">
          {featured.city.name}
        </span>

        <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream leading-tight mb-5 max-w-3xl">
          {featured.title}
        </h1>
        <p className="text-cream/70 text-lg leading-relaxed mb-8 max-w-xl">
          {featured.excerpt}
        </p>
        <Link
          href={`/stories/${featured.slug}`}
          className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] bg-accent text-dark px-8 py-4 hover:bg-accent-dark transition-colors"
        >
          Read Story &rarr;
        </Link>
      </div>
    </section>
  );
}
