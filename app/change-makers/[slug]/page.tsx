import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import { getChangeMakerBySlug, getChangeMakers } from "@/lib/store";

export const dynamic = "force-dynamic";

function youtubeEmbedUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const shortsMatch = url.pathname.match(/^\/shorts\/([^/]+)/);
      if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
      const embedMatch = url.pathname.match(/^\/embed\/([^/]+)/);
      if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }

    return null;
  } catch {
    return null;
  }
}

export default async function ChangeMakerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const maker = await getChangeMakerBySlug(slug);
  if (!maker) notFound();

  const all = await getChangeMakers();
  const related = all
    .filter((m) => m.id !== maker.id && (m.year === maker.year || m.category === maker.category))
    .slice(0, 3);

  const publishedDate = maker.publishedAt
    ? new Date(maker.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const embedUrl = maker.videoUrl ? youtubeEmbedUrl(maker.videoUrl) : null;

  return (
    <div className="py-12 px-6">
      <div className="mx-auto max-w-[1080px]">
        {/* Breadcrumb */}
        <Link
          href="/change-makers"
          className="text-sm text-muted hover:text-dark transition-colors inline-flex items-center gap-1 mb-8"
        >
          <span>←</span> All Change Makers
        </Link>

        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_1.4fr] gap-10 md:gap-14 items-start mb-14">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            {maker.photo ? (
              <Image
                src={maker.photo}
                alt={maker.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-gray-300">
                {maker.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            {maker.featured && (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3">
                Featured Change Maker
              </p>
            )}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark leading-tight mb-3">
              {maker.name}
            </h1>
            <p className="text-xl text-accent font-medium mb-5">{maker.title}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="city">{maker.city}</Badge>
              <Badge variant="category">{maker.category}</Badge>
              <Badge variant="city">Class of {maker.year}</Badge>
            </div>

            {publishedDate && (
              <p className="text-xs text-muted uppercase tracking-wider mb-6">
                Recognized {publishedDate}
              </p>
            )}

            {maker.bio && (
              <div className="pt-6 border-t border-border">
                <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted mb-4">
                  About
                </h2>
                <div className="space-y-4">
                  {maker.bio.split(/\n\n+/).map((para, i) => (
                    <p key={i} className="text-lg leading-[1.8] text-dark whitespace-pre-wrap">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interview video */}
        {embedUrl && (
          <section className="mt-4 mb-14">
            <h2 className="font-serif text-2xl font-bold text-dark mb-4">
              Interview
            </h2>
            <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={embedUrl}
                title={`${maker.name} — TAARi interview`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        )}
        {maker.videoUrl && !embedUrl && (
          <section className="mt-4 mb-14">
            <a
              href={maker.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:underline text-sm"
            >
              Watch the interview →
            </a>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h3 className="font-serif text-sm uppercase tracking-[0.15em] text-dark mb-8">
              More Change Makers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((m) => (
                <Link key={m.id} href={`/change-makers/${m.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-gray-100">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-300">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-dark group-hover:text-accent transition-colors">
                    {m.name}
                  </h4>
                  <p className="text-sm text-accent font-medium mt-0.5">{m.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
