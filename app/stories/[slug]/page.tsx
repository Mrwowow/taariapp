import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import NewsletterForm from "@/components/ui/NewsletterForm";
import ImageLightbox from "@/components/ui/ImageLightbox";
import ShareButtons from "@/components/ui/ShareButtons";
import { getArticles, getArticleBySlug, getSponsors } from "@/lib/store";
import { buildMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    path: `/stories/${slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    authorName: article.author.name,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [articles, sponsors] = await Promise.all([getArticles(), getSponsors()]);
  const relatedArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);
  const sponsor = sponsors[0];

  return (
    <>
      {/* Hero Featured Image */}
      <section className="relative w-full h-[45vh] min-h-[300px] md:h-[70vh] md:min-h-[500px] overflow-hidden md:rounded-2xl">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </section>

      {/* Article Header */}
      <article className="py-8 md:py-12 px-4 md:px-6">
        <div className="mx-auto max-w-[720px]">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge variant="city">{article.city.name}</Badge>
            {article.categories.map((cat) => (
              <Badge key={cat} variant="category">{cat}</Badge>
            ))}
            {article.isSponsored && <Badge variant="sponsored">Sponsored</Badge>}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-dark leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-6">{article.excerpt}</p>

          {/* Featured Image */}
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl mb-8">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 720px) 100vw, 720px"
            />
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mb-8">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-dark">{article.author.name}</p>
              <p className="text-xs text-muted">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {" "}&middot; {article.readTime} min read
              </p>
            </div>
          </div>

          {/* Share buttons */}
          <div className="py-4 border-t border-b border-border mb-10">
            <ShareButtons
              path={`/stories/${slug}`}
              title={article.title}
              description={article.excerpt}
            />
          </div>

          {/* Article Body */}
          <div className="space-y-6">
            {article.body.map((paragraph, i) => {
              // Skip empty or whitespace-only paragraphs (including &nbsp;)
              const cleaned = paragraph.replace(/&nbsp;/gi, ' ').trim();
              if (!cleaned) return null;

              // Pull quote detection (starts with a quote mark)
              if (cleaned.startsWith('"') || cleaned.startsWith('\u201C')) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-[3px] border-accent pl-5 md:pl-8 py-4 my-8 md:my-10"
                  >
                    <p className="font-serif text-xl md:text-[28px] italic text-accent leading-relaxed">
                      {cleaned}
                    </p>
                  </blockquote>
                );
              }
              return (
                <p key={i} className="text-lg leading-[1.8] text-dark">
                  {cleaned}
                </p>
              );
            })}
          </div>

          {/* Photo Gallery */}
          {article.gallery.length > 0 && (
            <div className="my-12">
              <ImageLightbox images={article.gallery} alt={article.title} />
              <p className="text-sm text-muted italic mt-3 text-center">
                Photo gallery — {article.title}
              </p>
            </div>
          )}

          {/* Sponsor Banner */}
          {article.isSponsored && sponsor && (
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="my-8 md:my-10 p-4 md:p-6 border border-border rounded-xl flex items-center gap-4 hover:border-accent/30 hover:bg-accent/[0.02] transition-colors group block"
            >
              {sponsor.logo ? (
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={48}
                  height={48}
                  className="rounded object-contain shrink-0"
                />
              ) : (
                <div className="w-12 h-12 bg-border/50 rounded flex items-center justify-center text-sm text-muted font-medium shrink-0">
                  {sponsor.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">Presented by</p>
                <p className="text-sm font-medium text-dark group-hover:text-accent transition-colors">
                  {sponsor.name}
                </p>
                {sponsor.tagline && (
                  <p className="text-xs text-muted mt-0.5">{sponsor.tagline}</p>
                )}
              </div>
            </a>
          )}

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted mb-4">
              About the Author
            </h3>
            <div className="flex gap-4">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={64}
                height={64}
                className="rounded-full object-cover shrink-0"
              />
              <div>
                <p className="font-medium text-dark">{article.author.name}</p>
                <p className="text-sm text-muted mt-1">{article.author.bio}</p>
                <div className="flex gap-3 mt-3">
                  {article.author.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      className="text-xs text-muted hover:text-accent transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter CTA */}
      <section className="py-10 md:py-12 px-4 md:px-6 bg-cream-dark">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-serif text-2xl font-bold text-dark mb-2">
            Enjoyed this story?
          </p>
          <p className="text-muted mb-6">Get more delivered weekly.</p>
          <NewsletterForm variant="light" />
        </div>
      </section>

      {/* Related Stories */}
      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="mx-auto max-w-[1280px]">
          <h3 className="font-serif text-sm uppercase tracking-[0.15em] text-dark mb-8">
            More Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related) => (
              <Link key={related.slug} href={`/stories/${related.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl mb-4">
                  <Image
                    src={related.featuredImage}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <Badge variant="city">{related.city.name}</Badge>
                <h4 className="font-serif text-lg font-bold mt-2 group-hover:text-accent transition-colors">
                  {related.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
