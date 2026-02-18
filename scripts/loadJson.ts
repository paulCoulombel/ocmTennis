// cspell: disable
import { PrismaClient } from "@prisma/client";
import z from "zod";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

const tenupResponseSchema = z.object({
  championnat: z.object({
    id: z.number().int(),
    nom: z.string(),
  }),
  division: z.object({
    id: z.number().int(),
    nom: z.string(),
  }),
  phase: z.object({
    id: z.number().int(),
    calendrier: z.array(
      z.object({
        dateJournee: z.string(),
        typePoule: z.number().int(),
        numeroJournee: z.number().int(),
      }),
    ),
  }),
  poule: z.object({
    id: z.number().int(),
    nom: z.string(),
    equipes: z.array(
      z.object({
        id: z.number().int(),
        nom: z.string(),
        classement: z.number().int(),
        points: z.number().int(),
      }),
    ),
    rencontres: z.array(
      z.object({
        id: z.number().int(),
        dateReelle: z.string(),
        idEquipeDomicileReelle: z.number().int(),
        idEquipe1: z.number().int(),
        idEquipe2: z.number().int(),
        scoreEnCoursEquipe1: z.nullable(z.number().int()),
        scoreEnCoursEquipe2: z.nullable(z.number().int()),
        position: z.number().int(),
        scoreEquipe1: z.nullable(z.number()),
        scoreEquipe2: z.nullable(z.number()),
        idEquipeForfait: z.nullable(z.number()),
        disqualificationEquipe1: z.boolean(),
        disqualificationEquipe2: z.boolean(),
      }),
    ),
  }),
});
type TenupResponse = z.infer<typeof tenupResponseSchema>;

export async function loadJson(pathes: string[]): Promise<TenupResponse[]> {
  const allData = await Promise.all(
    pathes.map(async (url) => {
      const response = await fetch(url);
      const json = await response.json();
      const result = tenupResponseSchema.safeParse(json);
      if (!result.success) {
        throw new Error(`Failed to parse JSON for URL: ${url}`);
      }
      return result.data;
    }),
  );
  return allData;
}

export const saveData = async (data: TenupResponse) => {
  const championshipId = data.championnat.id;
  const divisionId = data.division.id;
  const phaseId = data.phase.id;
  const dayNumber = data.phase.calendrier.length;
  const poolId = data.poule.id;
  const poolName = data.poule.nom;
  const category = data.championnat.nom.includes("+35 MESSIEURS")
    ? "S35"
    : data.championnat.nom.includes("SENIORS MESSIEURS")
      ? "SH"
      : data.championnat.nom.includes("SENIORS DAMES")
        ? "SD"
        : data.championnat.nom.includes("J - ")
          ? "Jeunes"
          : data.championnat.nom;
  const subcategory =
    category === "Jeunes"
      ? data.championnat.nom.includes("11/13 ans FILLES")
        ? "F 11/13"
        : data.championnat.nom.includes("14/18 ans FILLES")
          ? "F 14/18"
          : data.championnat.nom.includes("8/10 ans GARCONS")
            ? "G 8/10"
            : data.championnat.nom.includes("11/12 ans GARCONS")
              ? "G 11/12"
              : data.championnat.nom.includes("13/14 ans GARCONS")
                ? "G 13/14"
                : data.championnat.nom.includes("15/16 ans GARCONS")
                  ? "G 15/16"
                  : data.championnat.nom.includes("17/18 ans GARCONS")
                    ? "G 17/18"
                    : data.championnat.nom
      : null;
  const ballColor = data.championnat.nom.includes("Vert")
    ? "green"
    : data.championnat.nom.includes("Orange")
      ? "orange"
      : "yellow";
  const divisionName = data.division.nom.includes("PRE REGIONALE")
    ? "PRE REG"
    : data.championnat.nom.includes("REGIONAL")
      ? "R" + data.division.nom[data.division.nom.length - 1]
      : data.championnat.nom.includes("Vert")
        ? "D" + data.division.nom[data.division.nom.length - 6]
        : data.championnat.nom.includes("Orange")
          ? "D" + data.division.nom[data.division.nom.length - 8]
          : "D" + data.division.nom[data.division.nom.length - 1];

  const teams = data.poule.equipes.map((team) => ({
    id: team.id,
    name: team.nom.replace("MONTAUBAN OC", "OCM"),
    poolId: poolId,
    fromClub: team.nom.includes("MONTAUBAN OC"),
    rank: team.classement,
    points: team.points,
  }));
  const matches = data.poule.rencontres.map((match) => {
    return {
      id: match.id,
      date: new Date(match.dateReelle),
      homeTeamId: match.idEquipeDomicileReelle,
      awayTeamId:
        match.idEquipeDomicileReelle === match.idEquipe1
          ? match.idEquipe2
          : match.idEquipe1,
      homeScore:
        match.idEquipeDomicileReelle === match.idEquipe1
          ? match.scoreEquipe1
          : match.scoreEquipe2,
      awayScore:
        match.idEquipeDomicileReelle === match.idEquipe1
          ? match.scoreEquipe2
          : match.scoreEquipe1,
      day: match.position,
      isPlayed: match.scoreEquipe1 !== null && match.scoreEquipe2 !== null,
      isForfeit: match.idEquipeForfait !== null,
      isDisqualified:
        match.disqualificationEquipe1 || match.disqualificationEquipe2,
    };
  });

  await prisma.pool.upsert({
    where: { id: poolId },
    update: {
      id: poolId,
      name: poolName,
      category,
      subcategory,
      ballColor,
      division: divisionName,
      championshipId,
      divisionId,
      phaseId,
      dayNumber,
    },
    create: {
      id: poolId,
      name: poolName,
      category,
      subcategory,
      ballColor,
      division: divisionName,
      championshipId,
      divisionId,
      phaseId,
      dayNumber,
    },
  });

  await Promise.all(
    teams.map(async (team) => {
      await prisma.team.upsert({
        where: { id: team.id },
        update: {
          id: team.id,
          name: team.name,
          rank: team.rank,
          points: team.points,
          fromClub: team.fromClub,
          poolId,
        },
        create: {
          id: team.id,
          name: team.name,
          rank: team.rank,
          points: team.points,
          fromClub: team.fromClub,
          poolId,
        },
      });
    }),
  );
  await Promise.all(
    matches.map(async (match) => {
      await prisma.match.upsert({
        where: { id: match.id },
        update: {
          date: match.date,
          homeTeam: { connect: { id: match.homeTeamId } },
          awayTeam: { connect: { id: match.awayTeamId } },
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          day: match.day,
          isPlayed: match.isPlayed,
          isForfeit: match.isForfeit,
          isDisqualified: match.isDisqualified,
        },
        create: {
          id: match.id,
          date: match.date,
          homeTeam: { connect: { id: match.homeTeamId } },
          awayTeam: { connect: { id: match.awayTeamId } },
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          day: match.day,
          isPlayed: match.isPlayed,
          isForfeit: match.isForfeit,
          isDisqualified: match.isDisqualified,
        },
      });
    }),
  );
};
