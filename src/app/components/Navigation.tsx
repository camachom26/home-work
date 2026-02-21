"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import type { Locale } from "@/i18n/routing";
import { LocaleSwitcher } from "@/app/components/LocaleSwitcher";

/**
 * Navigation features:
 * - Sticky scroll behavior (adds shadow/backdrop on scroll)
 * - Mobile hamburger menu (drawer-style)
 * - Clerk auth integration (Sign in + User button)
 * - Language switcher (dropdown with globe)
 */

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function NavLinks({
  onNavigate,
  className,
  locale
}: {
  onNavigate?: () => void;
  className?: string;
  locale: Locale;
}) {
  const links = useMemo(
    () => [
      { href: `/${locale}/about`, label: "About" },
      { href: `/${locale}/resources`, label: "Resources" },
      { href: `/${locale}/feedback`, label: "Feedback" }
    ],
    [locale]
  );

  return (
    <nav className={className}>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className="px-3 py-2 rounded-[8px] font-['Space_Mono',sans-serif] text-[16px] text-[#1e1e1e] hover:bg-black/5 transition"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function AuthArea({ onNavigate, locale }: { onNavigate?: () => void; locale: Locale }) {
  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <SignInButton mode="modal">
          <button
            onClick={onNavigate}
            className="bg-[#e3e3e3] px-4 py-2 rounded-[8px] font-['Space_Mono',sans-serif] text-[16px] text-[#1e1e1e] border border-[#767676]"
          >
            Sign in
          </button>
        </SignInButton>

        {/* If you actually have /[locale]/register, keep this.
            If you use Clerk's /sign-up, swap to `href={`/${locale}/sign-up`}` or `/sign-up` based on your setup. */}
        <Link
          href={`/${locale}/register`}
          onClick={onNavigate}
          className="bg-[#2c2c2c] px-4 py-2 rounded-[8px] font-['Space_Mono',sans-serif] text-[16px] text-[#f5f5f5]"
        >
          Register
        </Link>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl={`/${locale}`} />
      </SignedIn>
    </div>
  );
}

export default function Navigation({ locale }: { locale: Locale }) {
  const scrolled = useScrolled(10);
  const [open, setOpen] = useState(false);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b border-[#d9d9d9]",
        scrolled ? "bg-[#f2e4e0]/85 backdrop-blur shadow-sm" : "bg-[#f2e4e0]"
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="relative w-[24px] h-[35px]">
            <Image
              src="/landing/icon.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-['Press_Start_2P',sans-serif] text-[12px] text-[#1e1e1e]">
            Home → Work
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks locale={locale} className="flex items-center gap-2" />

          {/* ✅ existing dropdown/globe LocaleSwitcher */}
          <LocaleSwitcher currentLocale={locale} />

          <AuthArea locale={locale} />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          {/* ✅ existing dropdown/globe LocaleSwitcher */}
          <LocaleSwitcher currentLocale={locale} />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 w-10 rounded-lg border border-black/20 bg-white/60 hover:bg-black/5 flex items-center justify-center"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[2px] bg-black mb-1" />
            <span className="block w-5 h-[2px] bg-black mb-1" />
            <span className="block w-5 h-[2px] bg-black" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#f2e4e0] shadow-xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-['Press_Start_2P',sans-serif] text-[12px]">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-lg border border-black/20 bg-white/60 hover:bg-black/5 flex items-center justify-center"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <NavLinks
              locale={locale}
              onNavigate={() => setOpen(false)}
              className="flex flex-col items-start gap-2"
            />

            <div className="pt-2 border-t border-black/10 flex flex-col gap-4">
              <AuthArea locale={locale} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}