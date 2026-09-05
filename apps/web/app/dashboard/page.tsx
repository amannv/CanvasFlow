"use client";

import axios from "axios";
import { LogOut, Plus, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config/config";
import { RoomCard } from "../components/RoomCard";

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
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

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
      setNotice("Could not load your rooms.");
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
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    if (!cleanSlug) {
      setNotice("Give your room a name first.");
      return;
    }

    setCreating(true);
    setNotice("");
    try {
      const response = await axios.post(`${BACKEND_URL}/room`, { slug: cleanSlug }, authConfig());
      setSlug("");
      await loadRooms();
      router.push(`/canvas/${cleanSlug}`);
      return response;
    } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      setNotice(message ?? "Could not create that room.");
    } finally {
      setCreating(false);
    }
  };

  const deleteRoom = async (roomId: number) => {
    if (!window.confirm("Delete this room and all of its drawings?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/room/delete`, {
        ...authConfig(),
        data: { roomId },
      });
      setRooms((currentRooms) => currentRooms.filter((room) => room.id !== roomId));
      setNotice("Room deleted.");
    } catch {
      setNotice("Could not delete that room.");
    }
  };

  const shareRoom = async (roomSlug: string) => {
    const link = `${window.location.origin}/canvas/${roomSlug}`;
    try {
      await navigator.clipboard.writeText(link);
      setNotice("Share link copied to your clipboard.");
    } catch {
      setNotice(link);
    }
  };

  const joinRoom = (event: FormEvent) => {
    event.preventDefault();
    const cleanSlug = joinSlug.trim().replace(/^.*\/canvas\//, "").replace(/\/$/, "");
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
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-10 lg:py-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-7">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#38bdf8]">CanvasFlow</p>
            <h1 className="font-eb-garamond text-4xl font-semibold tracking-normal sm:text-5xl">Your rooms</h1>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-white/60 transition hover:text-white" title="Sign out">
            <LogOut size={17} /> Sign out
          </button>
        </header>

        <section className="grid gap-5 py-8 lg:grid-cols-[1.35fr_1fr]">
          <form onSubmit={createRoom} className="border border-white/10 bg-[#111111] p-6 sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#38bdf8]">Start something new</p>
                <h2 className="font-eb-garamond text-3xl">Create a room</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/55">A shared canvas for ideas, diagrams, and unfinished thoughts.</p>
              </div>
              <Plus className="mt-1 text-[#38bdf8]" size={24} />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="room-name" className="min-w-0 flex-1 border border-white/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#38bdf8]" />
              <button disabled={creating} className="bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#7dd3fc] disabled:cursor-wait disabled:opacity-60">{creating ? "Creating..." : "Create room"}</button>
            </div>
          </form>

          <form onSubmit={joinRoom} className="border border-white/10 bg-[#111111] p-6 sm:p-8">
            <Users className="mb-6 text-[#38bdf8]" size={24} />
            <h2 className="font-eb-garamond text-3xl">Join a room</h2>
            <p className="mt-2 mb-6 text-sm leading-6 text-white/55">Paste a room name or a CanvasFlow share link from a friend.</p>
            <div className="flex gap-3">
              <input value={joinSlug} onChange={(event) => setJoinSlug(event.target.value)} placeholder="room-name or link" className="min-w-0 flex-1 border border-white/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#38bdf8]" />
              <button aria-label="Join room" className="border border-[#38bdf8] px-4 text-[#38bdf8] transition hover:bg-[#38bdf8] hover:text-[#0a0a0a]"><ArrowRight size={19} /></button>
            </div>
          </form>
        </section>

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Your collection</p>
            <h2 className="mt-1 font-eb-garamond text-3xl">Recent rooms</h2>
          </div>
          <span className="text-sm text-white/40">{rooms.length} {rooms.length === 1 ? "room" : "rooms"}</span>
        </div>

        {notice && <p className="mb-5 border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-3 text-sm text-[#7dd3fc]">{notice}</p>}
        {loading ? <p className="py-10 text-sm text-white/45">Loading your rooms...</p> : rooms.length === 0 ? <div className="border border-dashed border-white/15 py-16 text-center text-sm text-white/45">Your next great idea starts with a room above.</div> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => <RoomCard key={room.id} room={room} onOpen={() => router.push(`/canvas/${room.slug}`)} onShare={() => void shareRoom(room.slug)} onDelete={() => void deleteRoom(room.id)} />)}
        </div>}
      </div>
    </main>
  );
}
