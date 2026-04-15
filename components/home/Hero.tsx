import { getArticles, getFeaturedArticles, getActiveBanners } from "@/lib/store";
import HeroSlider, { type HeroSlide } from "./HeroSlider";

export default async function Hero() {
  const [banners, featuredArticles, articles] = await Promise.all([
    getActiveBanners(),
    getFeaturedArticles(),
    getArticles(),
  ]);

  const slides: HeroSlide[] = [];

  // 1. Featured articles take precedence
  for (const a of featuredArticles) {
    slides.push({
      id: `article-${a.slug}`,
      image: a.featuredImage,
      title: a.title,
      subtitle: a.excerpt,
      badge: a.city.name,
      ctaLabel: "Read Story",
      ctaUrl: `/stories/${a.slug}`,
    });
  }

  // 2. Then manual banners
  for (const b of banners) {
    slides.push({
      id: `banner-${b.id}`,
      image: b.image,
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge,
      ctaLabel: b.ctaLabel,
      ctaUrl: b.ctaUrl,
    });
  }

  // 3. Fallback — latest article if nothing else
  if (slides.length === 0 && articles.length > 0) {
    const latest = articles[0];
    slides.push({
      id: `article-${latest.slug}`,
      image: latest.featuredImage,
      title: latest.title,
      subtitle: latest.excerpt,
      badge: latest.city.name,
      ctaLabel: "Read Story",
      ctaUrl: `/stories/${latest.slug}`,
    });
  }

  if (slides.length === 0) return null;

  return <HeroSlider slides={slides} />;
}
