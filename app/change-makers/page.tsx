export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getChangeMakers } from "@/lib/store";

export default async function ChangeMakersPage() {
  const makers = await getChangeMakers();

  // Group by year
  const byYear = makers.reduce<Record<number, typeof makers>>((acc, m) => {
    (acc[m.year] ??= []).push(m);
    return acc;
  }, {});
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  // Featured makers first
  const featured = makers.filter((m) => m.featured);

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-3">
            TAARi Change Makers
          </h1>
          <p className="text-lg text-muted">
            The TAARi CM is a distinguished recognition initiative by TAARi that
            honors exceptional individuals across the Greater Pittsburgh region
            who have demonstrated sustained impact, leadership, and service over
            the years.
          </p>
        </div>

        {/* Featured Change Makers */}
        {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-dark mb-6">
              Featured Change Makers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((maker) => (
                <Link
                  key={maker.id}
                  href={`/change-makers/${maker.slug}`}
                  className="group bg-[#FAFAFA] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow block"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto shrink-0">
                      {maker.photo ? (
                        <Image
                          src={maker.photo}
                          alt={maker.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 192px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                          {maker.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <h3 className="font-serif text-xl font-bold text-dark group-hover:text-accent transition-colors">
                        {maker.name}
                      </h3>
                      <p className="text-sm text-accent font-medium mt-1">
                        {maker.title}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="city">{maker.city}</Badge>
                        <Badge variant="city">{maker.category}</Badge>
                      </div>
                      {maker.bio && (
                        <p className="text-sm text-muted mt-3 line-clamp-3">
                          {maker.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Change Makers by Year */}
        {years.map((year) => (
          <div key={year} className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-dark mb-6 border-b border-gray-200 pb-2">
              {year}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {byYear[year].map((maker) => (
                <Link key={maker.id} href={`/change-makers/${maker.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                    {maker.photo ? (
                      <Image
                        src={maker.photo}
                        alt={maker.name}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-95"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-400">
                        {maker.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-dark group-hover:text-accent transition-colors">
                    {maker.name}
                  </h3>
                  <p className="text-sm text-accent font-medium mt-0.5">
                    {maker.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="city">{maker.city}</Badge>
                    <Badge variant="city">{maker.category}</Badge>
                  </div>
                  {maker.bio && (
                    <p className="text-sm text-muted italic mt-2 line-clamp-2">
                      {maker.bio}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {makers.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="text-lg">Change Makers coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
