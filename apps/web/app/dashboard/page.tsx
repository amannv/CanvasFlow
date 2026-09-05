"use client";

import axios from "axios";
import { LogOut, Plus, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config/config";
import { RoomCard } from "../components/RoomCard";
import { RoomDeleteDialog } from "../components/RoomDeleteDialog";
import { toast } from "@repo/ui/components/ui/sonner";

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
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="mx-5 mt-4 rounded-xl border border-white/10 bg-[#111111]/75 sm:mx-8 lg:mx-10">
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f4f0e6]">
            Canvas<span className="text-[#38bdf8]">Flow</span>
          </p>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-white/45 transition hover:text-[#38bdf8]"
            title="Sign out"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-12">
        <section className="mb-7">
          <p className="mb-1 text-sm text-white/45">Welcome back</p>
          <h1 className="font-eb-garamond text-5xl leading-none text-[#f4f0e6]">
            Your rooms
          </h1>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setActiveAction(activeAction === "create" ? null : "create")
            }
            className="group flex min-h-32 items-center justify-between rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/6 px-6 text-left transition hover:border-[#38bdf8] hover:bg-[#38bdf8]/10"
          >
            <span>
              <span className="mb-4 grid size-10 place-items-center rounded-full border border-[#38bdf8]/40 bg-[#0a0a0a] text-[#38bdf8]">
                <Plus size={20} />
              </span>
              <span className="block text-base font-medium text-[#f4f0e6]">
                Create a room
              </span>
              <span className="mt-1 block text-sm text-white/45">
                Start a new canvas
              </span>
            </span>
            <ArrowRight
              className="text-[#38bdf8] transition-transform group-hover:translate-x-1"
              size={20}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveAction(activeAction === "join" ? null : "join")
            }
            className="group flex min-h-32 items-center justify-between rounded-xl border border-white/10 bg-[#111111] px-6 text-left transition hover:border-white/25 hover:bg-white/4"
          >
            <span>
              <span className="mb-4 grid size-10 place-items-center rounded-full border border-white/20 bg-[#0a0a0a] text-white/70">
                <Users size={19} />
              </span>
              <span className="block text-base font-medium text-[#f4f0e6]">
                Join a room
              </span>
              <span className="mt-1 block text-sm text-white/45">
                Enter a room name or link
              </span>
            </span>
            <ArrowRight
              className="text-white/70 transition-transform group-hover:translate-x-1"
              size={20}
            />
          </button>
        </section>

        {activeAction && (
          <section className="py-5">
            {activeAction === "create" ? (
              <form
                onSubmit={createRoom}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  autoFocus
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="Room-name"
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#111111] px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#38bdf8]"
                />
                <button
                  disabled={creating}
                  className="rounded-lg bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#7dd3fc] disabled:cursor-wait disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create room"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={joinRoom}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  autoFocus
                  value={joinSlug}
                  onChange={(event) => setJoinSlug(event.target.value)}
                  placeholder="Room-name or share link"
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#111111] px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#38bdf8]"
                />
                <button
                  aria-label="Join room"
                  className="flex items-center justify-center gap-2 rounded-lg border bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition  hover:bg-[#7dd3fc]"
                >
                  Join <ArrowRight size={17} />
                </button>
              </form>
            )}
          </section>
        )}

        <div className="mb-4 mt-9 flex items-center justify-between">
          <h2 className="text-base font-medium text-[#f4f0e6]">Recent rooms</h2>
        </div>

        {loading ? (
          <p className="py-10 text-sm text-white/45">Loading your rooms...</p>
        ) : rooms.length === 0 ? (
          <div className="border border-dashed border-white/15 py-16 text-center text-sm text-white/45">
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
