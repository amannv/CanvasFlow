import React from "react";

export interface ShortcutCardProps {
  keys: string[];
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

export function ShortcutCard({ keys, title, description, bgColor, textColor }: ShortcutCardProps) {
  return (
    <div className="flex flex-col items-center text-center justify-start gap-3 rounded-xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:translate-x-1 w-full h-full cursor-default">
      <div className={`inline-flex shrink-0 items-center justify-center rounded-lg border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000000] ${bgColor} w-full`}>
        <div className="flex flex-wrap justify-center gap-1 items-center">
          {keys.map((key, index) => (
            <React.Fragment key={index}>
              <kbd className="flex h-7 px-1.5 items-center justify-center rounded-md border-b-2 border-r-2 border border-black bg-white font-mono font-bold text-black text-[10px] sm:text-xs">
                {key}
              </kbd>
              {index < keys.length - 1 && (
                <span className={`font-black text-xs sm:text-sm ${textColor}`}>+</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 w-full flex-1 justify-center mt-2">
        <h3 className="font-mono text-sm font-black uppercase text-black">{title}</h3>
        <p className="font-mono text-[11px] sm:text-xs font-bold text-black/60 leading-tight">
          {description}
        </p>
      </div>
    </div>
  );
}
