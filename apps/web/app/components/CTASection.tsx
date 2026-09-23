"use client";

import { ArrowRight, Rocket, PenTool, MousePointer2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CTASection() {
  const router = useRouter();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 mt-32 pb-32">
      <div className="relative flex flex-col items-center justify-center rounded-3xl border-4 border-black bg-[#0099FF] px-8 py-16 shadow-[8px_8px_0px_0px_#000000] sm:px-16 sm:py-24 text-center overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-12 -right-12 text-black/5 rotate-12">
          <PenTool size={200} strokeWidth={1} />
        </div>
        <div className="absolute -bottom-12 -left-12 text-black/5 -rotate-12">
          <MousePointer2 size={200} strokeWidth={1} />
        </div>

        <h2 className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl lg:text-6xl">
          <Rocket className="hidden sm:block text-white fill-white" size={48} strokeWidth={2} />
          Start Whiteboarding Today
          <Rocket className="hidden sm:block text-white fill-white" size={48} strokeWidth={2} />
        </h2>
        <p className="relative z-10 mt-6 max-w-2xl font-mono text-base font-bold text-white/90 sm:text-lg">
          Ditch the messy notebooks. Plan, sketch, and collaborate in real-time on an infinite digital canvas.
        </p>
        <div className="relative mt-10">
          <div className="absolute -right-6 -top-5 z-20 rotate-12 rounded-lg border-2 border-black bg-white px-3 py-1 font-mono text-sm font-black text-black shadow-[2px_2px_0px_0px_#000000] animate-bounce">
            IT'S FREE!
          </div>
          <button
            onClick={handleGetStarted}
            className="relative z-10 flex h-16 items-center justify-center gap-2 rounded-2xl border-4 border-black bg-white px-10 font-mono text-lg font-bold text-black shadow-[4px_4px_0px_0px_#000000] transition-all hover:-translate-y-1 hover:translate-x-1 hover:bg-black hover:text-white"
          >
            GET STARTED NOW
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
