"use client";

import { Card, CardContent, CardFooter } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/button";
import { Copy, ExternalLink, Trash2 } from "lucide-react";

export type RoomCardRoom = {
  id: number;
  slug: string;
  createdAt: string;
};

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
  return (
    <Card className="overflow-hidden rounded-none border-white/10 bg-[#111111] py-0 shadow-none transition-colors hover:border-[#38bdf8]/45">
      <button onClick={onOpen} className="block w-full text-left" aria-label={`Open ${room.slug}`}>
        <div className="room-preview h-28 border-b border-white/10" />
        <CardContent className="px-5 py-5">
          <h3 className="truncate font-eb-garamond text-2xl text-[#f4f0e6]">{room.slug}</h3>
          <p className="mt-1 text-xs text-white/40">Created {new Date(room.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </button>
      <CardFooter className="justify-between border-t border-white/10 bg-transparent px-5 py-3">
        <Button type="button" variant="ghost" size="sm" onClick={onShare} className="rounded-none px-1 text-xs text-white/55 hover:bg-transparent hover:text-[#38bdf8]">
          <Copy /> Share
        </Button>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon-sm" onClick={onOpen} title="Open room" className="rounded-none text-white/45 hover:bg-transparent hover:text-[#38bdf8]">
            <ExternalLink />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onDelete} title="Delete room" className="rounded-none text-white/35 hover:bg-transparent hover:text-red-300">
            <Trash2 />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
