"use client";
import { FlowerCanvas } from "@/components/custom/flowers";
import { CustomFooter } from "@/components/custom/footer";
import { generateClubTeamsColumns } from "@/components/tables/clubTeams/columns";
import { DataTable } from "@/components/tables/data-table";
import { Compare } from "@/components/ui/compare";
import { Skeleton } from "@/components/ui/skeleton";
import { SparklesCore } from "@/components/ui/sparkles";
import { WheelPicker, WheelPickerWrapper } from "@/components/ui/wheel-picker";
import { cn } from "@/lib/utils";
import { replaceTeamName } from "@/lib/utils/replaceTeamName";
import { trpc } from "@/server/client";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  CalendarDays,
  House,
  Plane,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SocialNetworkSection } from "../page";

export default function HomePage() {
  const { data: nextMatches } = trpc.dashboard.getNextMatches.useQuery();
  const categoryWhichPlayed = new Set(
    nextMatches?.map((m) => {
      return m.category;
    }),
  );
  const [windowWidth, setWindowWidth] = React.useState(0);
  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  return (
    <div className="relative mx-auto bg-neutral-900 flex flex-col items-center overflow-hidden rounded-md relative">
      <div className="relative mb-20 min-h-screen h-full bg-neutral-900 w-full">
        <HeaderSection />
        <FirstSection windowWidth={windowWidth} />
        {windowWidth >= 425 && (
          <FlowerCanvas
            canvasId="team-championship-hero"
            firstFlowersPointer={[{ x: 0.9, y: 0.7 }]}
            flowerScale={0.5}
          />
        )}
      </div>
      <div className="bg-gradient-to-b from-neutral-900 to-indigo-900/50 h-30 w-full"></div>
      <TableSection
        windowWidth={windowWidth}
        categoryWhichPlayed={Array.from(categoryWhichPlayed)}
      />
      <div className="bg-gradient-to-b from-blue-900 to-[#e3c671]/70 h-30 w-full"></div>
      <NextMatchesSection windowWidth={windowWidth} nextMatches={nextMatches} />
      <div className="bg-gradient-to-b from-[#e3c671]/80 to-slate-950 h-40 w-full"></div>
      <div className="relative flex w-full z-10 ">
        <SocialNetworkSection
          className="relative overflow-hidden"
          textClassName="z-10"
        />
        <FlowerCanvas
          firstFlowersPointer={[
            { x: 0.1, y: 0.35 },
            { x: 0.3, y: 0.8 },
            { x: 0.5, y: 0.9 },
            { x: 0.7, y: 0.8 },
            { x: 0.9, y: 0.35 },
          ]}
          flowerScale={0.8}
        />
      </div>
      <CustomFooter />
    </div>
  );
}

const HeaderSection = () => {
  // const sendMailResultsMutation = trpc.pdf.sendMailResults.useMutation();
  return (
    <>
      {/* Computer version */}
      <div className="hidden md:block pt-35 md:pt-40 md:pb-10 relative">
        <div className="z-10 w-full flex items-center justify-center h-60 relative mt-3 mb-5">
          <FlowerCanvas
            firstFlowersPointer={[
              { x: 0.1, y: 0.5 },
              { x: 0.9, y: 0.5 },
            ]}
            flowerScale={0.97}
          />
          <h2 className="inset-0 flex items-center justify-center sm:text-6xl text-5xl lg:text-7xl font-bold text-center text-white z-20 pointer-events-none">
            Championnat par équipe
          </h2>
          <div className="pointer-events-none w-full h-full absolute top-0 bg-gradient-to-t from-transparent via-transparent to-neutral-900 blur-sm z-[12]"></div>
          <div className="pointer-events-none w-full h-full absolute top-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900 blur-sm z-[12]"></div>

          <SparklesCore
            background="transparent"
            minSize={0.8}
            maxSize={1.5}
            particleDensity={200}
            className="w-full h-full absolute inset-0 pointer-events-none z-[11]"
            particleColor="#FFFFFF"
          />
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden pt-25">
        <div className="w-full h-60 relative mt-3 mb-5">
          <FlowerCanvas
            firstFlowersPointer={[
              { x: 0.1, y: 0.5 },
              { x: 0.9, y: 0.5 },
            ]}
            flowerScale={1}
          />
          <h2 className="sm:text-6xl text-5xl font-bold text-center text-white relative z-20 pt-20 pointer-events-none">
            Championnat par équipe
          </h2>
          {/* Core component */}
          <div className="pointer-events-none w-full h-full absolute top-0 bg-gradient-to-t from-transparent via-transparent to-neutral-900 blur-sm z-[19]"></div>
          <div className="pointer-events-none w-full h-full absolute top-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900 blur-sm z-[19]"></div>
          <SparklesCore
            background="transparent"
            minSize={0.8}
            maxSize={1.5}
            particleDensity={400}
            className="w-full h-full absolute inset-0 pointer-events-none z-[11]"
            particleColor="#FFFFFF"
          />
        </div>
      </div>
    </>
  );
};

