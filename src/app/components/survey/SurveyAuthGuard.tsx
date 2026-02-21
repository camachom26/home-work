"use client";

import React from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";

export default function SurveyAuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return null;

  if (!userId) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6">
        <div className="relative w-full max-w-md rounded-[28px] bg-white shadow-[0px_20px_60px_rgba(0,0,0,0.30)] p-10 text-center">
          <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(14px,1.8vw,20px)] leading-[1.3]">
            Sign in required
          </p>
          <p className="mt-5 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] leading-[1.7]">
            Create an account or sign in to take the survey and save your progress.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full rounded-xl border border-black bg-black text-white hover:bg-black/80 px-4 py-4 font-['Space_Mono',sans-serif] text-[14px] transition"
              >
                Sign in →
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
