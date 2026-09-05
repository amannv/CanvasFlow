"use client";

import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/button";
import { Copy, ExternalLink, MoreVertical, Trash2 } from "lucide-react";

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
    <Card className="group overflow-hidden rounded-lg border-white/10 bg-[#111111] p-0 shadow-none transition-colors hover:border-[#38bdf8]/45">
      <button
        onClick={onOpen}
        className="block w-full text-left"
        aria-label={`Open ${room.slug}`}
      >
        <div className="room-preview h-28 border-b border-white/10" />
        <CardContent className="flex items-center justify-between px-3 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-[#f4f0e6]">
              {room.slug}
            </h3>
            <p className="mt-1 text-[11px] text-white/40">
              {new Date(room.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </button>
      <div className="flex items-center justify-end gap-1 border-t border-white/10 px-2 py-1 opacity-60 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onShare}
          title="Share room"
          className="rounded-md text-white/45 hover:bg-transparent hover:text-[#38bdf8]"
        >
          <Copy />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onOpen}
          title="Open room"
          className="rounded-md text-white/45 hover:bg-transparent hover:text-[#38bdf8]"
        >
          <ExternalLink />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          title="Delete room"
          className="rounded-md text-white/35 hover:bg-transparent hover:text-red-300"
        >
          <Trash2 />
        </Button>
      </div>
    </Card>
  );
}
