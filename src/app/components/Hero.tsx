"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero({
  title = "Home --> Work",
  subtitle = "Welcome to the next chapter of your life!",
  ctaLabel = "Get Started!",
  locale,
  onCtaClick
}: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  locale: string;
  onCtaClick?: () => void;
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => setEntered(true), []);

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden rounded-[4px]">
      <style>{`
        /* Float amplitude is smaller on mobile, larger on desktop */
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(var(--float-distance, -5px)); }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Default (mobile-first): smaller float distance */
        .float-title {
          --float-distance: -3px;
        }

        /* Desktop+ : slightly larger float distance */
        @media (min-width: 768px) {
          .float-title {
            --float-distance: -5px;
          }
        }

        /* Accessibility: respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .float-title {
            animation: none !important;
          }
          .enter-anim {
            animation: none !important;
          }
          .cta-hover {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="absolute inset-0">
        <div aria-hidden="true" className="absolute inset-0 bg-white/5" />
        <Image src="/landing/hero.png" alt="" fill priority className="object-cover opacity-100" />
      </div>

      {/* Centering container (not animated) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[104px] w-[min(966px,92vw)]">
        {/* Animated wrapper (safe to animate transforms here) */}
        <div
          className="float-title backdrop-blur-[2px] bg-white/60 rounded-[31px] shadow-[0px_4px_4px_rgba(0,0,0,0.25),29px_18px_27px_rgba(0,0,0,0.25)] px-6 py-6 text-center"
          style={{
            animation: `${entered ? "fadeUp 700ms ease-out both" : "none"}, floatY 4.5s ease-in-out infinite`
          }}
        >
          <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(28px,5vw,72px)] leading-[1.2] tracking-[-0.02em] drop-shadow">
            {title}
          </p>
          <p className="mt-3 font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(12px,1.6vw,20px)] leading-[1.2]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* CTA: halfway-ish between title and bottom + entrance */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[68%]">
        <div
          className="enter-anim"
          style={{
            animation: entered ? "fadeUp 900ms ease-out both" : "none",
            animationDelay: entered ? "120ms" : "0ms"
          }}
        >
          <Link
            href={`/${locale}/survey`}
            onClick={onCtaClick}
            className={[
              "cta-hover inline-block",
              "bg-[#1e1e1e] hover:bg-black text-white rounded-[8px] px-6 py-3",
              "font-['Space_Mono',sans-serif] text-[16px]",
              "transition-transform duration-200 ease-out hover:-translate-y-1"
            ].join(" ")}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}