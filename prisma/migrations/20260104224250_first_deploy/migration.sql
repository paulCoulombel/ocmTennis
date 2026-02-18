/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `homeMatch` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `opponentScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `opponentTeam` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `ownerScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `ownerTeamId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `OwnerTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RankingPool` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `awayTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isForfeit` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPlayed` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_ownerTeamId_fkey";

-- DropForeignKey
ALTER TABLE "RankingPool" DROP CONSTRAINT "RankingPool_ownerTeamId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "homeMatch",
DROP COLUMN "opponentScore",
DROP COLUMN "opponentTeam",
DROP COLUMN "ownerScore",
DROP COLUMN "ownerTeamId",
ADD COLUMN     "awayScore" INTEGER,
ADD COLUMN     "awayTeamId" INTEGER NOT NULL,
ADD COLUMN     "homeScore" INTEGER,
ADD COLUMN     "homeTeamId" INTEGER NOT NULL,
ADD COLUMN     "isForfeit" BOOLEAN NOT NULL,
ADD COLUMN     "isPlayed" BOOLEAN NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "OwnerTeam";

-- DropTable
DROP TABLE "RankingPool";

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "poolId" INTEGER NOT NULL,
    "fromClub" BOOLEAN NOT NULL,
    "rank" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "championshipId" INTEGER NOT NULL,
    "divisionId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Url" (
    "json" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("json")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
