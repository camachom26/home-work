"use client";

export function SurveyShell({
  title,
  subtitle,
  step,
  total,
  children
}: {
  title: string;
  subtitle?: string;
  step: number;
  total: number;
  children: React.ReactNode;
}) {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="w-full">
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-8 pt-10 md:pt-14 pb-4">
          <div className="rounded-[28px] bg-white/80 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-6 md:p-10">
            <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.4vw,34px)] leading-[1.2]">
              {title}
            </p>

            {subtitle && (
              <p className="mt-4 font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.5] max-w-3xl">
                {subtitle}
              </p>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">
                  Step {step} / {total}
                </p>
                <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[13px]">
                  {pct}%
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full bg-black/80 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-8 pt-0 pb-10 md:pb-14">
          <div className="rounded-[28px] bg-white/80 backdrop-blur-sm border border-black/10 shadow-[0px_10px_30px_rgba(0,0,0,0.12)]">
            <div className="p-6 md:p-10">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function PrimaryButton({
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
      className={[
        "w-full sm:w-auto rounded-full px-6 py-3 transition",
        "font-['Press_Start_2P',sans-serif] text-[12px]",
        disabled ? "bg-black/70 text-white cursor-not-allowed" : "bg-[#1e1e1e] hover:bg-black text-white"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
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

export function Pill({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-full border transition text-left",
        "font-['Space_Mono',sans-serif] text-[14px] sm:text-[15px]",
        active
          ? "bg-black text-white border-black"
          : "bg-white/70 border-black/15 hover:bg-white hover:border-black/25 text-[#1e1e1e]"
      ].join(" ")}
    >
      {children}
    </button>
  );
}