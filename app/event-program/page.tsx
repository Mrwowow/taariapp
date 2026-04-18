import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Event Program",
  description:
    "TAARi Awards Gala — Full run of show featuring live performances, award presentations, and cultural celebrations.",
  path: "/event-program",
});

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ProgramItem {
  time: string;
  duration?: string;
  title: string;
  bullets?: string[];
}

interface ProgramBlock {
  heading?: string;
  note?: string;
  items: ProgramItem[];
}

const BLOCKS: ProgramBlock[] = [
  {
    items: [
      {
        time: "5:00 PM – 6:00 PM",
        title: "Arrival + Red Carpet",
        bullets: [
          "Guest check-in",
          "Photos / networking",
          "Light Music / Live Jazz",
        ],
      },
      {
        time: "6:00 PM – 7:00 PM",
        title: "Dinner + Seating",
        bullets: ["Guests seated", "Food service"],
      },
    ],
  },
  {
    heading: "Main Program",
    items: [
      {
        time: "7:00 PM",
        title: "Program Begins",
        bullets: ["Lights down \u2192 stage ready"],
      },
      {
        time: "7:00 – 7:20 PM",
        duration: "20 min",
        title: "Opening Performance (JOJO)",
      },
      {
        time: "7:20 – 7:30 PM",
        duration: "10 min",
        title: "Welcoming Remarks (Gandi)",
      },
      {
        time: "7:30 – 7:45 PM",
        duration: "15 min",
        title: "About the Program",
      },
      {
        time: "7:45 – 8:00 PM",
        duration: "15 min",
        title: "Hawa Spoken Word",
      },
    ],
  },
  {
    heading: "Awards + Performances",
    items: [
      {
        time: "8:00 – 8:10 PM",
        duration: "10 min",
        title: "First Award Presentation (Benedict)",
        bullets: ["Profile", "Award presentation"],
      },
      {
        time: "8:10 – 8:25 PM",
        duration: "15 min",
        title: "IBEJI Dance & Drum",
      },
      {
        time: "8:25 – 8:35 PM",
        duration: "10 min",
        title: "Second Award \u2013 Timi Mitchell",
      },
      {
        time: "8:35 – 8:50 PM",
        duration: "15 min",
        title: "Mani Hapa Violin",
      },
      {
        time: "8:50 – 9:00 PM",
        duration: "10 min",
        title: "Third Award \u2013 Mama Linka Dia Williams",
      },
      {
        time: "9:00 – 9:10 PM",
        duration: "10 min",
        title: "Leslie Spoken Word",
      },
      {
        time: "9:10 – 9:20 PM",
        duration: "10 min",
        title: "KAPO Drum",
      },
      {
        time: "9:20 – 9:30 PM",
        duration: "10 min",
        title: "Fourth Award \u2013 Mr. Caster",
      },
    ],
  },
  {
    heading: "Final Segment",
    note: "Approx. 9:30 PM onward",
    items: [
      {
        time: "~9:30 PM",
        duration: "15 min",
        title: "African YEV Fashion",
      },
      {
        time: "~9:45 PM",
        duration: "10 min",
        title: "Fifth Award \u2013 OBA Elie",
      },
      {
        time: "~9:55 PM",
        duration: "15 min",
        title: "Balafon Drum Performance",
      },
      {
        time: "~10:10 PM",
        duration: "10 min",
        title: "Sixth Award \u2013 Mama Kadiatu",
      },
    ],
  },
  {
    heading: "Closing",
    items: [
      {
        time: "~10:20 PM",
        title: "Closing Remarks + Sponsor Recognition",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isAward(title: string) {
  return /award/i.test(title);
}

function isPerformance(title: string) {
  return (
    /performance|dance|drum|violin|spoken word|fashion|balafon|jojo/i.test(
      title
    ) && !isAward(title)
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function EventProgramPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/90 to-dark" />
        <div className="relative mx-auto max-w-[1320px] px-4 md:px-6 py-20 md:py-28 text-center">
          <p className="text-accent font-serif text-sm tracking-[0.25em] uppercase mb-4">
            TAARi Awards Gala
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Event Program
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Run of Show
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24">
          {BLOCKS.map((block, bi) => (
            <div key={bi} className="mb-14 last:mb-0">
              {/* Block heading */}
              {block.heading && (
                <div className="mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark">
                    {block.heading}
                  </h2>
                  {block.note && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      {block.note}
                    </p>
                  )}
                  <div className="mt-3 h-[2px] w-16 bg-accent" />
                </div>
              )}

              {/* Items */}
              <div className="space-y-0">
                {block.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="relative flex gap-5 md:gap-8 group"
                  >
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                          isAward(item.title)
                            ? "bg-accent"
                            : isPerformance(item.title)
                            ? "bg-green"
                            : "bg-dark"
                        }`}
                      />
                      {ii < block.items.length - 1 && (
                        <span className="w-px flex-1 bg-dark/15" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-8 last:pb-0 min-w-0">
                      <p className="text-xs font-semibold tracking-wide uppercase text-gray-500">
                        {item.time}
                        {item.duration && (
                          <span className="ml-2 text-accent">
                            ({item.duration})
                          </span>
                        )}
                      </p>
                      <h3
                        className={`mt-1 text-lg font-semibold ${
                          isAward(item.title) ? "text-accent" : "text-dark"
                        }`}
                      >
                        {item.title}
                      </h3>
                      {item.bullets && (
                        <ul className="mt-2 space-y-1">
                          {item.bullets.map((b, bIdx) => (
                            <li
                              key={bIdx}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legend */}
      <section className="bg-dark text-white">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-10 flex flex-wrap gap-6 justify-center text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent" /> Award
            Presentation
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green" /> Performance
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-dark border border-white/30" />{" "}
            General
          </span>
        </div>
      </section>
    </>
  );
}
