"use client";

import Image from "next/image";

export default function Hero({
  title = "Home --> Work",
  subtitle = "Welcome to the next chapter of your life!",
  ctaLabel = "Get Started!",
  onCtaClick,
}: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}) {
  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden rounded-[4px]">
      <div className="absolute inset-0">
        <div aria-hidden="true" className="absolute inset-0 bg-white/40" />
        <Image
          src="/landing/hero.png"
          alt=""
          fill
          priority
          className="object-cover opacity-85"
        />
      </div>

      {/* Title box */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[104px] backdrop-blur-[2px] bg-white/60 rounded-[31px] shadow-[0px_4px_4px_rgba(0,0,0,0.25),29px_18px_27px_rgba(0,0,0,0.25)] w-[min(966px,92vw)] px-6 py-6 text-center">
        <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(28px,5vw,72px)] leading-[1.2] tracking-[-0.02em] drop-shadow">
          {title}
        </p>
        <p className="mt-3 font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(12px,1.6vw,20px)] leading-[1.2]">
          {subtitle}
        </p>
      </div>

      {/* ✅ Center CTA */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={onCtaClick}
          className="bg-[#1e1e1e] h-[40px] rounded-[10px] w-[190px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.99] transition"
        >
          <span className="font-['Space_Mono',sans-serif] text-[#f5f5f5] text-[16px] leading-none">
            {ctaLabel}
          </span>
        </button>
      </div>
    </section>
  );
}