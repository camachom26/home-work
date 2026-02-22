"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type TiltHandlers = {
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
};

/**
 * Paper tilt: rotates based on cursor position inside the card.
 * - Small angles for a subtle "paper" feel
 * - Tracks a soft highlight (radial gradient) that follows the cursor
 */
function usePaperTilt(maxTiltDeg = 6): [
  React.CSSProperties,
  React.CSSProperties,
  TiltHandlers
] {
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)",
  });

  const [sheenStyle, setSheenStyle] = useState<React.CSSProperties>({
    opacity: 0,
    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)",
  });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left; // 0..w
    const y = e.clientY - rect.top; // 0..h

    const px = (x / rect.width) * 2 - 1; // -1..1
    const py = (y / rect.height) * 2 - 1; // -1..1

    // tilt: move mouse right -> rotateY positive, move down -> rotateX negative
    const rotY = clamp(px * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
    const rotX = clamp(-py * maxTiltDeg, -maxTiltDeg, maxTiltDeg);

    setStyle({
      transform: `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
        2
      )}deg) translateY(-4px)`,
    });

    setSheenStyle({
      opacity: 0.9,
      background: `radial-gradient(circle at ${x.toFixed(0)}px ${y.toFixed(
        0
      )}px, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`,
    });
  };

  const onMouseLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)",
    });
    setSheenStyle((s) => ({ ...s, opacity: 0 }));
  };

  return [style, sheenStyle, { onMouseMove, onMouseLeave }];
}

function PaperCard({
  delayMs,
  visible,
  children,
}: {
  delayMs: number;
  visible: boolean;
  children: React.ReactNode;
}) {
  const [tiltStyle, sheenStyle, handlers] = usePaperTilt(6);

  return (
    <div
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
      className={[
        "relative rounded-[24px] border border-black/10 bg-white/70 p-6",
        "shadow-[0px_8px_20px_rgba(0,0,0,0.10)] backdrop-blur-sm",
        "transition-[transform,box-shadow,background-color,opacity] duration-500 ease-out",
        "hover:shadow-[0px_22px_44px_rgba(0,0,0,0.18)] hover:bg-white",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        // Accessibility: no hover-only motion for keyboard users; still looks fine.
        "focus-within:shadow-[0px_22px_44px_rgba(0,0,0,0.18)]",
      ].join(" ")}
    >
      {/* Tilt layer */}
      <div
        {...handlers}
        style={tiltStyle}
        className={[
          "relative rounded-[20px]",
          // smooth tilt
          "transition-transform duration-150 ease-out",
          // respect reduced motion
          "motion-reduce:transition-none motion-reduce:transform-none",
        ].join(" ")}
      >
        {/* Sheen (paper highlight) */}
        <div
          aria-hidden="true"
          style={sheenStyle}
          className={[
            "pointer-events-none absolute inset-0 rounded-[20px]",
            "mix-blend-overlay transition-opacity duration-200",
            "motion-reduce:hidden",
          ].join(" ")}
        />

        {/* Paper edge / inner stroke */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-black/5"
        />

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

export function CardGridIcon() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const iconClass =
    "h-10 w-10 rounded-xl transition-transform duration-300 group-hover:scale-110";

  return (
    <section id="cards" className="w-full bg-[#dee0eb] scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-16 md:min-h-[720px]">
        <div className="flex flex-col gap-10">
          <div>
            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.2vw,30px)] leading-[1.2]">
              Real Ways to Turn Home Experience into Career Opportunities
            </p>
            <p className="mt-3 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] sm:text-[16px] leading-[1.5]">
              Discover how everyday skills from managing a household, supporting family, and organizing life can translate into meaningful work paths and new professional confidence.
            </p>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <PaperCard delayMs={0} visible={visible}>
              <div className="group">
                <div className={iconClass} aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  Returning to Work After a Career Break
                </p>
                <p className="mt-2 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[14px] leading-[1.6]">
                  Identify transferable skills and rebuild confidence for your first job back.
                </p>
              </div>
            </PaperCard>

            <PaperCard delayMs={80} visible={visible}>
              <div className="group">
                <div className={iconClass} aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  Finding Flexible or Remote Roles
                </p>
                <p className="mt-2 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[14px] leading-[1.6]">
                  Discover jobs that fit your schedule, location needs, and lifestyle.
                </p>
              </div>
            </PaperCard>

            <PaperCard delayMs={160} visible={visible}>
              <div className="group">
                <div className={iconClass} aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  Turning Household Management into Office Skills
                </p>
                <p className="mt-2 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[14px] leading-[1.6]">
                  Translate budgeting, scheduling, and organization into administrative careers.
                </p>
              </div>
            </PaperCard>

            <PaperCard delayMs={240} visible={visible}>
              <div className="group">
                <div className={iconClass} aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  Exploring New Career Paths Without Starting Over
                </p>
                <p className="mt-2 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[14px] leading-[1.6]">
                  See which industries match your existing strengths and interests.
                </p>
              </div>
            </PaperCard>

            <PaperCard delayMs={320} visible={visible}>
              <div className="group">
                <div className={iconClass} aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  Identifying Training Worth Your Time and Budget
                </p>
                <p className="mt-2 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[14px] leading-[1.6]">
                  Focus only on short, affordable programs that increase your job options.
                </p>
              </div>
            </PaperCard>

            <PaperCard delayMs={400} visible={visible}>
              <div className="group">
                <div className={iconClass} aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  Building a Professional Pitch from Life Experience
                </p>
                <p className="mt-2 font-['Space_Mono',sans-serif] text-[#5b5b5b] text-[14px] leading-[1.6]">
                  Turn your real-world experience into a compelling return-to-work story.
                </p>
              </div>
            </PaperCard>
          </div>
        </div>
      </div>
    </section>
  );
}