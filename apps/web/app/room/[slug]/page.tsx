import axios from "axios";
import { BACKEND_URL } from "../../config/config";
import ChatRoom from "../../components/ChatRoom";

async function getRoomId(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/api/v1/user/room/${slug}`);
  return response.data.room.id;
}

export default async function Board({
  params,
}: {
  params: Promise<{slug: string}>
}) {

  const { slug: slug } = await params;
  const roomId = await getRoomId(slug);

  return (
    <ChatRoom id={roomId} />
  )

}
