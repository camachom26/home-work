"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Footer() {
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    return (
    <footer className="bg-[#cfe7d9] w-full border-t border-[#d9d9d9]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-8 md:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="flex flex-col gap-4">
                <p className="font-['Press_Start_2P',sans-serif] text-[12px] text-[#1e1e1e]">
                © {new Date().getFullYear()} Home → Work
                </p>
                <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-lg" aria-hidden="true">
                        <Image
                            src="/github.svg"
                            alt="Check out our github"
                            width={40}
                            height={100}
                            className="object-contain"
                        />
                    </div> 
                    <div className="h-8 w-8 rounded-lg" aria-hidden="true">
                        <Image
                            src="/devpost.png"
                            alt="Check out our devpost"
                            width={40}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden" aria-hidden="true">
                        <Image
                            src="/youtube.png"
                            alt="Watch our demo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </div> 
                </div>
        </div>
            <div className="flex flex-col gap-2 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e]">
                <p className="font-semibold">Explore</p>
                <Link href={`/${locale}/about`} className="text-[#4b4b4b] hover:text-black transition">
                    About
                </Link>
                <span className="opacity-70">Sign Up</span>
            </div>
            <div className="flex flex-col gap-2 font-['Space_Mono',sans-serif] text-[14px] text-[#1e1e1e]">
                <p className="font-semibold">Support</p>
                <span className="opacity-70">Feedback</span>
            </div>
            </div>
        </div>
    </footer>
  );
}