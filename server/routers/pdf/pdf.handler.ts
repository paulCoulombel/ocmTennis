import { sendStoryImage } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { isBefore, subDays } from "date-fns";
import puppeteer from "puppeteer";

interface Attachments {
  filename: string;
  content: Buffer<ArrayBufferLike>;
}

const findCategoryAndDay = async () => {
  const lastMatches = await prisma.team.findMany({
    where: {
      fromClub: true,
    },
    select: {
      homeMatches: {
        select: {
          date: true,
          day: true,
        },
      },
      awayMatches: {
        select: {
          date: true,
          day: true,
        },
      },
      name: true,
      pool: {
        select: {
          category: true,
        },
      },
    },
  });
  if (!lastMatches) {
    return;
  }
  const matchesOnDate = lastMatches.filter((team) => {
    const allMatches = [...team.homeMatches, ...team.awayMatches];
    const isPlayedThisWeek = allMatches.reduce((acc, match) => {
      const matchDate = new Date(match.date);
      if (
        // During last week
        isBefore(matchDate, new Date()) &&
        isBefore(subDays(new Date(), 7), matchDate)
      ) {
        return true;
      }
      return acc;
    }, false);
    return isPlayedThisWeek;
  });

  // Find which categories played and which day
  const wantedStories = matchesOnDate.reduce(
    (acc, match) => {
      const category = match.pool?.category;
      const day = match.homeMatches.concat(match.awayMatches).find((m) => {
        const matchDate = new Date(m.date);
        return (
          // During last week
          isBefore(matchDate, new Date()) &&
          isBefore(subDays(new Date(), 7), matchDate)
        );
      })?.day;
      if (!category || !day) {
        return acc;
      }
      if (category in acc) {
        if (acc[category] < day) {
          acc[category] = day;
        }
      } else {
        acc[category] = day;
      }
      return acc;
    },
    {} as Record<string, number>
  );
  return wantedStories;
};

export const getScoreResultsHandler = async ({
  input: { day, category },
}: {
  input: { day: number; category: string };
}) => {
  const lastMatches = await prisma.team.findMany({
    where: {
      fromClub: true,
      pool: {
        category,
      },
      OR: [
        {
          homeMatches: {
            some: {
              day,
            },
          },
        },
        {
          awayMatches: {
            some: {
              day,
            },
          },
        },
      ],
    },
    select: {
      name: true,
      homeMatches: {
        select: {
          homeScore: true,
          awayScore: true,
          date: true,
          day: true,
          isPlayed: true,
          isDisqualified: true,
          isForfeit: true,
          homeTeam: {
            select: {
              name: true,
            },
          },
          awayTeam: {
            select: {
              name: true,
            },
          },
        },
      },
      awayMatches: {
        select: {
          homeScore: true,
          awayScore: true,
          date: true,
          day: true,
          isPlayed: true,
          isDisqualified: true,
          isForfeit: true,
          homeTeam: {
            select: {
              name: true,
            },
          },
          awayTeam: {
            select: {
              name: true,
            },
          },
        },
      },
      pool: {
        select: {
          category: true,
        },
      },
    },
  });
  if (!lastMatches) {
    throw new Error("No matches found for the given date");
  }
  const matchesData = lastMatches
    .map((team) => {
      let match = team.homeMatches.findLast((m) => {
        return m.day === day;
      });
      if (!match) {
        match = team.awayMatches.findLast((m) => {
          return m.day === day;
        });
      }
      if (!match) {
        throw new Error("Match not found");
      }
      const isHome = match.homeTeam.name === team.name;
      return {
        homeTeamName: match.homeTeam.name,
        awayTeamName: match.awayTeam.name,
        date: match.date,
        day: match.day,
        category: team.pool.category,
        isHome,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        isPlayed: match.isPlayed,
        isDisqualified: match.isDisqualified,
        isForfeit: match.isForfeit,
      };
    })
    .sort((a, b) => {
      if (a.isHome && b.isHome)
        return a.homeTeamName.localeCompare(b.homeTeamName);
      if (a.isHome && !b.isHome)
        return a.homeTeamName.localeCompare(b.awayTeamName);
      if (!a.isHome && b.isHome)
        return a.awayTeamName.localeCompare(b.homeTeamName);
      return a.awayTeamName.localeCompare(b.awayTeamName);
    });
  return matchesData;
};

export const sendMailResultsHandler = async () => {
  const wantedStories = await findCategoryAndDay();
  if (!wantedStories) {
    return;
  }
  const generatedImages: Attachments[] = [];
  // launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const [cat, day] of Object.entries(wantedStories)) {
    const page = await browser.newPage();
    // Define viewport size
    await page.setViewport({ width: 1200, height: 800 });

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/teamChampionship/storyResult?category=${cat}&day=${day}`;
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }); // cspell: words networkidle
    await page.waitForSelector("#story-export", { timeout: 15000 });

    const element = await page.$("#story-export");
    if (!element) {
      await page.close();
      continue;
    }
    const imageBuffer = await element.screenshot({
      type: "png",
    });
    generatedImages.push({
      filename: `${cat.toLowerCase()}-day${day}.png`,
      content: imageBuffer as Buffer,
    });
    await page.close();
  }
  await browser.close();
  sendStoryImage(process.env.MAIL!, generatedImages);
};
