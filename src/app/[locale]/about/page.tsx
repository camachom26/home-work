// src/app/[locale]/about/page.tsx
"use client";

import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  title,
  subtitle,
  right,
  children
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-white/80 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)]">
      {(title || subtitle || right) && (
        <div className="p-6 md:p-8 border-b border-black/10">
          <div className="flex items-start justify-between gap-4">
            <div>
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
            {right}
          </div>
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
        "w-full sm:w-auto rounded-full px-6 py-3 transition",
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
      className="w-full sm:w-auto rounded-full border border-black/30 bg-white/70 hover:bg-white px-6 py-3 font-['Press_Start_2P',sans-serif] text-[12px] text-[#1e1e1e]"
    >
      {children}
    </button>
  );
}

function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-4 py-2 rounded-full border border-black/15 bg-white/60 font-['Space_Mono',sans-serif] text-[13px] sm:text-[14px] text-[#1e1e1e]">
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div
      className="w-full bg-fixed bg-[length:100%_auto] bg-top bg-no-repeat"
      style={{ backgroundImage: "url('/Summer6.png')" }}
    >
      {/* keep background crisp; light overlay only */}
      <div className="w-full bg-white/10">
        {/* Header */}
        <header className="w-full">
          <div className="mx-auto max-w-7xl px-6 md:px-8 pt-10 md:pt-14 pb-4">
            <div className="rounded-[28px] bg-white/70 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.2vw,30px)] leading-[1.2]">
                    About
                  </p>
                  <p className="mt-4 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.6]">
                    Many valuable skills go unrecognized, especially those developed through caregiving, household management, 
                    and community support. These abilities require organization, leadership, problem-solving,
                     and resilience, yet they are often undervalued. The goal is to highlight the true economic and professional value of
                      these skills and provide accessible tools that make job discovery, matching, and 
                      opportunity more attainable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="w-full">
          <div className="mx-auto max-w-7xl px-6 md:px-8 pt-2 md:pt-4 pb-10 md:pb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left column */}
              <div className="lg:col-span-8 space-y-6">
                {/* <Card
                  title="What this is"
                  subtitle="One or two sentences that explain the purpose in plain language."
                >
                  <div className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                    <p className="font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] leading-[1.8]">
                      Write your overview here. Keep it short, friendly, and specific.
                    </p>
                  </div>
                </Card> */}

                <Card
                  title="How it Works"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Step 1: Take the survey", body: "Answer a few questions about what you do day to day and turn it into a skills profile." },
                      { title: "Step 2: Get matches", body: "See job paths picked for you, with a match score, pay range, and remote fit." },
                      { title: "Step 3: Save your favorites", body: "Choose job paths you like and they show up on your dashboard as your targets." },
                      { title: "Step 4: Make a plan & take action", body: "Set your wage/budget, save training options, and start applying!" }
                    ].map((s) => (
                      <div key={s.title} className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.3]">
                          {s.title}
                        </p>
                        <p className="mt-3 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[13px] leading-[1.7]">
                          {s.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  title="FAQ"                >
                  <div className="space-y-3">
                    {[
                      { q: "Who is this for?", a: "Anyone whose skills do not always show up clearly on a traditional résumé, especially caregivers, community organizers, and people re entering the workforce. If you have been doing real work that just has not been recognized, this is for you." },
                      { q: "Do I need a resume to use this?", a: "No, you can start with the survey. We focus on your real life skills first and help you build from there." },
                      { q: "What does it do with my data?", a: "We use your answers to generate job matches and improve your experience. We do not sell your personal information. Your information stays focused on helping you move forward." },
                      { q: "What if I do not have formal work experience?", a: "That is completely okay. Household management, caregiving, budgeting, coordination, and problem solving all count. Those skills are real and transferable."},
                      { q: "Can I change my results later?", a: "Retake the survey anytime to refresh your matches and adjust your path as your goals evolve."}

                    ].map((item) => (
                      <div key={item.q} className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.35]">
                          {item.q}
                        </p>
                        <p className="mt-3 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[13px] leading-[1.7]">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right column */}
              <div className="lg:col-span-4 space-y-6">
                <Card
                  title="Project Values"
                >
                  <div className="space-y-3">
                    {[
                      { title: "Growth", body: "People are always evolving, skills can expand, adapt, and be repositioned." },
                      { title: "Recognition", body: "Every skill has value. Organization, budgeting, negotiation, time management, caregiving; these are real, transferable abilities." },
                      { title: "Economic Empowerment", body: "Skills should translate into opportunity, because everyone deserves access to income pathways that reflect their real contributions." },
                      { title: "Accessibility", body: "Career tools should be simple, clear, and not intimidating." }

                    ].map((v) => (
                      <div key={v.title} className="rounded-[22px] bg-white/70 border border-black/10 p-5">
                        <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.3]">
                          {v.title}
                        </p>
                        <p className="mt-3 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[13px] leading-[1.7]">
                          {v.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
{/* 
                <div className="rounded-[28px] bg-white/70 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-8">
                  <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[12px] leading-[1.4]">
                    Quick actions
                  </p>

                  <div className="mt-4 space-y-2">
                    <SecondaryButton onClick={() => alert("Hook: resources")}>Resources</SecondaryButton>
                    <SecondaryButton onClick={() => alert("Hook: feedback")}>Feedback</SecondaryButton>
                    <PrimaryButton onClick={() => alert("Hook: dashboard")}>Go to dashboard</PrimaryButton>
                  </div>

                  <p className="mt-4 font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[12px] leading-[1.6]">
                    Tip: keep this page lightweight—just enough for someone to understand the project in under a minute.
                  </p>
                </div> */}
              </div>
            </div>

            <footer className="mt-8">
              <p className="font-['Space_Mono',sans-serif] text-[12px] text-black/50">
                © Winghacks 2026: Mia Camacho, Jade Xu, Daniel Lipszyc, Celia Mercier
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}