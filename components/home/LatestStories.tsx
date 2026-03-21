import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import { articles } from "@/lib/data";

export default function LatestStories() {
  const latest = articles.slice(0, 6);

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader title="Latest Stories" viewAllHref="/stories/the-sound-of-the-new-south" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.map((article) => (
            <Link
              key={article.slug}
              href={`/stories/${article.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/2] overflow-hidden mb-4">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <Badge variant="city">{article.city.name}</Badge>
              <h3 className="font-serif text-xl font-bold text-dark mt-2 mb-2 group-hover:text-accent transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-muted">
                By {article.author.name} &middot; {article.readTime} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
