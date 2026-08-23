'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { isVideoUrl } from '@/lib/media';

interface ImageLightboxProps {
  images: string[];
  alt: string;
}

export default function ImageLightbox({ images, alt }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0)),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, prev, next]);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-xl group"
          >
            {isVideoUrl(img) ? (
              <video
                src={img}
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Image
                src={img}
                alt={`${alt} gallery image ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors flex items-center justify-center">
              {isVideoUrl(img) ? (
                <span className="w-14 h-14 rounded-full bg-dark/60 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-0.5 drop-shadow-lg">
                    <polygon points="6 4 20 12 6 20" />
                  </svg>
                </span>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-dark/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-[90vw] h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideoUrl(images[activeIndex]) ? (
              <video
                src={images[activeIndex]}
                controls
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <Image
                src={images[activeIndex]}
                alt={`${alt} gallery image ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            )}
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Counter */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
