"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type CarouselItem = { src: string; alt: string };

export function Carousel({
  items,
  intervalMs = 4500
}: {
  items: CarouselItem[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [items.length, intervalMs]);

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] rounded-[28px] overflow-hidden border border-black/10 bg-white/40 shadow-[0px_10px_30px_rgba(0,0,0,0.18)]">
      <Image
        src={items[index]?.src}
        alt={items[index]?.alt ?? ""}
        fill
        className="object-cover"
        priority
      />

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full px-3 py-2 border border-black/10"
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full px-3 py-2 border border-black/10"
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}