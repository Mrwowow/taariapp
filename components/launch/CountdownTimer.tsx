"use client";

import { useEffect, useState } from "react";

// April 18, 2026 7:30 PM Pittsburgh (US/Eastern = America/New_York)
// Pittsburgh is in the Eastern time zone
const LAUNCH_DATE = new Date("2026-04-18T19:30:00-04:00"); // EDT (April = daylight saving)

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = Math.max(0, LAUNCH_DATE.getTime() - now.getTime());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-24 sm:w-28 sm:h-32 md:w-32 md:h-36 bg-dark-card border border-border rounded-lg flex items-center justify-center overflow-hidden">
        <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-accent tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
      </div>
      <span className="mt-3 text-xs sm:text-sm uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const t = getTimeLeft();
    setTime(t);

    if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
      setLaunched(true);
      return;
    }

    const interval = setInterval(() => {
      const next = getTimeLeft();
      setTime(next);
      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        setLaunched(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    // SSR / first paint — render skeleton to avoid hydration mismatch
    return (
      <div className="flex gap-4 sm:gap-6 justify-center">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <Digit key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  if (launched) {
    return (
      <div className="text-center">
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-accent animate-pulse">
          We Are Live
        </h2>
      </div>
    );
  }

  return (
    <div className="flex gap-4 sm:gap-6 justify-center">
      <Digit value={time.days} label="Days" />
      <Digit value={time.hours} label="Hours" />
      <Digit value={time.minutes} label="Minutes" />
      <Digit value={time.seconds} label="Seconds" />
    </div>
  );
}
