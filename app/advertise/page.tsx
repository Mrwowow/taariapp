import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Advertise With Us",
  description:
    "Reach the African Diaspora through TAARi's premium editorial platform. Sponsored stories, banner placements, video reels, and event partnerships.",
  path: "/advertise",
});

const OFFERINGS = [
  {
    title: "Sponsored Stories",
    desc: "Co-create editorial content that aligns your brand with the culture, values, and communities TAARi covers. Full photo-essay treatment with your brand woven naturally into the narrative.",
  },
  {
    title: "Banner & Display Ads",
    desc: "Premium placements across our home page hero slider, city edition pages, and story sidebars. High-impact visibility with our engaged audience.",
  },
  {
    title: "Video Reels",
    desc: "Short-form branded video content distributed across our platform and social channels. Perfect for product launches, event recaps, and cultural campaigns.",
  },
  {
    title: "Event Partnerships",
    desc: "Title or presenting sponsorship for TAARi events, awards galas, and community gatherings. On-stage branding, VIP access, and media coverage included.",
  },
  {
    title: "Newsletter Sponsorship",
    desc: "Featured placement in our weekly newsletter reaching our most dedicated readers. Direct-to-inbox visibility with high open rates.",
  },
  {
    title: "Custom Campaigns",
    desc: "Have something else in mind? We build bespoke cross-platform campaigns tailored to your goals, audience, and budget.",
  },
];

export default function AdvertisePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/90 to-dark" />
        <div className="relative mx-auto max-w-[1320px] px-4 md:px-6 py-20 md:py-28 text-center">
          <p className="text-accent font-serif text-sm tracking-[0.25em] uppercase mb-4">
            Partner With Us
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Advertise With TAARi
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Connect your brand with the culture, creativity, and communities of
            the African Diaspora.
          </p>
        </div>
      </section>

      {/* Why Advertise */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24 space-y-12">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              Why TAARi?
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              TAARi reaches an engaged, culturally-aware audience across multiple
              global cities. Our readers are passionate about culture, art,
              music, food, and community — and they trust TAARi as a source of
              authentic, high-quality storytelling.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { stat: "5+", label: "Cities" },
                { stat: "50K+", label: "Monthly Readers" },
                { stat: "85%", label: "Engagement Rate" },
                { stat: "70%", label: "Return Visitors" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-5 text-center border border-gray-100 shadow-sm"
                >
                  <p className="font-serif text-2xl md:text-3xl font-bold text-accent">
                    {item.stat}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Offerings */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              What We Offer
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {OFFERINGS.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                >
                  <h3 className="font-semibold text-dark text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-dark rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Reach out to discuss how we can build a campaign that connects your
              brand with our audience.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-accent text-dark px-8 py-3 rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
