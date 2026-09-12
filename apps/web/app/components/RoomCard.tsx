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
    <Card className="group flex flex-col justify-between p-4 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border)]">
      <button
        onClick={onOpen}
        className="block w-full text-left outline-none"
        aria-label={`Open ${room.slug}`}
      >
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-foreground">
            {room.slug}
          </h3>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {new Date(room.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </button>
      <div className="mt-4 flex items-center justify-end gap-2 opacity-60 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onShare}
          title="Share room"
        >
          <Copy />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onOpen}
          title="Open room"
        >
          <ExternalLink />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onDelete}
          title="Delete room"
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 />
        </Button>
      </div>
    </Card>
  );
}
