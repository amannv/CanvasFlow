import type { ReactNode } from "react";

export function AuthShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="auth-page grid min-h-screen place-items-center bg-[#000000] px-5 py-8 sm:px-6">
      <section className="w-full max-w-md">
        {children}
      </section>
    </main>
  );
}
