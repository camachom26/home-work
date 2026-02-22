"use client";

import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function SurveyAuthGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.replace(
        `/${locale}/signin?redirect_url=${encodeURIComponent(pathname)}`
      );
    }
  }, [isLoaded, userId, router, pathname, locale]);

  if (!isLoaded || !userId) return null;

  return <>{children}</>;
}