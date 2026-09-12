"use client";

import axios from "axios";
import { LogOut, Plus, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config/config";
import { RoomCard, RoomCardRoom } from "../components/RoomCard";
import { RoomDeleteDialog } from "../components/RoomDeleteDialog";
import { toast } from "@repo/ui/components/ui/sonner";

function authConfig() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomCardRoom[]>([]);
  const [slug, setSlug] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomCardRoom | null>(null);

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
    <div className="flex min-h-screen flex-col bg-white bg-grid font-sans selection:bg-[#0099FF] selection:text-white pb-20">
      {/* Floating Top Navbar */}
      <div className="mx-auto w-full max-w-7xl pt-6 px-6 lg:px-12">
        <header className="flex items-center justify-between rounded-2xl border-4 border-black bg-white px-6 py-4 shadow-[4px_4px_0px_0px_#000000] lg:px-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-black">
            Canvas<span className="text-[#0099FF]">Flow</span>
          </h1>
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm font-bold text-black/60 hidden sm:inline-block">
              WELCOME BACK
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#0099FF] px-4 py-2 font-mono text-sm font-bold text-white shadow-[4px_4px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:translate-x-1"
            >
              <LogOut size={16} strokeWidth={3} />
              SIGN OUT
            </button>
          </div>
        </header>
      </div>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-6 lg:p-12">
        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Welcome Block */}
          <div className="col-span-1 flex flex-col justify-between rounded-3xl border-4 border-black bg-[#0099FF] p-8 shadow-[8px_8px_0px_0px_#000000] md:col-span-2 lg:col-span-2">
            <div>
              <p className="font-mono text-sm font-bold text-black uppercase">
                Good to see you
              </p>
              <h2 className="mt-4 text-5xl font-black uppercase tracking-tighter text-black sm:text-6xl lg:text-7xl">
                FRIEND
              </h2>
            </div>
            <p className="mt-12 max-w-md font-mono text-base font-bold leading-relaxed text-black/80">
              JUMP BACK INTO YOUR CANVASES OR START A NEW ONE. THE WHITEBOARD IS
              YOURS.
            </p>
          </div>

          {/* Create Room Block */}
          <div className="col-span-1 flex flex-col justify-between rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:translate-x-1 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div className="grid size-12 place-items-center rounded-xl border-2 border-black bg-[#0099FF] text-white shadow-[4px_4px_0px_0px_#000000]">
                <Plus size={24} strokeWidth={3} />
              </div>
              <span className="font-mono text-xs font-bold text-black/50">
                CREATE
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-3xl font-black uppercase tracking-tight text-black">
                New Room
              </h3>
              <form onSubmit={createRoom} className="mt-6 flex flex-col gap-3">
                <input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-black/5 px-4 py-3 font-mono text-sm font-bold text-black placeholder:text-black/40 outline-none focus:border-[#0099FF] focus:bg-white"
                  placeholder="Room name..."
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-black px-4 py-3 font-mono text-sm font-bold text-white transition-colors hover:bg-black/80"
                >
                  CREATE
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </form>
            </div>
          </div>

          {/* Join Room Block */}
          <div className="col-span-1 flex flex-col justify-between rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:translate-x-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div className="grid size-12 place-items-center rounded-xl border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_#0099FF]">
                <Users size={24} strokeWidth={3} />
              </div>
              <span className="font-mono text-xs font-bold text-black/50">
                JOIN
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-3xl font-black uppercase tracking-tight text-black">
                Join Room
              </h3>
              <form onSubmit={joinRoom} className="mt-6 flex flex-col gap-3">
                <input
                  required
                  value={joinSlug}
                  onChange={(e) => setJoinSlug(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-black/5 px-4 py-3 font-mono text-sm font-bold text-black placeholder:text-black/40 outline-none focus:border-[#0099FF] focus:bg-white"
                  placeholder="Room slug..."
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-black px-4 py-3 font-mono text-sm font-bold text-white transition-colors hover:bg-black/80"
                >
                  JOIN
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Your Rooms Grid */}
        <div className="mt-16">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <h3 className="rounded-2xl border-4 border-black bg-white px-6 py-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-black shadow-[4px_4px_0px_0px_#000000]">
              Your Rooms
            </h3>
            <span className="rounded-xl border-4 border-black bg-[#0099FF] px-4 py-2 font-mono text-sm font-bold text-white shadow-[4px_4px_0px_0px_#000000]">
              {rooms.length} TOTAL
            </span>
          </div>

          {loading ? (
            <p className="py-10 font-mono text-sm font-bold uppercase tracking-widest text-black/50">
              Loading your rooms...
            </p>
          ) : rooms.length === 0 ? (
            <div className="rounded-3xl border-4 border-dashed border-black/20 py-24 text-center">
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-black/50">
                Your next great idea starts with a room above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </main>

      <RoomDeleteDialog
        roomSlug={roomToDelete?.slug}
        open={roomToDelete !== null}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
        onConfirm={() => roomToDelete && void deleteRoom(roomToDelete.id)}
      />
    </div>
  );
}
