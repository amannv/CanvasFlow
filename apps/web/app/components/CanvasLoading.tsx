export function CanvasLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0a0a0a] px-6 text-center text-white">
      <div className="flex flex-col items-center">
        <div className="relative mb-7 grid size-14 place-items-center">
          <div className="absolute inset-0 animate-spin rounded-full border border-white/10 border-t-[#38bdf8]" />
          <div className="size-2 rounded-full bg-[#38bdf8] shadow-[0_0_18px_rgba(56,189,248,0.8)]" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#38bdf8]">
          CanvasFlow
        </p>
        <h1 className="font-eb-garamond text-3xl">Opening your canvas</h1>
        <p className="mt-2 text-sm text-white/45">
          Preparing a shared space for your ideas.
        </p>
      </div>
    </main>
  );
}
