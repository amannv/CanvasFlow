import { BACKEND_URL } from "../config/config";
import axios from "axios";
import { ChatRoomClient } from "./ChatRoomClient";

async function getElements(roomId: string) {
  const response = await axios.get(
    `${BACKEND_URL}/api/v1/user/elements/${roomId}`,
  );
  return response.data.elements;
}

export default async function ChatRoom({ id }: { id: string }) {
  const elements = await getElements(id);
  console.log(elements);

  return <ChatRoomClient id={id} elements={elements} />;
}
