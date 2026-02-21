"use client";

export default function Footer() {
  const explore = [
    "Design",
    "Prototyping",
    "Development features",
    "Design systems",
    "Collaboration features",
    "Design process",
    "FigJam",
  ];

  const resources = [
    "Blog",
    "Best practices",
    "Colors",
    "Color wheel",
    "Support",
    "Developers",
    "Resource library",
  ];

  return (
    <footer className="bg-[#cfe7d9] w-screen min-h-screen relative border-t border-[#d9d9d9]">
      <div className="w-full h-full px-6 md:px-16 py-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-6">
            <p className="font-['Press_Start_2P',sans-serif] text-[#1e1e1e]">Home → Work</p>
            <div className="flex gap-3">
              <div className="size-10 rounded bg-black/10" aria-hidden="true" />
              <div className="size-10 rounded bg-black/10" aria-hidden="true" />
              <div className="size-10 rounded bg-black/10" aria-hidden="true" />
            </div>
          </div>

          <div>
            <p className="font-['Space_Mono',sans-serif] font-semibold text-[#1e1e1e] mb-4">Use cases</p>
            {["Online whiteboard", "Team collaboration"].map((label) => (
              <p key={label} className="font-['Space_Mono',sans-serif] text-[#1e1e1e] leading-[1.9]">
                {label}
              </p>
            ))}
          </div>

          <div>
            <p className="font-['Space_Mono',sans-serif] font-semibold text-[#1e1e1e] mb-4">Explore</p>
            {explore.map((label) => (
              <p key={label} className="font-['Space_Mono',sans-serif] text-[#1e1e1e] leading-[1.9]">
                {label}
              </p>
            ))}
          </div>

          <div>
            <p className="font-['Space_Mono',sans-serif] font-semibold text-[#1e1e1e] mb-4">Resources</p>
            {resources.map((label) => (
              <p key={label} className="font-['Space_Mono',sans-serif] text-[#1e1e1e] leading-[1.9]">
                {label}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}