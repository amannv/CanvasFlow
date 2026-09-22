"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Hero() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    if (roomId.trim()) {
      router.push(`/canvas/${roomId.trim()}`);
    }
  };

  const handleDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white bg-grid font-sans selection:bg-[#0099FF] selection:text-white pb-20">
      
      {/* Floating Top Navbar / Header area for the landing page */}
      <div className="mx-auto w-full max-w-7xl pt-6 px-6 lg:px-12">
        <header className="flex items-center justify-between rounded-2xl border-4 border-black bg-white px-6 py-4 shadow-[4px_4px_0px_0px_#000000] lg:px-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-black">
            Canvas<span className="text-[#0099FF]">Flow</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/signin"
              className="hidden sm:block font-mono text-sm font-bold text-black hover:underline underline-offset-4"
            >
              LOGIN
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl border-2 border-black bg-black px-4 py-2 font-mono text-sm font-bold text-white shadow-[4px_4px_0px_0px_#0099FF] transition-transform hover:-translate-y-1 hover:translate-x-1"
            >
              SIGN UP
            </Link>
          </div>
        </header>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 mt-12 sm:mt-14">
        <div className="mx-auto w-full max-w-5xl text-center z-10">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 font-mono text-xs font-bold text-black shadow-[4px_4px_0px_0px_#000000] mb-8">
          <Sparkles size={16} className="text-[#0099FF]" strokeWidth={3} />
          <span>THE ULTIMATE WHITEBOARDING TOOL</span>
        </div>

        <h2 className="text-5xl font-black uppercase tracking-tighter text-black sm:text-7xl lg:text-8xl">
          THINK. DRAW. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0099FF] to-[#0055FF]">COLLABORATE.</span>
        </h2>
        
        <p className="mx-auto mt-8 max-w-2xl font-mono text-base font-bold leading-relaxed text-black/70 sm:text-lg">
          CanvasFlow is the open-source whiteboarding tool that lets you sketch your ideas, map out architectures, and collaborate with your team in real-time.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <button
            onClick={handleDashboard}
            className="flex items-center justify-center gap-2 rounded-2xl border-4 border-black bg-[#0099FF] px-8 py-4 font-mono text-lg font-bold text-white shadow-[8px_8px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:translate-x-1 h-18"
          >
            GO TO DASHBOARD
            <ArrowRight size={24} strokeWidth={3} />
          </button>

          <form onSubmit={handleJoin} className="flex h-18 items-center gap-2 rounded-2xl border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:translate-x-1">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID..."
              className="h-full w-40 sm:w-48 rounded-xl border-2 border-transparent bg-black/5 px-4 font-mono text-sm font-bold text-black placeholder:text-black/40 outline-none focus:border-[#0099FF] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="flex h-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-6 font-mono text-sm font-bold text-white transition-colors hover:bg-black/80"
            >
              JOIN
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </form>
        </div>

        {/* Screenshot Section */}
        <div className="mt-16 mx-auto max-w-5xl rounded-3xl border-4 border-black bg-white p-2 sm:p-4 shadow-[8px_8px_0px_0px_#000000] overflow-hidden transform transition-transform hover:-translate-y-2 hover:translate-x-2 duration-300">
          <div className="relative w-full aspect-video rounded-xl border-2 border-black overflow-hidden bg-gray-100">
            <img 
              src="/canvas-screenshot.png" 
              alt="CanvasFlow Digital Whiteboard" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
