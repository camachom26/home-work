"use client";

import {usePathname} from "next/navigation";
import Link from "next/link";
import {locales, type Locale} from "@/i18n/routing";

export function LocaleSwitcher({currentLocale}: {currentLocale: Locale}) {
  const pathname = usePathname(); // e.g. /en/examples/landing

  const pathWithoutLocale = pathname.replace(/^\/(en|es)(?=\/|$)/, "");

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${pathWithoutLocale}`}
          className={loc === currentLocale ? "underline" : ""}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}