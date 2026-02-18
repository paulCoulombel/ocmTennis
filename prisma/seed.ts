import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.url.upsert({
    where: {
      json: "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136355/phases/219749/poules/486540?recupererStructure=true",
    },
    update: {},
    create: {
      json: "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136355/phases/219749/poules/486540?recupererStructure=true",
    },
  });
  const team1 = await prisma.team.upsert({
    where: { id: 456456156 },
    update: {},
    create: {
      name: "Team Test",
      pool: {
        connectOrCreate: {
          where: { id: 546455 },
          create: {
            id: 546455,
            name: "PoolTest",
            category: "D1",
            division: "DivisionTest",
            championshipId: 82540489,
            divisionId: 136355,
            phaseId: 219749,
            dayNumber: 5,
          },
        },
      },
      fromClub: true,
      id: 456456156,
      rank: 1,
      points: 10,
    },
  });
  const team2 = await prisma.team.upsert({
    where: { id: 456456156 },
    update: {},
    create: {
      name: "Team Test 2",
      pool: {
        connectOrCreate: {
          where: { id: 546455 },
          create: {
            id: 546455,
            name: "PoolTest",
            category: "D1",
            division: "DivisionTest",
            championshipId: 82540489,
            divisionId: 136355,
            phaseId: 219749,
            dayNumber: 5,
          },
        },
      },
      fromClub: false,
      id: 456456156,
      rank: 2,
      points: 8,
    },
  });

  await prisma.match.upsert({
    where: { id: 12345 },
    update: {},
    create: {
      id: 12345,
      date: new Date(),
      homeScore: 5,
      awayScore: 3,
      day: 1,
      homeTeam: {
        connect: { id: team1.id },
      },
      awayTeam: {
        connect: { id: team2.id },
      },
      isPlayed: true,
      isForfeit: false,
      isDisqualified: false,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
