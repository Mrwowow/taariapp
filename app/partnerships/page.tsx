import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getActivePartnerships } from "@/lib/store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Partnerships",
  description:
    "TAARi partners with organizations, brands, and institutions that share our commitment to celebrating the African Diaspora.",
  path: "/partnerships",
});

export default async function PartnershipsPage() {
  const partnerships = await getActivePartnerships();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/90 to-dark" />
        <div className="relative mx-auto max-w-[1320px] px-4 md:px-6 py-20 md:py-28 text-center">
          <p className="text-accent font-serif text-sm tracking-[0.25em] uppercase mb-4">
            Collaborate With Us
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Partnerships
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Building bridges across the Diaspora through meaningful
            collaborations.
          </p>
        </div>
      </section>

      {/* About Partnerships */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24 space-y-12">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              How We Partner
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              TAARi collaborates with organizations, brands, cultural
              institutions, and community groups that share our commitment to
              documenting and celebrating the African Diaspora. Whether you are a
              non-profit, a corporate brand, a media outlet, or a grassroots
              organization, we would love to explore ways to work together.
            </p>
          </div>

          {/* Partnership Types */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
              Partnership Opportunities
            </h2>
            <div className="h-[2px] w-16 bg-accent mb-6" />
            <div className="space-y-4">
              {[
                {
                  title: "Media Partnerships",
                  desc: "Cross-promotion, content syndication, and co-branded editorial projects with aligned media outlets.",
                },
                {
                  title: "Community Partnerships",
                  desc: "Collaboration with cultural organizations, festivals, and community groups to amplify local stories.",
                },
                {
                  title: "Institutional Partnerships",
                  desc: "Research collaborations, archival projects, and educational initiatives with universities and cultural institutions.",
                },
                {
                  title: "Brand Partnerships",
                  desc: "Strategic alliances with brands that want to authentically engage with the African Diaspora through culture-forward campaigns.",
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

          {/* Current Partners */}
          {partnerships.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-2">
                Our Partners
              </h2>
              <div className="h-[2px] w-16 bg-accent mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {partnerships.map((partner) => (
                  <a
                    key={partner.id}
                    href={partner.url || "#"}
                    target={partner.url ? "_blank" : undefined}
                    rel={partner.url ? "noopener noreferrer" : undefined}
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                  >
                    {partner.logo ? (
                      <div className="relative w-20 h-20 mb-4">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-2xl font-bold text-gray-400">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="font-semibold text-dark">{partner.name}</h3>
                    <p className="text-xs text-accent uppercase tracking-wide mt-1">
                      {partner.type}
                    </p>
                    {partner.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {partner.description}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-dark rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Become a Partner
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Interested in partnering with TAARi? We would love to hear from
              you. Reach out and let us explore how we can create impact
              together.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-accent text-dark px-8 py-3 rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
