import axios from "axios";
import { RoomCanvas } from "../../components/RoomCanvas";
import { BACKEND_URL } from "../../config/config";

export const dynamic = "force-dynamic";

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const response = await axios.get(
      `${BACKEND_URL}/room/${encodeURIComponent(slug)}`,
    );
    return <RoomCanvas roomId={String(response.data.roomId)} />;
  } catch (error: unknown) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    const message =
      status === 404
        ? "This room does not exist or is no longer available."
        : "The room could not be opened. Check that the HTTP backend is running.";

    return (
      <main className="grid min-h-screen place-items-center bg-[#0a0a0a] px-6 text-center text-white">
        <div>
          <h1 className="font-eb-garamond text-4xl">Unable to open room</h1>
          <p className="mt-3 text-sm text-white/60">{message}</p>
        </div>
      </main>
    );
  }
}
