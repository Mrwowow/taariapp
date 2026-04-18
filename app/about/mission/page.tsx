import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Our Mission",
  description:
    "TAARi documents the African Diaspora across global cities through editorial photo essays, video reels, and cultural interviews.",
  path: "/about/mission",
});

export default function MissionPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/90 to-dark" />
        <div className="relative mx-auto max-w-[1320px] px-4 md:px-6 py-20 md:py-28 text-center">
          <p className="text-accent font-serif text-sm tracking-[0.25em] uppercase mb-4">
            About TAARi
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Our Mission
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Documenting the African Diaspora across global cities.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24 space-y-12">
          {/* Vision */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              Our Vision
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <p className="text-gray-700 leading-relaxed text-lg">
              TAARi is a premium digital media platform dedicated to telling the
              stories of the African Diaspora across global cities. Through
              editorial photo essays, video reels, cultural interviews, and
              in-depth features, we illuminate the richness, diversity, and
              creativity of African-descended communities worldwide.
            </p>
          </div>

          {/* What We Do */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              What We Do
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Stories",
                  desc: "In-depth editorial pieces exploring culture, music, art, food, fashion, community, and technology across the African Diaspora.",
                },
                {
                  title: "Interviews",
                  desc: "One-on-one conversations with change-makers, artists, entrepreneurs, and cultural leaders shaping their cities.",
                },
                {
                  title: "Reels",
                  desc: "Short-form video content capturing the energy and spirit of Diaspora communities in cities around the world.",
                },
                {
                  title: "City Editions",
                  desc: "Dedicated coverage from Atlanta, Houston, Toronto, London, New York, and more — each city with its own cultural pulse.",
                },
              ].map((item) => (
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

          {/* Why It Matters */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              Why It Matters
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              The African Diaspora is one of the most vibrant and influential
              cultural forces in the world, yet its stories are often
              under-represented or told through narrow lenses. TAARi exists to
              change that.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              We believe that by documenting the lived experiences, creative
              expressions, and community-building efforts of African-descended
              people across the globe, we can foster greater understanding,
              inspire new generations, and celebrate the beauty of our shared
              heritage.
            </p>
          </div>

          {/* Values */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              Our Values
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <div className="space-y-4">
              {[
                {
                  value: "Authenticity",
                  desc: "We tell stories from within the community, centering the voices and perspectives of the people we feature.",
                },
                {
                  value: "Excellence",
                  desc: "We hold ourselves to the highest standards in editorial quality, visual storytelling, and cultural sensitivity.",
                },
                {
                  value: "Connection",
                  desc: "We bridge communities across continents, helping Diaspora members see their experiences reflected in others.",
                },
                {
                  value: "Celebration",
                  desc: "We approach our coverage with joy, pride, and a deep appreciation for the cultures we document.",
                },
              ].map((item) => (
                <div key={item.value} className="flex gap-4">
                  <span className="mt-1.5 w-3 h-3 rounded-full bg-accent shrink-0" />
                  <div>
                    <h3 className="font-semibold text-dark">{item.value}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
