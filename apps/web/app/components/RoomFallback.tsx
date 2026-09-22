import Link from "next/link";

export function RoomFallback({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white bg-grid px-6 font-sans selection:bg-[#0099FF] selection:text-white">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0px_0px_#000000]">
        <div className="mb-6 grid size-16 place-items-center rounded-xl border-4 border-black bg-red-500 text-white shadow-[4px_4px_0px_0px_#000000]">
          <span className="text-4xl font-black">!</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">
          Unable to open room
        </h1>
        <p className="mt-4 font-mono text-sm font-bold leading-relaxed text-black/70">
          {message}
        </p>
        <Link
          href="/dashboard"
          className="mt-8 flex w-full items-center justify-center rounded-xl border-2 border-black bg-black px-6 py-4 font-mono text-sm font-bold text-white shadow-[4px_4px_0px_0px_#0099FF] transition-transform hover:-translate-y-1 hover:translate-x-1"
        >
          BACK TO DASHBOARD
        </Link>
      </div>
    </main>
  );
}
