export function TextContentFlow() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <p className="font-['Press_Start_2P',sans-serif] text-[#0c0c0d] text-[clamp(18px,2.2vw,30px)] leading-[1.2]">
          Heading
        </p>
        <p className="font-['Space_Mono',sans-serif] text-[#4b4b4b] text-[14px] sm:text-[16px] leading-[1.5]">
          Subheading
        </p>
      </div>

      <p className="font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.65]">
        Body text for your whole article or post. We’ll put in some lorem ipsum to show how a filled-out page might look:
      </p>

      <p className="font-['Space_Mono',sans-serif] text-[#1e1e1e] text-[14px] sm:text-[16px] leading-[1.65]">
        Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi
        intricate Content. Qui international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure.
      </p>
    </div>
  );
}