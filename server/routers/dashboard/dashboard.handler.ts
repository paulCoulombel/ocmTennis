import { prisma } from "@/lib/prisma";

export const getInformationHandler = async ({}) => {
  const teamCount = await prisma.team.count({
    where: { fromClub: true },
  });

  const matchesFromClub = await prisma.match.findMany({
    where: {
      AND: [
        { isPlayed: true },
        {
          OR: [
            { homeTeam: { fromClub: true } },
            { awayTeam: { fromClub: true } },
          ],
        },
      ],
    },
    select: {
      homeScore: true,
      awayScore: true,
      homeTeam: { select: { fromClub: true } },
      awayTeam: { select: { fromClub: true } },
    },
  });
  const matchCount = matchesFromClub.filter((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return false;
    }
    return true;
  }).length;
  const victoryCount = matchesFromClub.filter((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return false;
    }
    if (match.homeTeam.fromClub) {
      return match.homeScore > match.awayScore;
    } else {
      return match.awayScore > match.homeScore;
    }
  }).length;
  const drawCount = matchesFromClub.filter((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return false;
    }
    return match.homeScore === match.awayScore;
  }).length;

  return {
    teamCount,
    matchCount,
    victoryCount,
    drawCount,
  };
};

export const getTableTeamsHandler = async ({}) => {
  const clubTeams = await prisma.team.findMany({
    where: { fromClub: true },
    select: {
      id: true,
      name: true,
      points: true,
      rank: true,
      pool: {
        select: {
          division: true,
          category: true,
          name: true,
          championshipId: true,
          divisionId: true,
          phaseId: true,
          id: true,
          dayNumber: true,
          subcategory: true,
          ballColor: true,
        },
      },
    },
  });
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ homeTeam: { fromClub: true } }, { awayTeam: { fromClub: true } }],
    },
    select: {
      homeScore: true,
      awayScore: true,
      isPlayed: true,
      homeTeam: { select: { id: true, fromClub: true } },
      awayTeam: { select: { id: true, fromClub: true } },
      day: true,
    },
  });

  const teamRows = clubTeams.map((team) => {
    const teamMatches = matches
      .filter((match) => {
        return match.homeTeam.id === team.id || match.awayTeam.id === team.id;
      })
      .sort((a, b) => a.day - b.day);
    return {
      name:
        team.name +
        " - " +
        (team.pool.category === "Jeunes" // cspell: words Jeunes
          ? team.pool.subcategory
          : team.pool.category),
      points: team.points,
      rank: team.rank,
      pool: {
        division: team.pool.division,
        category: team.pool.category,
        name: team.pool.name,
        championshipId: team.pool.championshipId.toString(),
        divisionId: team.pool.divisionId.toString(),
        phaseId: team.pool.phaseId.toString(),
        id: team.pool.id.toString(),
        dayNumber: team.pool.dayNumber,
        subcategory: team.pool.subcategory,
        ballColor: team.pool.ballColor,
      },
      matchResults: teamMatches.map((match) => {
        const isHome = match.homeTeam.id === team.id;
        const teamScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;
        if (!match.isPlayed) {
          return {
            result: "notPlayed",
            day: match.day,
          };
        }
        if (teamScore === null || opponentScore === null) {
          throw new Error("Match scores should not be null for played matches");
        }
        return {
          result:
            teamScore > opponentScore
              ? "win"
              : teamScore < opponentScore
                ? "loss"
                : "draw",
          day: match.day,
        };
      }),
    };
  });
  return teamRows
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort OCM 1, 2, 3...
    .sort((a, b) => {
      if (
        a.pool.category === "Jeunes" &&
        b.pool.category === "Jeunes" &&
        a.pool.subcategory &&
        b.pool.subcategory
      ) {
        return a.pool.subcategory.localeCompare(b.pool.subcategory, undefined, {
          numeric: true,
        }); // Sort by subcategory for Jeunes
      }
      return a.pool.category.localeCompare(b.pool.category); // Sort by category
    });
};

export const getNextMatchesHandler = async ({}) => {
  const nextMatches = await prisma.match.findMany({
    where: {
      // Next matches within one month involving club teams
      AND: [
        { isPlayed: false },
        {
          OR: [
            { homeTeam: { fromClub: true } },
            { awayTeam: { fromClub: true } },
          ],
        },
        {
          date: { gte: new Date() },
        },
        {
          date: {
            lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
        },
      ],
    },
    orderBy: { date: "asc" },
    select: {
      homeTeam: {
        select: {
          name: true,
          fromClub: true,
          pool: {
            select: {
              division: true,
              category: true,
              subcategory: true,
              ballColor: true,
              name: true,
              dayNumber: true,
            },
          },
        },
      },
      awayTeam: { select: { name: true, fromClub: true } },
      date: true,
      day: true,
    },
  });
  return nextMatches.map((match) => ({
    opponentName: match.homeTeam.fromClub
      ? match.awayTeam.name
      : match.homeTeam.name,
    ourTeamName: match.homeTeam.fromClub
      ? match.homeTeam.name
      : match.awayTeam.name,
    division: match.homeTeam.pool.division,
    date: match.date,
    isHome: match.homeTeam.fromClub,
    day: match.day,
    category: match.homeTeam.pool.category,
    subcategory: match.homeTeam.pool.subcategory,
    ballColor: match.homeTeam.pool.ballColor,
    poolName: match.homeTeam.pool.name,
    totalDayCount: match.homeTeam.pool.dayNumber,
  }));
};
