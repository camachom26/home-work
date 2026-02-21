"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { locales, type Locale } from "@/i18n/routing";

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Remove current locale from path
  const pathWithoutLocale = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-[8px] border border-black/20 bg-white/60 hover:bg-black/5 font-['Space_Mono',sans-serif] text-[14px]"
        aria-label="Language"
      >
        {/* Globe icon */}
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
        </svg>

        <span className="hidden sm:inline">Language</span>
        <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-[12px] border border-black/10 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.15)] overflow-hidden z-50">
          {locales.map((loc) => (
            <Link
              key={loc}
              href={`/${loc}${pathWithoutLocale}`}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 font-['Space_Mono',sans-serif] text-[14px] hover:bg-black/5 ${
                loc === currentLocale ? "bg-black/5 font-semibold" : ""
              }`}
            >
              {loc === "en" ? "English" : "Español"}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}