/*
  Warnings:

  - You are about to drop the column `seconds` on the `Timing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Timing" DROP COLUMN "seconds",
ADD COLUMN     "score" INTEGER;
