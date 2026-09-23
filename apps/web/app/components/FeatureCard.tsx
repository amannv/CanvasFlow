import React from "react";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000000] transition-transform hover:-translate-y-2 hover:translate-x-2 h-full flex flex-col">
      <div className="mb-4 inline-flex self-start items-center justify-center rounded-xl border-2 border-black bg-[#0099FF] p-3 shadow-[4px_4px_0px_0px_#000000]">
        {icon}
      </div>
      <h3 className="mb-2 font-mono text-xl font-black uppercase text-black">{title}</h3>
      <p className="font-mono text-sm font-bold text-black/70 flex-1">
        {description}
      </p>
    </div>
  );
}