const CurrentSeasonComponent = () => {
  const date = new Date();
  const currentSeason =
    date.getMonth() >= 8
      ? `${date.getFullYear()}-${date.getFullYear() + 1}`
      : `${date.getFullYear() - 1}-${date.getFullYear()}`;
  return (
    <div className="pointer-events-auto z-10 mx-auto w-full max-w-130 bg-[#0c7e3a] relative rounded-2xl overflow-hidden">
      <div className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]  sm:mx-0 sm:rounded-2xl overflow-hidden">
        <div className="h-51 px-4 py-10 sm:px-10">
          <div className="flex justify-between items-center gap-4 mb-4">
            <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold text-white">
              Saison
            </h3>
            <CalendarDays className="h-7 w-7 text-white" />
          </div>
          <p className="text-3xl font-bold text-white pt-3">{currentSeason}</p>
          <p className="text-xs text-white font-medium">Championnat FFT</p>
        </div>
      </div>
    </div>
  );
};

const TeamCountComponent = ({ teamCount }: { teamCount: number }) => {
  return (
    <div className="pointer-events-auto z-10 mx-auto w-full max-w-130 bg-pink-800 relative rounded-2xl overflow-hidden">
      <div className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]  sm:mx-0 sm:rounded-2xl overflow-hidden">
        <div className="h-51 px-4 py-10 sm:px-10">
          <div className="flex justify-between items-center gap-4 mb-4">
            <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold text-white">
              Équipes
            </h3>
            <Users className="h-7 w-7 text-white" />
          </div>
          <p className="text-3xl font-bold text-white pt-3">{teamCount}</p>
          <p className="text-xs text-white font-medium">Équipes actives</p>
        </div>
      </div>
    </div>
  );
};

const MatchCountComponent = ({ matchCount }: { matchCount: number }) => {
  return (
    <div className="mx-auto w-full bg-indigo-800 relative rounded-2xl overflow-hidden">
      <div className="relative  h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]  sm:mx-0 sm:rounded-2xl overflow-hidden">
        <div className="md:h-51 px-4 py-10 sm:px-10">
          <div className="flex justify-between items-center gap-4 mb-4">
            <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold text-white">
              Rencontres Jouées
            </h3>
            <Target className="h-7 w-7 text-white" />
          </div>
          <p className="text-3xl font-bold text-white pt-3">{matchCount}</p>
          <p className="text-xs text-white font-medium">Cette saison</p>
        </div>
      </div>
    </div>
  );
};

const StatistiquesComponent = ({
  victoryCount,
  drawCount,
  lossCount,
}: {
  victoryCount: number;
  drawCount: number;
  lossCount: number;
}) => {
  return (
    <div className="mx-auto w-full bg-[#a4b03d] relative rounded-2xl overflow-hidden">
      <div className="relative  h-full text-white [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]  sm:mx-0 sm:rounded-2xl overflow-hidden">
        <div className="md:h-51 px-4 py-10 sm:px-10 text-white">
          <div className="flex justify-between items-center gap-4 mb-3 ">
            <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold">
              Statistiques
            </h3>
            <Trophy className="h-7 w-7 " />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Wins */}
            <div className="space-y-1">
              <div className="text-3xl font-bold pt-3">{victoryCount}</div>
              <div className="text-xs font-medium">Victoires</div>
            </div>

            {/* Draws */}
            <div className="space-y-1">
              <div className="text-3xl font-bold pt-3">{drawCount}</div>
              <div className="text-xs font-medium">Nuls</div>
            </div>

            {/* Losses */}
            <div className="space-y-1">
              <div className="text-3xl font-bold pt-3">{lossCount}</div>
              <div className="text-xs font-medium">Défaites</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlinkingCircles = () => {
  const [isDisplayed, setIsDisplayed] = React.useState(true);
  if (!isDisplayed) return null;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const canvas = document.getElementById("team-championship-hero");
    if (canvas) {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        clientX: event.clientX,
        clientY: event.clientY,
      });
      canvas.dispatchEvent(clickEvent);
    }
    setIsDisplayed(false);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Faire pousser une fleur"
      className={cn(
        "group absolute left-1/15 top-13/20 h-12 w-12 rounded-full hover:cursor-pointer z-10",
        "transition-all duration-300 hover:scale-[1.06] active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffe0] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
      )}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fff6c8]/50 via-[#ffffe0]/50 to-[#e3c671]/50 opacity-50 shadow-[0_0_18px_rgba(255,246,200,0.5)]" />
      <span className="absolute -inset-4 rounded-full border border-[#ffffe0]/35 bg-[#ffffff]/10 blur-[2px] animate-pulse" />
      <span className="absolute -inset-8 rounded-full border border-[#ffffff]/25 opacity-40 bg-[#ffffff]/10" />
      <span className="absolute left-1/2 top-2.5 h-2 w-2 -translate-x-1/2 rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute left-7 bottom-4 h-1.5 w-1.5 rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute right-7 bottom-5 h-1.5 w-1.5 rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-[#ffffe0]/90 px-3 py-1 text-[11px] font-semibold text-[#524932] opacity-0 shadow-lg transition-all duration-300 group-hover:-top-7 group-hover:opacity-100">
        Cliquez pour planter
      </span>
    </button>
  );
};

