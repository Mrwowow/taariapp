import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { articles, getArticleBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Featured Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
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
      <article className="py-12 px-6">
        <div className="mx-auto max-w-[720px]">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge variant="city">{article.city.name}</Badge>
            {article.categories.map((cat) => (
              <Badge key={cat} variant="category">{cat}</Badge>
            ))}
            {article.isSponsored && <Badge variant="sponsored">Sponsored</Badge>}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-muted leading-relaxed mb-6">{article.excerpt}</p>

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
          <div className="flex gap-4 py-4 border-t border-b border-border mb-10">
            {["X", "FB", "LI", "Link"].map((platform) => (
              <button
                key={platform}
                className="w-9 h-9 border border-border flex items-center justify-center text-xs text-muted hover:text-dark hover:border-dark transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>

          {/* Article Body */}
          <div className="space-y-6">
            {article.body.map((paragraph, i) => {
              // Pull quote detection (starts with a quote mark)
              if (paragraph.startsWith('"') || paragraph.startsWith('\u201C')) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-[3px] border-accent pl-8 py-4 my-10"
                  >
                    <p className="font-serif text-2xl md:text-[28px] italic text-accent leading-relaxed">
                      {paragraph}
                    </p>
                  </blockquote>
                );
              }
              return (
                <p key={i} className="text-lg leading-[1.8] text-dark">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Photo Gallery */}
          {article.gallery.length > 0 && (
            <div className="my-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={img}
                      alt={`${article.title} gallery image ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted italic mt-3 text-center">
                Photo gallery — {article.title}
              </p>
            </div>
          )}

          {/* Sponsor Banner */}
          {article.isSponsored && (
            <div className="my-10 p-6 border border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-border/50 flex items-center justify-center text-[10px] text-muted font-medium shrink-0">
                LOGO
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">Presented by</p>
                <p className="text-sm font-medium text-dark">Shea Moisture</p>
              </div>
            </div>
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
      <section className="py-12 px-6 bg-cream-dark">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-serif text-2xl font-bold text-dark mb-2">
            Enjoyed this story?
          </p>
          <p className="text-muted mb-6">Get more delivered weekly.</p>
          <NewsletterForm variant="light" />
        </div>
      </section>

      {/* Related Stories */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-[1280px]">
          <h3 className="font-serif text-sm uppercase tracking-[0.15em] text-dark mb-8">
            More Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related) => (
              <Link key={related.slug} href={`/stories/${related.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden mb-4">
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
