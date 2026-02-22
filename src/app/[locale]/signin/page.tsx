"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams, useParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const locale = (params?.locale as string) || "en";

const redirectUrl = searchParams.get("redirect_url") || `/${locale}/dashboard`;
  return (
    <div
      className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage: "url('/Clouds_2.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >

      {/* Content */}
      <div className="relative z-10">
        <SignIn
          afterSignInUrl={redirectUrl}
          afterSignUpUrl={redirectUrl}
        />
      </div>
    </div>
  );
}