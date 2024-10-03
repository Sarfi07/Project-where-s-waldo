/*
  Warnings:

  - You are about to drop the column `endTime` on the `player` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "player" DROP COLUMN "endTime",
DROP COLUMN "userId",
ADD COLUMN     "elapsedTime" INTEGER;
