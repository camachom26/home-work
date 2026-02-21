"use client";

export default function Footer() {

  return (
    <footer className="bg-[#cfe7d9] w-full border-t border-[#d9d9d9]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-8 md:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="flex flex-col gap-4">
                <p className="font-['Press_Start_2P',sans-serif] text-[12px] text-[#1e1e1e]">
                Home → Work
                </p>

                <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-black/10" aria-hidden="true" />
                <div className="h-8 w-8 rounded-lg bg-black/10" aria-hidden="true" />
                <div className="h-8 w-8 rounded-lg bg-black/10" aria-hidden="true" />
                </div>
            </div>

            {/* Example columns */}
            <div className="flex flex-col gap-2 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e]">
                <p className="font-semibold">Explore</p>
                <span className="opacity-70">About</span>
                <span className="opacity-70">Resources</span>
            </div>

            <div className="flex flex-col gap-2 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e]">
                <p className="font-semibold">Support</p>
                <span className="opacity-70">Help</span>
                <span className="opacity-70">Contact</span>
            </div>

            <div className="flex flex-col gap-2 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e]">
                <p className="font-semibold">Legal</p>
                <span className="opacity-70">Privacy</span>
                <span className="opacity-70">Terms</span>
            </div>
            </div>
        </div>
    </footer>
  );
}