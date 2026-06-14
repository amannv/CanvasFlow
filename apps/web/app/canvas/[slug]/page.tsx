import { RoomCanvas } from "../../components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;
  console.log(slug);

  return <RoomCanvas slug={slug} />;
}
