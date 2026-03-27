import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/store";

export default async function CitiesSection() {
  const articles = await getArticles();
  const cityStories = articles.slice(0, 6);

  return (
    <section className="py-10 px-4 md:px-6">
      <div className="mx-auto max-w-[1320px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark">Cities</h2>
          <Link href="/city/atlanta" className="text-sm font-medium text-gray-500 border border-gray-200 rounded-full px-4 py-2 hover:border-dark hover:text-dark transition-colors">
            See more &nbsp;&raquo;
          </Link>
        </div>

        {/* 3x2 compact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityStories.map((article) => (
            <Link
              key={article.slug}
              href={`/stories/${article.slug}`}
              className="group flex gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow"
            >
              <div className="relative w-[100px] h-[72px] shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
              <div className="flex flex-col justify-between min-w-0 py-0.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] text-gray-400">1 hour ago</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {article.categories[0]}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-dark leading-snug line-clamp-2 group-hover:text-green transition-colors">
                    {article.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-400">{article.author.name}</span>
                  {article.gallery.length > 0 && (
                    <span className="text-[10px] bg-green/10 text-green font-semibold px-1.5 py-0.5 rounded">VIDEO</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
