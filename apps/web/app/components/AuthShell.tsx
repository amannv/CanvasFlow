import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white bg-grid font-sans selection:bg-[#0099FF] selection:text-white px-5 py-8 sm:px-6">
      <section className="w-full max-w-md">{children}</section>
    </main>
  );
}
