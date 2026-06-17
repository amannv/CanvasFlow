import axios from "axios";
import { BACKEND_URL } from "../../config/config";

export async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${BACKEND_URL}/elements/${roomId}`);
  const data = response.data.elements;
  const shapes = data.map((s: any) => ({
    type: s.type,
    ...s.data,
  }));

  return shapes;
}
