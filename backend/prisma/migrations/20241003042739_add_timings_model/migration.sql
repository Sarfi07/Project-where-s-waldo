/*
  Warnings:

  - You are about to drop the `player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "player";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3),
    "elapsedTime" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timing" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "name" TEXT,
    "seconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Timing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Timing" ADD CONSTRAINT "Timing_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
