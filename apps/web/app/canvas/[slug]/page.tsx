import { RoomCanvas } from "../../components/RoomCanvas";
import axios from "axios";
import { BACKEND_URL } from "../../config/config";

export default async function CanvasPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  const roomId = response.data.roomId;

  return <RoomCanvas roomId={roomId} />;
}
