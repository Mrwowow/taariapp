import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getInterviews } from "@/lib/store";

export default async function InterviewsPage() {
  const interviews = await getInterviews();
  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-3">
            Interviews
          </h1>
          <p className="text-lg text-muted">
            Conversations with the Diaspora&apos;s boldest voices.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interviews.map((interview) => (
            <Link
              key={interview.slug}
              href={`/interviews/${interview.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                <Image
                  src={interview.portrait}
                  alt={interview.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-95"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-dark group-hover:text-accent transition-colors">
                {interview.name}
              </h3>
              <Badge variant="city">{interview.city.name}</Badge>
              <p className="text-sm text-muted italic mt-2">
                &ldquo;{interview.oneLiner}&rdquo;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
