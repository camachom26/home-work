"use client";

import type { Locale } from "@/i18n/routing";
import Hero from "@/app/components/Hero";
import { PanelImageContent } from "@/app/components/landing/PanelImageClient";
import { CardGridIcon } from "@/app/components/landing/CardGridIcon";

export default function LandingClient({ locale }: { locale: Locale }) {
  return (
    <div className="w-full">
      <Hero locale={locale} />
      <PanelImageContent />
      <CardGridIcon />
    </div>
  );
}