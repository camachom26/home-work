"use client";

import { useMemo } from "react";
import { Carousel, type CarouselItem } from "@/app/components/landing/Carousel";
import { TextContentFlow } from "@/app/components/landing/TextContentFlow";

export function PanelImageContent() {
  const items = useMemo<CarouselItem[]>(
    () => [
      { src: "/Dashboard.png", alt: "Slide 1" },
      { src: "/surveyresults.png", alt: "Slide 2" },
      { src: "/training.png", alt: "Slide 3" }
    ],
    []
  );

  return (
    <section
      id="panel"
      className="w-full bg-[#f1d5d5] scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-16 md:min-h-[560px] flex items-center">
        {/* Wider image layout: 60% image / 40% text */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 md:gap-12 items-top w-full">
          
          {/* Image side */}
          <div className="w-full">
            <Carousel items={items} />
          </div>

          {/* Text side */}
          <div className="w-full">
            <TextContentFlow />
          </div>

        </div>
      </div>
    </section>
  );
}