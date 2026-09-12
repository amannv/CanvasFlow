"use client";

import axios from "axios";
import { LogOut, Plus, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config/config";
import { RoomCard } from "../components/RoomCard";
import { RoomDeleteDialog } from "../components/RoomDeleteDialog";
import { toast } from "@repo/ui/components/ui/sonner";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

type Room = {
  id: number;
  slug: string;
  createdAt: string;
};

function authConfig() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [slug, setSlug] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [activeAction, setActiveAction] = useState<"create" | "join" | null>(
    null,
  );

  const loadRooms = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/rooms`, authConfig());
      setRooms(response.data.rooms ?? []);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/signin");
        return;
      }
      toast.error("Could not load your rooms.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/signin");
      return;
    }
    setAuthChecked(true);
    void loadRooms();
  }, [loadRooms, router]);

  const createRoom = async (event: FormEvent) => {
    event.preventDefault();
    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!cleanSlug) {
      toast.error("Give your room a name first.");
      return;
    }

    setCreating(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/room`,
        { slug: cleanSlug },
        authConfig(),
      );
      setSlug("");
      toast.success("Room created.");
      await loadRooms();
      router.push(`/canvas/${cleanSlug}`);
      return response;
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Could not create that room.");
    } finally {
      setCreating(false);
    }
  };

  const deleteRoom = async (roomId: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/room/delete`, {
        ...authConfig(),
        data: { roomId },
      });
      setRooms((currentRooms) =>
        currentRooms.filter((room) => room.id !== roomId),
      );
      toast.success("Room deleted.");
    } catch {
      toast.error("Could not delete that room.");
    } finally {
      setRoomToDelete(null);
    }
  };

  const shareRoom = async (roomSlug: string) => {
    const link = `${window.location.origin}/canvas/${roomSlug}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Share link copied to your clipboard.");
    } catch {
      toast.info(link);
    }
  };

  const joinRoom = (event: FormEvent) => {
    event.preventDefault();
    const cleanSlug = joinSlug
      .trim()
      .replace(/^.*\/canvas\//, "")
      .replace(/\/$/, "");
    if (cleanSlug) router.push(`/canvas/${cleanSlug}`);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    router.replace("/signin");
  };

  if (!authChecked) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background bg-grid text-foreground font-base pb-10">
      <header className="mx-5 mt-4 rounded-base border-2 border-border bg-[#ffffff] shadow-shadow sm:mx-8 lg:mx-10">
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground">
            Canvas<span className="text-primary">Flow</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary border-transparent shadow-none"
            title="Sign out"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-12">
        <section className="mb-7">
          <p className="mb-1 text-sm font-medium text-muted-foreground">Welcome back</p>
          <h1 className="font-heading font-black text-5xl leading-none text-foreground tracking-tight">
            Your rooms
          </h1>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setActiveAction(activeAction === "create" ? null : "create")
            }
            className="group flex min-h-32 items-center justify-between rounded-base border-2 border-border shadow-shadow bg-main px-6 text-left transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <span>
              <span className="mb-4 grid size-10 place-items-center rounded-base border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-[#ffffff] text-foreground">
                <Plus size={20} />
              </span>
              <span className="block text-lg font-bold text-white">
                Create a room
              </span>
              <span className="mt-1 block text-sm font-medium text-white/90">
                Start a new canvas
              </span>
            </span>
            <ArrowRight
              className="text-white transition-transform group-hover:translate-x-1"
              size={24}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveAction(activeAction === "join" ? null : "join")
            }
            className="group flex min-h-32 items-center justify-between rounded-base border-2 border-border shadow-shadow bg-[#ffffff] px-6 text-left transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <span>
              <span className="mb-4 grid size-10 place-items-center rounded-base border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-main text-white">
                <Users size={20} />
              </span>
              <span className="block text-lg font-bold text-foreground">
                Join a room
              </span>
              <span className="mt-1 block text-sm font-medium text-muted-foreground">
                Enter a room name or link
              </span>
            </span>
            <ArrowRight
              className="text-foreground transition-transform group-hover:translate-x-1"
              size={24}
            />
          </button>
        </section>

        {activeAction && (
          <section className="py-5">
            {activeAction === "create" ? (
              <form
                onSubmit={createRoom}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Input
                  autoFocus
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="Room-name"
                  className="flex-1"
                />
                <Button
                  disabled={creating}
                  type="submit"
                >
                  {creating ? "Creating..." : "Create room"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={joinRoom}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Input
                  autoFocus
                  value={joinSlug}
                  onChange={(event) => setJoinSlug(event.target.value)}
                  placeholder="Room-name or share link"
                  className="flex-1"
                />
                <Button
                  aria-label="Join room"
                  type="submit"
                  className="flex items-center gap-2"
                >
                  Join <ArrowRight size={17} />
                </Button>
              </form>
            )}
          </section>
        )}

        <div className="mb-4 mt-9 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recent rooms</h2>
        </div>

        {loading ? (
          <p className="py-10 text-sm font-medium text-muted-foreground">Loading your rooms...</p>
        ) : rooms.length === 0 ? (
          <div className="rounded-base border-2 border-dashed border-border py-16 text-center text-sm font-medium text-muted-foreground">
            Your next great idea starts with a room above.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onOpen={() => router.push(`/canvas/${room.slug}`)}
                onShare={() => void shareRoom(room.slug)}
                onDelete={() => setRoomToDelete(room)}
              />
            ))}
          </div>
        )}
      </div>
      <RoomDeleteDialog
        roomSlug={roomToDelete?.slug}
        open={roomToDelete !== null}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
        onConfirm={() => roomToDelete && void deleteRoom(roomToDelete.id)}
      />
    </main>
  );
}
