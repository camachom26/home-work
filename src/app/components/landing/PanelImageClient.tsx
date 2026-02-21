"use client";

import { useMemo } from "react";
import { Carousel, type CarouselItem } from "@/app/components/landing/Carousel";
import { TextContentFlow } from "@/app/components/landing/TextContentFlow";

export function PanelImageContent() {
  const items = useMemo<CarouselItem[]>(
    () => [
      { src: "/landing/hero.png", alt: "Slide 1" },
      { src: "/landing/item2.png", alt: "Slide 2" },
      { src: "/landing/hero.png", alt: "Slide 3" }
    ],
    []
  );

  return (
    <section
      id="panel"
      className="w-full bg-[#f1d5d5] scroll-mt-24"
    >
      {/* Optional desktop min-height without forcing full screen */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-16 md:min-h-[560px] flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          <Carousel items={items} />
          <TextContentFlow />
        </div>
      </div>
    </section>
  );
}