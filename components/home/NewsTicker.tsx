const headlines = [
  "The Sound of the New South",
  "Kenya Cracks Down on Illegal Logging",
  "Ghana Tackles Coastal Pollution Crisis",
  "South Africa's Renewable Energy Surge",
  "Bridging Continents: London's Diaspora Rewrites Culture",
  "Third Ward Renaissance in Houston",
];

export default function NewsTicker() {
  return (
    <div className="py-3 px-4 md:px-6">
      <div className="mx-auto max-w-[1320px]">
        <div className="bg-cream rounded-full flex items-center h-[44px] px-2 overflow-hidden">
          {/* Yellow badge */}
          <span className="shrink-0 bg-yellow text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full mr-4 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Story Update:
          </span>
          {/* Scrolling headlines */}
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee whitespace-nowrap flex">
              {[...headlines, ...headlines].map((h, i) => (
                <span key={i} className="text-sm text-gray-500 flex items-center">
                  {h}
                  <span className="mx-3 text-accent text-[8px]">&#9679;</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
