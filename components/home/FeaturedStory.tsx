import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import { articles } from "@/lib/data";

export default function FeaturedStory() {
  const featured = articles[1]; // Second article as featured

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader title="Featured" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Link href={`/stories/${featured.slug}`} className="group block overflow-hidden">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={featured.featuredImage}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Link>
          <div>
            <Badge variant="city">{featured.city.name}</Badge>
            {featured.isSponsored && (
              <Badge variant="sponsored">Sponsored</Badge>
            )}
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark mt-4 mb-4 leading-tight">
              <Link href={`/stories/${featured.slug}`} className="hover:text-accent transition-colors">
                {featured.title}
              </Link>
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              {featured.excerpt}
            </p>
            <p className="text-sm text-muted">
              By {featured.author.name} &middot; {featured.readTime} min read
            </p>
            <Link
              href={`/stories/${featured.slug}`}
              className="inline-block mt-6 text-xs font-medium uppercase tracking-[0.1em] text-dark border border-dark px-6 py-3 hover:bg-dark hover:text-cream transition-colors"
            >
              Read More &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
