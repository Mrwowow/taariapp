import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { getTeamMembers } from "@/lib/store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "The Team",
  description:
    "Meet the people behind TAARi — writers, photographers, filmmakers, and culture enthusiasts documenting the African Diaspora.",
  path: "/about/team",
});

export default async function TeamPage() {
  const members = await getTeamMembers();

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
            The Team
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            The people behind the stories.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1320px] px-4 md:px-6 py-16 md:py-24">
          {members.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              Team members coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/5] bg-gray-100">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-dark/5">
                        <span className="text-5xl font-bold text-dark/20">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-dark text-lg">
                      {member.name}
                    </h3>
                    <p className="text-accent text-sm font-medium mt-0.5">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Social links */}
                    <div className="flex gap-3 mt-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-gray-400 hover:text-dark transition-colors"
                          title="Email"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M22 4L12 13L2 4" />
                          </svg>
                        </a>
                      )}
                      {member.linkedIn && (
                        <a
                          href={member.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-dark transition-colors"
                          title="LinkedIn"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
