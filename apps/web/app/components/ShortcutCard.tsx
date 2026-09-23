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
    <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000000] transition-transform hover:-translate-y-2 hover:translate-x-2 h-full flex flex-col cursor-default text-left">
      <div className={`mb-4 inline-flex self-start items-center justify-center rounded-xl border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000000] ${bgColor}`}>
        <div className="flex flex-wrap items-center gap-1.5">
          {keys.map((key, index) => (
            <React.Fragment key={index}>
              <kbd className="flex h-7 min-w-7 px-2 items-center justify-center rounded-md border-b-2 border-r-2 border border-black bg-white font-mono font-bold text-black text-xs">
                {key}
              </kbd>
              {index < keys.length - 1 && (
                <span className={`font-black text-sm ${textColor}`}>+</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <h3 className="mb-2 font-mono text-xl font-black uppercase text-black">{title}</h3>
      <p className="font-mono text-sm font-bold text-black/70 flex-1">
        {description}
      </p>
    </div>
  );
}
