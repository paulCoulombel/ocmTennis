-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "ownerTeamId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "opponentTeam" TEXT NOT NULL,
    "ownerScore" INTEGER NOT NULL,
    "opponentScore" INTEGER NOT NULL,
    "homeMatch" BOOLEAN NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "pool" TEXT NOT NULL,
    "urlJSON" TEXT NOT NULL,
    "urlTenUp" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,

    CONSTRAINT "OwnerTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingPool" (
    "ownerTeamId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "pool" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "matchesPlayed" INTEGER NOT NULL,
    "matchesWon" INTEGER NOT NULL,
    "matchesLost" INTEGER NOT NULL,

    CONSTRAINT "RankingPool_pkey" PRIMARY KEY ("ownerTeamId")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnerTeam_name_key" ON "OwnerTeam"("name");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_ownerTeamId_fkey" FOREIGN KEY ("ownerTeamId") REFERENCES "OwnerTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingPool" ADD CONSTRAINT "RankingPool_ownerTeamId_fkey" FOREIGN KEY ("ownerTeamId") REFERENCES "OwnerTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
