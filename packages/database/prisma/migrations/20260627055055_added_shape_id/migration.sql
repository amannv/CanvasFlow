/*
  Warnings:

  - A unique constraint covering the columns `[shapeId]` on the table `Element` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shapeId` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "shapeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Element_shapeId_key" ON "Element"("shapeId");
