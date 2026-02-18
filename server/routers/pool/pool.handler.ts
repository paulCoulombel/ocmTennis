import { prisma } from "@/lib/prisma";
import { tenupResponseSchema } from "./pool.schema";

export const groupMatchesByDay = <T extends { day: number }>(matches: T[]) => {
  const grouped = matches.reduce(
    (acc, match) => {
      if (!acc[match.day]) {
        acc[match.day] = [];
      }
      acc[match.day].push(match);
      return acc;
    },
    {} as Record<number, T[]>,
  );

  return Object.entries(grouped)
    .map(([day, matches]) => ({ day: parseInt(day), matches }))
    .sort((a, b) => a.day - b.day);
};

export const getInformationHandler = async ({
  input,
}: {
  input: { poolId: number };
}) => {
  const pool = await prisma.pool.findUnique({
    where: { id: input.poolId },
    select: {
      id: true,
      name: true,
      category: true,
      subcategory: true,
      ballColor: true,
      division: true,
      dayNumber: true,
      teams: {
        select: {
          id: true,
          name: true,
          points: true,
          rank: true,
          homeMatches: true,
          fromClub: true,
        },
      },
      championshipId: true,
      divisionId: true,
      phaseId: true,
    },
  });
  if (!pool) {
    throw new Error("Pool not found");
  }
  const ourTeamIds = pool.teams
    .filter((team) => team.fromClub)
    .map((team) => team.id);
  const nextMatches = pool.teams
    .map((team) => {
      return team.homeMatches
        .filter((match) => !match.isPlayed)
        .map((match) => ({
          ...match,
          isOurMatch:
            ourTeamIds.includes(match.homeTeamId) ||
            ourTeamIds.includes(match.awayTeamId),
        }));
    })
    .flat();
  const nextMatchesSortedByDay = groupMatchesByDay(nextMatches);

  const matches = pool.teams
    .map((team) => {
      return team.homeMatches;
    })
    .flat();
  const matchesSortedByDay = groupMatchesByDay(matches);

  const previousMatches = matchesSortedByDay
    .filter(({ matches }) => {
      return matches.some((match) => match.isPlayed);
    })
    .sort((a, b) => b.day - a.day);

  return {
    ...pool,
    nextMatches: nextMatchesSortedByDay,
    previousMatches,
  };
};

export const getMatchInformationHandler = async ({
  input,
}: {
  input: { poolId: number; matchId: number };
}) => {
  const pool = await prisma.pool.findUnique({
    where: { id: input.poolId },
    select: {
      championshipId: true,
      divisionId: true,
      phaseId: true,
    },
  });
  if (!pool) {
    throw new Error("Pool not found");
  }
  const url = `https://tenup.fft.fr/back/public/v1/championnats-equipes/${pool.championshipId}/divisions/${pool.divisionId}/phases/${pool.phaseId}/poules/${input.poolId}/rencontres/${input.matchId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch match information");
  }
  const data = await response.json();
  const verifiedData = tenupResponseSchema.safeParse(data);
  if (!verifiedData.success) {
    console.error(verifiedData.error);
    throw new Error("Invalid match information data");
  }

  // cspell: disable
  const teamInformation = await prisma.team.findMany({
    where: {
      poolId: input.poolId,
      OR: [
        { id: verifiedData.data.equipeRecevante.id },
        { id: verifiedData.data.equipeInvitee.id },
      ],
    },
    select: {
      rank: true,
      points: true,
      id: true,
    },
  });

  return {
    championshipId: pool.championshipId,
    divisionId: pool.divisionId,
    phaseId: pool.phaseId,
    homeTeam: {
      name: verifiedData.data.equipeRecevante.nom,
      id: verifiedData.data.equipeRecevante.id,
      score: verifiedData.data.equipeRecevante.score,
      isWinner: verifiedData.data.equipeRecevante.gagnant,
      isForfeit: verifiedData.data.equipeRecevante.forfait,
      isDisqualified: verifiedData.data.equipeRecevante.disqualification,
      rank:
        teamInformation.find(
          (team) => team.id === verifiedData.data.equipeRecevante.id,
        )?.rank ?? null,
      players: verifiedData.data.matchs
        .filter((m) => {
          return m.id !== null && m.simple;
        })
        .map((match) => ({
          firstName:
            match.joueur1Recevant !== null ? match.joueur1Recevant.prenom : "",
          lastName:
            match.joueur1Recevant !== null ? match.joueur1Recevant.nom : "",
          rank:
            match.joueur1Recevant !== null
              ? match.joueur1Recevant.classementSimple
              : null,
        })),
    },
    awayTeam: {
      name: verifiedData.data.equipeInvitee.nom,
      id: verifiedData.data.equipeInvitee.id,
      score: verifiedData.data.equipeInvitee.score,
      isWinner: verifiedData.data.equipeInvitee.gagnant,
      isForfeit: verifiedData.data.equipeInvitee.forfait,
      isDisqualified: verifiedData.data.equipeInvitee.disqualification,
      rank:
        teamInformation.find(
          (team) => team.id === verifiedData.data.equipeInvitee.id,
        )?.rank ?? null,
      players: verifiedData.data.matchs
        .filter((m) => {
          return m.id !== null && m.simple;
        })
        .map((match) => ({
          firstName:
            match.joueur1Invite !== null ? match.joueur1Invite.prenom : "",
          lastName: match.joueur1Invite !== null ? match.joueur1Invite.nom : "",
          rank:
            match.joueur1Invite !== null
              ? match.joueur1Invite.classementSimple
              : null,
        })),
    },
    date: verifiedData.data.dateReelle,
    matches: verifiedData.data.matchs
      .filter((match) => match.id !== null)
      .map((match) => {
        if (
          match.id === null ||
          match.natureVictoire === null ||
          match.equipeRecevanteScores === null ||
          match.equipeInviteeScores === null ||
          match.equipeRecevanteGagnante === null
        ) {
          throw new Error("Invalid match data");
        }
        return {
          id: match.id,
          isSingle: match.simple,
          matchNumber: match.numero,
          victoryType: match.natureVictoire,
          homeScores: match.equipeRecevanteScores,
          awayScores: match.equipeInviteeScores,
          homeIsWinner: match.equipeRecevanteGagnante,
          homePlayer: [
            {
              firstName:
                match.joueur1Recevant !== null
                  ? match.joueur1Recevant.prenom
                  : "",
              lastName:
                match.joueur1Recevant !== null ? match.joueur1Recevant.nom : "",
              rank:
                match.joueur1Recevant !== null
                  ? match.joueur1Recevant.classementSimple
                  : null,
            },
            {
              firstName:
                match.joueur2Recevant !== null
                  ? match.joueur2Recevant.prenom
                  : "",
              lastName:
                match.joueur2Recevant !== null ? match.joueur2Recevant.nom : "",
              rank:
                match.joueur2Recevant !== null
                  ? match.joueur2Recevant.classementDouble
                  : null,
            },
          ],
          awayPlayer: [
            {
              firstName:
                match.joueur1Invite !== null ? match.joueur1Invite.prenom : "",
              lastName:
                match.joueur1Invite !== null ? match.joueur1Invite.nom : "",
              rank:
                match.joueur1Invite !== null
                  ? match.joueur1Invite.classementSimple
                  : null,
            },
            {
              firstName:
                match.joueur2Invite !== null ? match.joueur2Invite.prenom : "",
              lastName:
                match.joueur2Invite !== null ? match.joueur2Invite.nom : "",
              rank:
                match.joueur2Invite !== null
                  ? match.joueur2Invite.classementDouble
                  : null,
            },
          ],
        };
      }),
  };
};
