"use client";

import Navigation from "@/app/components/Navigation";
import Hero from "@/app/components/Hero";
import Footer from "@/app/components/Footer";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

//TODO: Replace instances of favicon.ico with local images
/**
 * ✅ Next.js setup notes:
 * - Put your images in: /public/landing/
 *   - /public/landing/icon.png
 *   - /public/landing/hero.png
 * - Tailwind: this file assumes Tailwind is already installed/enabled.
 */

// -------------------- Full-screen Panel + Carousel --------------------

function TextContentFlow() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start min-w-[300px] relative w-full" data-name="Text Content Flow">
      <div className="content-stretch flex flex-col font-['Press_Start_2P:Regular',sans-serif] gap-[8px] items-start not-italic relative w-full" data-name="Text Content Heading">
        <p className="leading-[1.2] text-[#1e1e1e] text-[36px] tracking-[-0.72px] w-full whitespace-pre-wrap">
          Heading
        </p>
        <div className="flex flex-col justify-center text-[#757575] text-[20px] w-full">
          <p className="leading-[1.2] whitespace-pre-wrap">Subheading</p>
        </div>
      </div>

      <div className="w-full">
        <p className="font-['Space_Mono:Regular',sans-serif] leading-[1.4] text-[#1e1e1e] text-[16px] whitespace-pre-wrap">
          Body text for your whole article or post. We’ll put in some lorem ipsum to show how a filled-out page might look:
        </p>
      </div>

      <div className="relative w-full">
        <p className="font-['Space_Mono:Regular',sans-serif] leading-[1.4] text-[#1e1e1e] text-[16px] whitespace-pre-wrap">
          {
            "Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. Exclusive izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et Porter destination Toto remarkable officia Helsinki excepteur Basset hound. Zürich sleepy perfect consectetur."
          }
        </p>
      </div>
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
    <div className="relative w-full h-[420px] md:h-[520px] rounded-[28px] overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.25)]">
      <Image
        src={items[index]?.src}
        alt={items[index]?.alt ?? ""}
        fill
        className="object-cover"
        priority
      />

      {/* Controls */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full px-3 py-2"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full px-3 py-2"
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Dots */}
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
    // ✅ Full-screen section
    <section className="bg-[#f1d5d5] opacity-80 w-screen min-h-screen" data-name="Panel Image Content">
      <div className="w-full h-full flex items-center">
        <div className="w-full h-full px-6 md:px-16 py-16">
          {/* ✅ Carousel left, content right (stacks on mobile) */}
          <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <Carousel items={items} />
            <TextContentFlow />
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------- Card section (left as-is) --------------------

function CardGridIcon() {
  return (
    <div className="bg-[#dee0eb] content-stretch flex flex-col gap-[48px] min-h-screen w-screen items-start p-[64px] relative shrink-0" data-name="Card Grid Icon">
      <div className="content-stretch flex flex-col font-['Press_Start_2P:Regular',sans-serif] gap-[8px] items-start not-italic relative shrink-0" data-name="Text Content Heading">
        <p className="leading-[1.2] relative shrink-0 text-[#1e1e1e] text-[36px] tracking-[-0.72px] w-full whitespace-pre-wrap">
          Heading
        </p>
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#757575] text-[20px] w-full">
          <p className="leading-[1.2] whitespace-pre-wrap">Subheading</p>
        </div>
      </div>

      {/* Placeholder for your existing cards; keep yours if you already have it */}
      <div className="w-full">
        <div className="content-center flex flex-wrap gap-[64px] items-center relative w-full" data-name="Cards">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="content-start flex flex-wrap gap-[24px] items-start min-w-[240px] relative shrink-0 w-[301.333px]"
              data-name="Card"
            >
              <div className="overflow-clip relative shrink-0 size-[32px] bg-black/10 rounded" aria-hidden="true" />
              <div className="flex-1 min-w-[160px]">
                <p className="font-['Space_Mono:Regular',sans-serif] font-semibold text-[24px] text-[#1e1e1e]">Title</p>
                <p className="font-['Space_Mono:Regular',sans-serif] text-[16px] text-[#757575] leading-[1.4]">
                  {"Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExamplesLandingPage() {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale;

  return (
    <div className="bg-white flex flex-col items-start relative w-full" data-name="Examples/Landing Page">
      <Navigation locale={locale}/>
      <Hero />
      <PanelImageContent />
      <CardGridIcon />
      <Footer />
    </div>
  );
}