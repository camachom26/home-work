import Image from "next/image";

export function CardGridIcon() {
  return (
    <section
      id="cards"
      className="w-full bg-[#dee0eb] scroll-mt-24"
    >
      {/* Optional desktop min-height */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1*/}
              <div
                className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
              >
                <div className="h-10 w-10 rounded-xl" aria-hidden="true" >
                  <Image
                    src="/monitor.png"
                    alt="Check out our github"
                    width={40}
                    height={100}
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
              {/* 2*/}
              <div
                className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
              >
                <div className="h-10 w-10 rounded-xl" aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt="Check out our github"
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
              {/* 3*/}
              <div
                className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
              >
                <div className="h-10 w-10 rounded-xl" aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt="Check out our github"
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
              {/* 4*/}
              <div
                className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
              >
                <div className="h-10 w-10 rounded-xl" aria-hidden="true">
                  <Image
                      src="/monitor.png"
                      alt="Check out our github"
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
              {/* 5*/}
              <div
                className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
              >
                <div className="h-10 w-10 rounded-xl" aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt="Check out our github"
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
              {/* 6*/}
              <div
                className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
              >
                <div className="h-10 w-10 rounded-xl" aria-hidden="true">
                  <Image
                    src="/monitor.png"
                    alt="Check out our github"
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
          </div>
        </div>
      </div>
    </section>
  );
}