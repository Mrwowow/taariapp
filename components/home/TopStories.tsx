import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/store";

export default async function TopStories() {
  const articles = await getArticles();
  const topStories = articles.slice(0, 4);

  return (
    <section className="py-10 px-4 md:px-6">
      <div className="mx-auto max-w-[1320px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark">Top Stories</h2>
          <Link href="/stories/the-sound-of-the-new-south" className="text-sm font-medium text-gray-500 border border-gray-200 rounded-full px-4 py-2 hover:border-dark hover:text-dark transition-colors">
            See more &nbsp;&raquo;
          </Link>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topStories.map((article) => (
            <Link
              key={article.slug}
              href={`/stories/${article.slug}`}
              className="group block"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-3">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              {/* Meta */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] text-gray-400">2 hour ago</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {article.categories[0]}
                </span>
              </div>
              {/* Title */}
              <h3 className="text-[15px] font-semibold text-dark leading-snug mb-1.5 group-hover:text-green transition-colors line-clamp-2">
                {article.title}
              </h3>
              {/* Excerpt */}
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-2">
                {article.excerpt}
              </p>
              {/* Source */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">{article.author.name}</span>
                <span className="text-[10px] bg-green/10 text-green font-semibold px-1.5 py-0.5 rounded">VIDEO</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
