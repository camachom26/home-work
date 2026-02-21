"use client";

import React, { useState } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  title,
  subtitle,
  children
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-white/80 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)]">
      {(title || subtitle) && (
        <div className="p-6 md:p-8 border-b border-black/10">
          {title && (
            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(14px,1.6vw,22px)] leading-[1.2]">
              {title}
            </p>
          )}
          {subtitle && (
            <p className="mt-3 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px] sm:text-[14px] leading-[1.6] max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-full px-6 py-3 transition",
        "font-['Press_Start_2P',sans-serif] text-[12px]",
        disabled ? "bg-black/30 text-white cursor-not-allowed" : "bg-[#1e1e1e] hover:bg-black text-white"
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-black/30 bg-white/70 hover:bg-white px-6 py-3 font-['Press_Start_2P',sans-serif] text-[12px] text-[#1e1e1e]"
    >
      {children}
    </button>
  );
}

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
    const handleSubmit = async () => {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (res.ok) {
    alert("Feedback sent!");
    setMessage("");
  } else {
    alert("Something went wrong.");
  }
};
  return (
    <div
      className="w-full bg-fixed bg-[length:100%_auto] bg-top bg-no-repeat"
      style={{ backgroundImage: "url('/surveybackground.png')" }}
    >
      <div className="w-full bg-white/10">
        {/* Header */}
        <header className="w-full">
          <div className="mx-auto max-w-7xl px-6 md:px-8 pt-10 md:pt-14 pb-4">
            <div className="rounded-[28px] bg-white/70 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-10">
              <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.2vw,30px)] leading-[1.2]">
                Feedback
              </p>
              <p className="mt-4 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.6]">
                Share your thoughts, suggestions, or ideas. Your perspective helps improve the experience.
              </p>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="w-full">
              {/* Left column */}
              <div className="mx-auto max-w-7xl px-6 md:px-8 pt-8 md:pt-10 pb-4">
                <Card
                  title="Your feedback"
                  subtitle="Be specific. Even small suggestions make a difference."
                >
                  <div className="space-y-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your thoughts here..."
                      className="w-full min-h-[160px] rounded-[22px] bg-white/70 border border-black/10 p-5 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e] focus:outline-none focus:border-black/30 resize-none"
                    />
                    <div className="flex gap-4">
                      <SecondaryButton onClick={() => setMessage("")}>
                        Clear
                      </SecondaryButton>
                      <PrimaryButton onClick={handleSubmit}>
                        Submit
                      </PrimaryButton>
                    </div>
                  </div>
                </Card>
              </div>

            <footer className="mt-8">
              <p className="font-['Space_Mono',sans-serif] text-[12px] text-black/50">
                © Winghacks 2026: Mia Camacho, Jade Xu, Daniel Lipszyc, Celia Mercier
              </p>
            </footer>
        </main>
      </div>
    </div>
  );
}