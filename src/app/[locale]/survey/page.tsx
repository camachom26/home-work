import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";

export default async function SurveyIndex({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/survey/step-1`);
}