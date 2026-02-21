import type { Locale } from "@/i18n/routing";
import LandingClient from "./LandingClient";

export default async function LandingPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <LandingClient locale={locale} />;
}