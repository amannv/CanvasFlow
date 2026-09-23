import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t-4 border-black bg-white py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          href="/"
          className="text-2xl font-black uppercase tracking-widest text-black"
        >
          Canvas<span className="text-[#0099FF]">Flow</span>
        </Link>

        <p className="font-mono text-sm font-bold text-black/70 text-center">
          &copy; {new Date().getFullYear()} CanvasFlow. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/amannv/CanvasFlow"
            target="_blank"
            rel="noreferrer"
            className="text-black hover:text-[#0099FF] transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://x.com/amanntwt"
            target="_blank"
            rel="noreferrer"
            className="text-black hover:text-[#0099FF] transition-colors"
          >
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
