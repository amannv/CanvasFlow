"use client";

import { Card } from "@repo/ui/components/ui/card";
import { Users, Pen, Trash2, Calendar, Square, Circle, Slash } from "lucide-react";
import React from "react";

export type RoomCardRoom = {
  id: number;
  slug: string;
  createdAt: string;
};

const shapes = [
  { Icon: Square, bg: "bg-[#0099FF] text-white" },
  { Icon: Circle, bg: "bg-[#0099FF] text-white" },
  { Icon: Slash, bg: "bg-[#0099FF] text-white" },
];

export function RoomCard({
  room,
  onOpen,
  onShare,
  onDelete,
}: {
  room: RoomCardRoom;
  onOpen: () => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  const theme = shapes[room.id % shapes.length];
  const Icon = theme?.Icon || Square;
  const bgClass = theme?.bg || "bg-[#0099FF] text-white";


  const title = room.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare();
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Card 
      onClick={onOpen}
      className="flex flex-col bg-[#ffffff] border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[12px_12px_0px_0px_#000000] transition-all overflow-hidden p-6 gap-6 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div
          className={`grid place-items-center size-12 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] shrink-0 ${bgClass}`}
        >
          <Icon size={20} strokeWidth={3} />
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <h3 className="truncate font-sans font-black uppercase text-lg text-black tracking-tight">
            {title}
          </h3>
          <p className="truncate font-mono text-xs font-bold text-black/60">
            /{room.slug}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-black/60">
          <Calendar size={12} strokeWidth={3} />
          <span className="uppercase">
            {new Date(room.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="grid size-8 place-items-center rounded-lg border-2 border-transparent hover:border-black hover:bg-black/5 text-black transition-all"
            title="Share"
          >
            <Users size={14} strokeWidth={3} />
          </button>
          <button
            onClick={handleOpen}
            className="grid size-8 place-items-center rounded-lg border-2 border-transparent hover:border-black hover:bg-black/5 text-black transition-all"
            title="Open"
          >
            <Pen size={14} strokeWidth={3} />
          </button>
          <button
            onClick={handleDelete}
            className="grid size-8 place-items-center rounded-lg border-2 border-transparent hover:border-black hover:bg-red-500 hover:text-white text-black transition-all"
            title="Delete"
          >
            <Trash2 size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </Card>
  );
}
