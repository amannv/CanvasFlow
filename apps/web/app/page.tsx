"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
   <div className={"flex justify-center items-center h-screen w-screen p-2 gap-1"}>
    <input className="bg-gray-600 p-2 border border-gray-50" value={roomId} onChange={(e) => {
      setRoomId(e.target.value);
    }} type="text" placeholder="roomId"></input>
    <button className="bg-neutral-600 p-2 border border-neutral-50" onClick={() => {
      router.push(`/room/${roomId}`)
    }}>Join Room</button>
    </div>
  );
}
