/*
  Warnings:

  - Added the required column `doubleBonus` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doubleCount` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doubleFormatCode` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsForDisqualification` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsForDoubleWin` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsForDraw` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsForForfeit` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsForLoss` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsForSimpleWin` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsForWin` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `simpleCount` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `simpleFormatCode` to the `Pool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "doubleBonus" BOOLEAN NOT NULL,
ADD COLUMN     "doubleCount" INTEGER NOT NULL,
ADD COLUMN     "doubleFormatCode" INTEGER NOT NULL,
ADD COLUMN     "pointsForDisqualification" INTEGER NOT NULL,
ADD COLUMN     "pointsForDoubleWin" INTEGER NOT NULL,
ADD COLUMN     "pointsForDraw" INTEGER NOT NULL,
ADD COLUMN     "pointsForForfeit" INTEGER NOT NULL,
ADD COLUMN     "pointsForLoss" INTEGER NOT NULL,
ADD COLUMN     "pointsForSimpleWin" INTEGER NOT NULL,
ADD COLUMN     "pointsForWin" INTEGER NOT NULL,
ADD COLUMN     "simpleCount" INTEGER NOT NULL,
ADD COLUMN     "simpleFormatCode" INTEGER NOT NULL;