const FirstSection = ({ windowWidth }: { windowWidth: number }) => {
  const { data: firstSectionData, isLoading } =
    trpc.dashboard.getInformation.useQuery();
  if (isLoading) {
    return (
      <div className="flex gap-6 w-full px-10 h-full h-51 flex-col">
        {/* Current Season Skeleton */}
        <div className="mx-auto w-full max-w-130 bg-[#0c7e3a] relative rounded-2xl overflow-hidden">
          <div className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden">
            <div className="h-51 px-4 py-10 sm:px-10">
              <div className="flex justify-between items-center gap-4 mb-4">
                <Skeleton className="h-6 w-20 bg-white/20" />
                <Skeleton className="h-7 w-7 rounded bg-white/20" />
              </div>
              <Skeleton className="h-9 w-32 bg-white/30 mt-3" />
              <Skeleton className="h-3 w-28 bg-white/20 mt-1" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:mx-auto gap-6 items-center lg:min-w-230 relative">
          {/* Team Count Skeleton */}
          <div className="w-full bg-pink-800 relative rounded-2xl overflow-hidden">
            <div className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden">
              <div className="h-51 px-4 py-10 sm:px-10">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <Skeleton className="h-6 w-16 bg-white/20" />
                  <Skeleton className="h-7 w-7 rounded bg-white/20" />
                </div>
                <Skeleton className="h-9 w-12 bg-white/30 mt-3" />
                <Skeleton className="h-3 w-24 bg-white/20 mt-1" />
              </div>
            </div>
          </div>

          {/* Match Count Skeleton */}
          <div className="w-full bg-indigo-800 relative rounded-2xl overflow-hidden">
            <div className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden">
              <div className="h-51 px-4 py-10 sm:px-10">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <Skeleton className="h-6 w-16 bg-white/20" />
                  <Skeleton className="h-7 w-7 rounded bg-white/20" />
                </div>
                <Skeleton className="h-9 w-12 bg-white/30 mt-3" />
                <Skeleton className="h-3 w-24 bg-white/20 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!firstSectionData) return null;
  return (
    <div className="z-10 flex gap-6 w-full px-10 h-full h-51 flex-col">
      {windowWidth >= 425 && <BlinkingCircles />}
      <CurrentSeasonComponent />
      <div className="flex flex-col lg:flex-row lg:mx-auto gap-6 items-center lg:min-w-230 relative">
        <TeamCountComponent teamCount={firstSectionData.teamCount} />
        <Compare
          firstComponent={
            <MatchCountComponent matchCount={firstSectionData.matchCount} />
          }
          secondComponent={
            <StatistiquesComponent
              victoryCount={firstSectionData.victoryCount}
              drawCount={firstSectionData.drawCount}
              lossCount={
                firstSectionData.matchCount -
                firstSectionData.victoryCount -
                firstSectionData.drawCount
              }
            />
          }
          firstComponentClassName=""
          secondComponentClassName=""
          className="h-51 max-w-130 w-full"
          slideMode="hover"
          initialSliderPercentage={100}
        />
      </div>
    </div>
  );
};

const TableSection = ({
  categoryWhichPlayed,
  windowWidth,
}: {
  windowWidth: number;
  categoryWhichPlayed: string[];
}) => {
  const router = useRouter();
  const { data: tableTeams, isLoading } =
    trpc.dashboard.getTableTeams.useQuery();
  const [dayNumber, setDayNumber] = React.useState(0);
  useEffect(() => {
    setDayNumber(
      tableTeams
        ? tableTeams
            .filter((t) => t.name.includes("OCM 1 - SH"))[0]
            .matchResults.reduce(
              (acc, curr) =>
                Math.max(acc, curr.result !== "notPlayed" ? curr.day : 0),
              0,
            ) - 1
        : 0,
    );
  }, [tableTeams]);

  const redirectToPoolPage = (poolId: string) => {
    router.push(`/teamChampionship/pool/${poolId}`);
  };
  if (isLoading || !tableTeams) return null;

  return (
    <div className="relative flex flex-col bg-gradient-to-b from-indigo-900/50 via-indigo-900 to-blue-900 pb-15 w-full px-3 min-h-screen">
      {windowWidth >= 425 && (
        <FlowerCanvas
          firstFlowersPointer={[
            { x: 0.1, y: 0.3 },
            { x: 0.4, y: 0.8 },
            { x: 0.6, y: 0.8 },
            { x: 0.9, y: 0.3 },
          ]}
          flowerScale={0.5}
        />
      )}
      <div className="relative flex items-center justify-center w-full mx-auto max-w-260 pt-15">
        <FlowerCanvas
          firstFlowersPointer={[
            { x: 0.3, y: 0.5 },
            { x: 0.7, y: 0.5 },
          ]}
          flowerScale={1.7}
        />
        <h3 className="pointer-events-none text-4xl text-white font-bold text-center mb-15 z-20">
          Nos Équipes
        </h3>
      </div>
      <div className="pointer-events-auto mx-auto container max-w-260 z-20">
        <DataTable
          columns={generateClubTeamsColumns({
            dayNumber,
            setDayNumber,
            maxDayNumber: tableTeams
              .map((t) => t.pool.dayNumber)
              .reduce((a, b) => Math.max(a, b), 0),
            defaultCategoryFilter: categoryWhichPlayed,
            redirectToPoolPage,
          })}
          data={tableTeams}
          noResultMessage={"Aucune équipe trouvée"}
        />
      </div>
    </div>
  );
};

const NextMatchesSection = ({
  nextMatches,
  windowWidth,
}: {
  windowWidth: number;
  nextMatches:
    | {
        date: string;
        day: number;
        category: string;
        subcategory: string | null;
        ballColor: string;
        division: string;
        opponentName: string;
        ourTeamName: string;
        isHome: boolean;
        poolName: string;
        totalDayCount: number;
      }[]
    | undefined;
}) => {
  const [nextMatchesIndex, setNextMatchesIndex] = React.useState(0);

  if (!nextMatches) {
    return null;
  }

  if (nextMatches.length === 0) {
    return (
      <div className="relative flex flex-col bg-gradient-to-b from-[#e3c671]/70 via-[#e3c671] to-[#e3c671]/80 pt-15 pb-15 w-full px-3">
        {windowWidth >= 425 && (
          <FlowerCanvas
            firstFlowersPointer={[
              { x: 0.06, y: 0.6 },
              { x: 0.94, y: 0.6 },
            ]}
            flowerScale={0.5}
          />
        )}
        <div className="relative flex items-center justify-center pt-15 w-full mx-auto max-w-260">
          <FlowerCanvas
            firstFlowersPointer={[
              { x: 0.2, y: 0.4 },
              { x: 0.8, y: 0.4 },
            ]}
            flowerScale={1.7}
          />
          <h3 className="pointer-events-none text-4xl text-white font-bold text-center mb-8 z-20">
            Prochaines Rencontres
          </h3>
        </div>
        <div className="relative mx-auto container max-w-260 bg-[#6b5e39] border border-[#6b5e39]/50 rounded-2xl pt-10 z-20">
          {windowWidth >= 425 && (
            <FlowerCanvas
              firstFlowersPointer={[
                { x: 0.1, y: 0.7 },
                { x: 0.25, y: 0.4 },
                { x: 0.75, y: 0.4 },
                { x: 0.9, y: 0.7 },
              ]}
              flowerScale={0.9}
            />
          )}
          <div className="pointer-events-none relative pt-20 pb-10 z-20">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 via-white/40 to-white/20 transform -translate-x-1/2 h-60"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-full mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="justify-center flex flex-col w-full text-center mt-20">
              <h4 className="text-2xl font-bold text-white mb-2 z-20">
                Aucune rencontre programmée
              </h4>
              <p className="text-white/80">
                Les prochaines rencontres apparaîtront ici dès leur
                planification
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const groupMatchesByDate = (
    nextMatches: {
      date: string;
      day: number;
      category: string;
      subcategory: string | null;
      ballColor: string;
      division: string;
      opponentName: string;
      ourTeamName: string;
      isHome: boolean;
      poolName: string;
      totalDayCount: number;
    }[],
  ) => {
    const groupedMatches = nextMatches.reduce(
      (groups, match) => {
        const dateKey = match.date
          ? format(new Date(match.date), "yyyy-MM-dd")
          : "no-date";
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(match);
        return groups;
      },
      {} as Record<string, typeof nextMatches>,
    );

    const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
      if (a === "no-date") return 1;
      if (b === "no-date") return -1;
      return new Date(a).getTime() - new Date(b).getTime();
    });
    return sortedDates.map((date) => ({
      date,
      matches: groupedMatches[date].sort((a, b) => {
        if (
          a.category === "Jeunes" &&
          b.category === "Jeunes" &&
          a.subcategory &&
          b.subcategory
        ) {
          return a.subcategory.localeCompare(b.subcategory, undefined, {
            numeric: true,
          }); // Sort by subcategory for Jeunes
        }
        return a.category.localeCompare(b.category); // Sort by category
      }),
    }));
  };
  const groupedData = groupMatchesByDate(nextMatches);
  const wheelPickerEnabledOptions = groupedData.map(
    ({ date, matches }, index) => ({
      label: (
        <div className="">
          <h4 className="text-2xl font-bold">
            {format(new Date(date), "EEEE dd MMMM yyyy", {
              locale: fr,
            }).replace(
              /^\w/,
              (c) => c.toUpperCase(), // Capitalize first letter
            )}
          </h4>
          <p className="text-lg text-center opacity-80">
            {`${matches.length} rencontre${matches.length > 1 ? "s" : ""} programmée${matches.length > 1 ? "s" : ""}`}
          </p>
        </div>
      ),
      value: index + 1,
      disabled: false,
    }),
  );

  // Have the last week matches in first position and disabled to fill the wheel picker and have the next matches in the best position
  const wheelPickerOptions = [
    {
      label: (
        <div className="">
          <h4 className="text-2xl font-bold">
            {format(subDays(groupedData[0].date, 7), "EEEE dd MMMM yyyy", {
              locale: fr,
            }).replace(
              /^\w/,
              (c) => c.toUpperCase(), // Capitalize first letter
            )}
          </h4>
          <p className="text-lg text-center opacity-80">
            0 rencontre programmée
          </p>
        </div>
      ),
      value: 0,
      disabled: true,
    },
  ].concat(wheelPickerEnabledOptions);
  return (
    <div className="relative flex flex-col bg-gradient-to-b from-[#e3c671]/70 via-[#e3c671] to-[#e3c671]/80 pb-15 w-full px-3">
      {windowWidth >= 425 && (
        <FlowerCanvas
          key={`flower-bg-${nextMatchesIndex}`}
          firstFlowersPointer={[
            { x: 0.1, y: 0.3 },
            { x: 0.9, y: 0.3 },
          ]}
          flowerScale={0.5}
        />
      )}
      <div className="relative flex items-center justify-center pt-15 w-full mx-auto max-w-160">
        <FlowerCanvas
          firstFlowersPointer={[
            { x: 0.1, y: 0.6 },
            { x: 0.9, y: 0.6 },
          ]}
          flowerScale={1.4}
        />
        <h3 className="text-4xl text-white font-bold text-center mb-8 z-20 pointer-events-none">
          Prochaines Rencontres
        </h3>
      </div>

      <div className="pointer-events-none mx-auto container px-4 flex flex-col items-center justify-center gap-4 z-20">
        <div className="w-full max-w-160 mb-10">
          <WheelPickerWrapper className="pointer-events-auto bg-[#6b5e39] border-none">
            <WheelPicker
              options={wheelPickerOptions}
              onValueChange={(value) => {
                setNextMatchesIndex(value - 1);
              }}
              classNames={{
                optionItem: "text-white/80 justify-self-start",
                highlightItem: "",
                highlightWrapper: "bg-[#ffffe0] text-[#524932] max-h-21",
              }}
              optionItemHeight={100}
              defaultValue={1}
              visibleCount={8}
            />
          </WheelPickerWrapper>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={nextMatchesIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "w-full grid gap-6 grid-cols-1 pointer-events-none",
              groupedData[nextMatchesIndex].matches.length === 2
                ? "lg:grid-cols-2"
                : "",
              groupedData[nextMatchesIndex].matches.length >= 3
                ? "lg:grid-cols-2 xl:grid-cols-3"
                : "",
            )}
          >
            {groupedData[nextMatchesIndex].matches.map((match, index) => (
              <NextMatchCard
                match={match}
                index={index}
                key={`${match.date}-${index}`}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const NextMatchCard = ({
  match,
  index,
}: {
  match: {
    date: string;
    day: number;
    category: string;
    subcategory: string | null;
    ballColor: string;
    division: string;
    opponentName: string;
    ourTeamName: string;
    isHome: boolean;
    totalDayCount: number;
  };
  index: number;
}) => {
  return (
    <motion.div
      key={`${match.date}-${index}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100, rotateX: 15 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl max-w-130 mx-auto pointer-events-auto",
        "bg-gradient-to-br from-[#6b5e39]/95 via-[#524932]/90 to-[#4a4128]/90 backdrop-blur-md",
        "border border-[#ffffe0]/15",
        "hover:border-[#ffffe0]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#e3c671]/20",
      )}
    >
      {/* Gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffe0]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top section with location and day */}
      <div className="relative p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                match.isHome
                  ? "bg-gradient-to-r from-green-700/30 to-emerald-700/30 text-green-300 group-hover:from-green-700/40 group-hover:to-emerald-700/40"
                  : "bg-gradient-to-r from-[#ffffe0]/20 to-[#e3c671]/20 text-[#ffffe0] group-hover:from-[#ffffe0]/30 group-hover:to-[#e3c671]/30"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-xl ${match.isHome ? "bg-green-700/15" : "bg-[#ffffe0]/10"} blur-sm`}
              />
              {match.isHome ? (
                <House className="relative h-4 w-4 z-10" />
              ) : (
                <Plane className="relative h-4 w-4 z-10" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#ffffe0]/90 group-hover:text-[#ffffe0] transition-colors">
                {match.isHome ? "Domicile" : "Extérieur"}
              </span>
              <span className="text-xs text-[#e3c671]/80">
                {match.isHome ? "Salle Louis Darcel" : "Déplacement"}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e3c671] to-[#ffffe0] rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="font-bold text-md relative bg-gradient-to-r from-[#e3c671]/95 to-[#ffffe0]/95 text-[#524932] px-3 py-2 rounded-lg backdrop-blur-sm border border-[#ffffe0]/20">
              J{match.day}/{match.totalDayCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative px-5 pb-4">
        <div className="mb-4">
          <div className="text-lg font-bold text-[#ffffe0] mb-1 group-hover:text-[#e3c671] transition-colors">
            {match.category === "Jeunes"
              ? match.subcategory +
                (match.ballColor === "green"
                  ? " (Vert)"
                  : match.ballColor === "orange"
                    ? " (Orange)"
                    : "")
              : ""}
            {" - "}
            {match.ourTeamName}
          </div>
          <div className="text-xs text-[#ffffe0]/80 bg-[#524932]/30 px-2 py-1 rounded-md inline-block border border-[#6b5e39]/40">
            {match.division}
          </div>
        </div>

        {/* Opponent section with enhanced styling */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-[#e3c671] to-orange-400" />
          <div className="ml-10 text-base font-bold text-[#ffffe0] group-hover:text-[#e3c671] transition-colors duration-300">
            <span className="text-orange-400 mr-1">vs</span>
            {replaceTeamName(match.opponentName)}
          </div>
        </div>
      </div>

      {/* Bottom decoration with modern animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1">
        <div className="h-full bg-gradient-to-r from-[#6b5e39] via-[#e3c671] to-[#ffffe0] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-[#ffffe0]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-3 right-7 flex items-center gap-1.5">
        <div className="w-2 h-2 bg-[#e3c671] rounded-full animate-pulse shadow-lg shadow-[#e3c671]/50" />
        <div
          className="w-1.5 h-1.5 bg-[#ffffe0] rounded-full animate-pulse shadow-md shadow-[#ffffe0]/50"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="w-1 h-1 bg-[#6b5e39] rounded-full animate-pulse shadow-sm shadow-[#6b5e39]/50"
          style={{ animationDelay: "0.6s" }}
        />
      </div>
    </motion.div>
  );
};
