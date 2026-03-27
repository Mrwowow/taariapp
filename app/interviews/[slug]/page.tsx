import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getInterviewBySlug, getInterviews } from "@/lib/store";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function InterviewDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const interview = await getInterviewBySlug(slug);
  if (!interview) notFound();

  const interviews = await getInterviews();
  const relatedInterviews = interviews.filter((i) => i.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Header */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Portrait */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={interview.portrait}
                alt={interview.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <Badge variant="city">{interview.city.name}</Badge>
              <h1 className="font-serif text-3xl md:text-[42px] font-bold text-dark mt-4 mb-6 leading-tight">
                A Conversation with {interview.name}
              </h1>
              <div className="w-12 h-[1px] bg-dark/20 mb-6" />
              <p className="text-lg text-muted leading-relaxed">
                {interview.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Q&A */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-[720px]">
          {interview.questions.map((qa, i) => (
            <div key={i} className="mb-10">
              {i > 0 && <div className="w-full h-[1px] bg-border mb-10" />}
              <p className="text-lg font-bold text-accent mb-4">
                Q: {qa.question}
              </p>
              <p className="text-lg leading-[1.8] text-dark">
                {qa.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Interviews */}
      <section className="py-16 px-6 bg-cream-dark">
        <div className="mx-auto max-w-[1280px]">
          <h3 className="font-serif text-sm uppercase tracking-[0.15em] text-dark mb-8">
            More Interviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedInterviews.map((related) => (
              <Link key={related.slug} href={`/interviews/${related.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                  <Image
                    src={related.portrait}
                    alt={related.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h4 className="font-serif text-lg font-bold group-hover:text-accent transition-colors">
                  {related.name}
                </h4>
                <Badge variant="city">{related.city.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
