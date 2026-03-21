import Link from "next/link";
import NewsletterForm from "@/components/ui/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* CTA top banner */}
      <div className="border-b border-white/10 py-10 px-4 md:px-6">
        <div className="mx-auto max-w-[1320px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
              GreenGrowth TV &nbsp;&middot;&nbsp; Eye Watch &nbsp;&middot;&nbsp; Report
            </p>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1">
              Stay Informed. Get Involved. Make a Difference
            </h3>
            <p className="text-sm text-gray-400 max-w-xl">
              Join us at the forefront of news and community action. From breaking stories to grassroots initiatives.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/submit" className="flex items-center gap-2 bg-green text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-green-dark transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Submit Your story
            </Link>
            <button className="text-sm font-medium text-white border border-white/30 px-5 py-2.5 rounded-lg hover:border-white transition-colors">
              Subscribe for Updates
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-[1320px] px-4 md:px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-2">TAARi</h3>
            <p className="text-[11px] text-gray-400 italic mb-4">The African Experience ...</p>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Documenting the African Diaspora across global cities.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-r border-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3,5 12,13 21,5" />
                  </svg>
                </div>
                <input type="email" placeholder="Your email" className="bg-transparent text-sm text-white placeholder:text-gray-500 px-3 py-2 w-[120px] outline-none" />
              </div>
              <button className="bg-green text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-green-dark transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {["Cities", "Stories", "Reels"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Cities</h4>
            <ul className="space-y-2.5">
              {["Breaking News", "World News", "Politics", "Business", "Health", "Crime", "Environment"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Eye Watch */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Eye Watch</h4>
            <ul className="space-y-2.5">
              {["Submit a Report", "Top Reports", "How It Works"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">About Us</h4>
            <ul className="space-y-2.5">
              {["Our Mission", "Careers", "The Team", "Partnerships", "Press & Media", "Contact Us"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social icons + bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            Copyright &copy; 2026 TAARi Magazine. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social icons */}
            {[
              "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
              "M22.46 6c-.85.38-1.78.64-2.73.76 1-.6 1.76-1.54 2.12-2.67-.93.55-1.96.95-3.06 1.17A4.92 4.92 0 0 0 12 9.5c0 .39.04.77.13 1.13A13.98 13.98 0 0 1 2 5.13a4.92 4.92 0 0 0 1.52 6.57c-.78-.02-1.52-.24-2.16-.6v.06a4.93 4.93 0 0 0 3.95 4.83 4.9 4.9 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 21.54a13.94 13.94 0 0 0 7.55 2.21",
              "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M6.5 2h11A4.5 4.5 0 0 1 22 6.5v11a4.5 4.5 0 0 1-4.5 4.5h-11A4.5 4.5 0 0 1 2 17.5v-11A4.5 4.5 0 0 1 6.5 2z",
            ].map((d, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
