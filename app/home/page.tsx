import Hero from "@/components/home/Hero";
import FeaturedStory from "@/components/home/FeaturedStory";
import LatestStories from "@/components/home/LatestStories";
import CityEditionsPreview from "@/components/home/CityEditionsPreview";
import ReelsPreview from "@/components/home/ReelsPreview";
import NewsletterSection from "@/components/home/NewsletterSection";
import SponsorHighlight from "@/components/home/SponsorHighlight";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedStory />
      <LatestStories />
      <CityEditionsPreview />
      <ReelsPreview />
      <NewsletterSection />
      <SponsorHighlight />
    </>
  );
}
