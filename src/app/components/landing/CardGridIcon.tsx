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
              Heading
            </p>
            <p className="mt-3 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] sm:text-[16px] leading-[1.5]">
              Subheading
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-[24px] border border-black/10 bg-white/70 p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.10)]"
              >
                <div className="h-10 w-10 rounded-xl bg-black/10" aria-hidden="true" />
                <p className="mt-4 font-['Space_Mono',sans-serif] font-bold text-[#1e1e1e] text-[18px]">
                  Title
                </p>
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