-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
