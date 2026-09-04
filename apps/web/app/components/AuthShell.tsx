import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="auth-page min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden border border-white/10 bg-[#111111] lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden border-r border-white/10 bg-[#0a0a0a] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-[#f4f0e6]">
              <span className="grid size-8 place-items-center bg-[#38bdf8] text-[#0a0a0a]"><Sparkles size={15} /></span>
              CANVASFLOW
            </Link>
            <div className="mt-28 max-w-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-[#38bdf8]">A quieter place to think</p>
              <h2 className="mt-5 font-eb-garamond text-6xl leading-[0.95] text-[#f4f0e6]">Make room for the good ideas.</h2>
              <p className="mt-6 max-w-xs text-sm leading-7 text-white/55">Sketch together, keep the thread, and return to the work when it is ready.</p>
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between text-xs text-white/35">
            <span>CanvasFlow / 2026</span>
            <ArrowUpRight size={16} />
          </div>
        </aside>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-[#f4f0e6]">
                <span className="grid size-8 place-items-center bg-[#38bdf8] text-[#0a0a0a]"><Sparkles size={15} /></span>
                CANVASFLOW
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#38bdf8]">{eyebrow}</p>
            <h1 className="mt-3 font-eb-garamond text-5xl leading-none text-[#f4f0e6]">{title}</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
