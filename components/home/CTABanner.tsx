import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-12 px-4 md:px-6 bg-cream">
      <div className="mx-auto max-w-[800px] text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
          GreenGrowth TV &nbsp;&middot;&nbsp; Eye Watch &nbsp;&middot;&nbsp; Report
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark mb-3">
          Stay Informed. Get Involved. Make a Difference
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xl mx-auto">
          Join us at the forefront of news and community action. From breaking stories to grassroots
          initiatives, TAARi keeps you informed and engaged. Watch live broadcasts, explore impactful
          stories, and contribute your voice.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/submit"
            className="flex items-center gap-2 bg-green text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-green-dark transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Submit Your story
          </Link>
          <button className="text-sm font-medium text-dark border border-gray-300 px-6 py-3 rounded-lg hover:border-dark transition-colors">
            Subscribe for Updates
          </button>
        </div>
      </div>
    </section>
  );
}
