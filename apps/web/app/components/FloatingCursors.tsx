"use client";

import { useEffect, useState } from "react";
import { MousePointer2 } from "lucide-react";

type FloatingCursor = {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
};

const initialCursors: FloatingCursor[] = [
  { id: "1", name: "Aman", color: "#fb7185", x: 25, y: 35 },
  { id: "2", name: "Suraj", color: "#38bdf8", x: 65, y: 55 },
  { id: "3", name: "Naman", color: "#a3e635", x: 40, y: 65 },
];

export function FloatingCursors() {
  const [cursors, setCursors] = useState<FloatingCursor[]>(initialCursors);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((cursor) => {
          // Generate new positions within safer bounds (e.g., X: 20-75%, Y: 30-65%)
          // to prevent them from going over the toolbar at the top, bottom, or sides.
          const newX = Math.max(20, Math.min(75, cursor.x + (Math.random() * 20 - 10)));
          const newY = Math.max(30, Math.min(65, cursor.y + (Math.random() * 20 - 10)));
          
          return {
            ...cursor,
            x: newX,
            y: newY,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="pointer-events-none absolute transition-all duration-[2000ms] ease-in-out"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
        >
          <MousePointer2
            size={32}
            strokeWidth={2.5}
            fill={cursor.color}
            color="#000000"
            className="-rotate-12"
            style={{ filter: "drop-shadow(1px 1px 0px #000000)" }}
          />
          <div
            className="absolute left-6 top-6 whitespace-nowrap rounded-md border-2 border-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_#000000]"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
}
