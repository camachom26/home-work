"use client";

import type { Locale } from "@/i18n/routing";
import Hero from "@/app/components/Hero";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

/** ---------------- Panel + Carousel ---------------- */

function TextContentFlow() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.4vw,32px)] leading-[1.2]">
          Heading
        </p>
        <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] sm:text-[16px] leading-[1.5]">
          Subheading
        </p>
      </div>

      <p className="font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.6]">
        Body text for your whole article or post. We’ll put in some lorem ipsum to show how a filled-out page might look:
      </p>

      <p className="font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.6]">
        Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi
        intricate Content. Qui international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure.
      </p>
    </div>
  );
}

type CarouselItem = { src: string; alt: string };

function Carousel({ items, intervalMs = 4500 }: { items: CarouselItem[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => window.clearInterval(id);
  }, [items.length, intervalMs]);

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] rounded-[28px] overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.18)] border border-black/10 bg-white/40">
      <Image src={items[index]?.src} alt={items[index]?.alt ?? ""} fill className="object-cover" priority />

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/75 hover:bg-white text-black rounded-full px-3 py-2 border border-black/10"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/75 hover:bg-white text-black rounded-full px-3 py-2 border border-black/10"
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
                className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PanelImageContent() {
  const items = useMemo<CarouselItem[]>(
    () => [
      { src: "/landing/hero.png", alt: "Slide 1" },
      { src: "/landing/item2.png", alt: "Slide 2" },
      { src: "/landing/hero.png", alt: "Slide 3" }
    ],
    []
  );

  return (
    <section className="w-screen min-h-screen bg-[#f1d5d5]">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <Carousel items={items} />
          <TextContentFlow />
        </div>
      </div>
    </section>
  );
}

function CardGridIcon() {
  return (
    <section className="w-screen min-h-screen bg-[#dee0eb]">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-16">
        <div className="flex flex-col gap-10">
          <div>
            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.4vw,32px)] leading-[1.2]">
              Heading
            </p>
            <p className="mt-3 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] sm:text-[16px] leading-[1.5]">
              Subheading
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]">
                <div className="h-10 w-10 rounded-xl bg-black/10" aria-hidden="true" />
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">Title</p>
                <p className="mt-2 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[14px] leading-[1.6]">
                  Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingClient({ locale }: { locale: Locale }) {
  return (
    <div className="w-full">
      <Hero locale={locale} />
      <PanelImageContent />
      <CardGridIcon />
    </div>
  );
}