"use client";

import { SocialNetworkSection } from "@/app/page";
import { CustomFooter } from "@/components/custom/footer";
import {
  BallInstance,
  handlePageClick,
  TennisBall,
} from "@/components/custom/tennis";
import {
  poolRankingColumns,
  PoolRankingTable,
} from "@/components/tables/poolRanking/columns";
import { PoolRankingTable as PoolRankingTableComponent } from "@/components/tables/poolRanking/poolRankingTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryNicknames } from "@/constant";
import { cn } from "@/lib/utils";
import { replaceTeamName } from "@/lib/utils/replaceTeamName";
import { trpc } from "@/server/client";
import clsx from "clsx";
import { isBefore, isSameDay } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Home,
  Plane,
  Trophy,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

type Team = {
  id: number;
  name: string;
  points: number;
  rank: number;
  fromClub: boolean;
};
type MatchesGrouped = {
  day: number;
  matches: Match[];
};
type Match = {
  day: number;
  id: number;
  date: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  isPlayed: boolean;
  isForfeit: boolean;
  isDisqualified: boolean;
};

// Fonction pour calculer les statistiques d'une équipe
const getTeamStats = ({
  previousMatches,
  teamId,
}: {
  previousMatches: MatchesGrouped[];
  teamId: number;
}) => {
  const teamMatches = previousMatches
    .map(({ matches }) => matches)
    .flat()
    .filter(
      ({ awayTeamId, homeTeamId }) =>
        homeTeamId === teamId || awayTeamId === teamId,
    );

  return teamMatches.reduce(
    (acc, match) => {
      if (match.homeTeamId === teamId) {
        if (match.homeScore! > match.awayScore!) acc.wins++;
        else if (match.homeScore! < match.awayScore!) acc.losses++;
        else if (match.homeScore !== null && match.awayScore !== null)
          acc.draws++;
      } else {
        if (match.awayScore! > match.homeScore!) acc.wins++;
        else if (match.awayScore! < match.homeScore!) acc.losses++;
        else if (match.awayScore !== null && match.homeScore !== null)
          acc.draws++;
      }
      return acc;
    },
    { wins: 0, losses: 0, draws: 0 },
  );
};

export default function HomePage() {
  const { poolID } = useParams();
  const { data, isLoading } = trpc.pool.getInformation.useQuery({
    poolId: parseInt(poolID as string),
  });
  const [balls, setBalls] = React.useState<BallInstance[]>([]);

  // Préparer les données pour le DataTable
  const tableData: PoolRankingTable[] =
    data?.teams
      .map((team) => {
        const stats = getTeamStats({
          previousMatches: data.previousMatches,
          teamId: team.id,
        });
        return {
          id: team.id,
          name: team.name,
          points: team.points,
          rank: team.rank,
          fromClub: team.fromClub,
          wins: stats.wins,
          draws: stats.draws,
          losses: stats.losses,
        };
      })
      .sort((a, b) => a.rank - b.rank) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-20 bg-gray-800 rounded-lg animate-pulse shadow-sm" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-800 rounded-lg animate-pulse shadow-sm"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-800 rounded-lg animate-pulse shadow-sm" />
            <div className="h-96 bg-gray-800 rounded-lg animate-pulse shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6 pt-50 text-center text-white">
        <p>Poule non trouvée</p>
      </div>
    );
  }

  const ourTeamName = data.teams.find((team) => team.fromClub)?.name;
  const categoryNickname: keyof typeof categoryNicknames =
    data.category === "Jeunes"
      ? (data.subcategory as keyof typeof categoryNicknames)
      : (data.category as keyof typeof categoryNicknames);
  const category = categoryNicknames[categoryNickname];

  const matchPlayedCount = data.previousMatches
    .map(({ matches }) => matches.filter(({ isPlayed }) => isPlayed).length)
    .reduce((a, b) => a + b, 0);
  const teamCount = data.teams.length;
  const currentDay = Math.ceil(matchPlayedCount / (teamCount / 2));
  return (
    <div
      id="pool-page"
      className="min-h-screen relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 pt-30 w-full"
      onClick={(e) => handlePageClick(e, setBalls)}
    >
      <div className="max-w-7xl mx-auto space-y-6 pb-30">
        <TennisBall balls={balls} setBalls={setBalls} />
        <HeaderSection
          poolName={data.name}
          category={category}
          division={data.division}
          ballColor={data.ballColor}
          championshipId={data.championshipId.toString()}
          divisionId={data.divisionId.toString()}
          phaseId={data.phaseId.toString()}
          poolId={data.id.toString()}
          ourTeamName={ourTeamName || "OCM"}
          currentDay={currentDay}
          dayCount={teamCount - 1}
        />
        <ExplicationSection />
        <RankingSection tableData={tableData} />
        <NextMatchesSection
          matches={data.nextMatches}
          teams={data.teams}
          currentDay={currentDay}
        />
        <PreviousMatchesSection
          previousMatches={data.previousMatches}
          teams={data.teams}
        />
      </div>
      <CustomFooter className="bg-transparent border-t border-slate-600" />
    </div>
  );
}

const HeaderSection = ({
  poolName,
  category,
  division,
  ballColor,
  championshipId,
  divisionId,
  phaseId,
  poolId,
  ourTeamName,
  currentDay,
  dayCount,
}: {
  poolName: string;
  category: string;
  ballColor: string;
  division: string;
  championshipId: string;
  divisionId: string;
  phaseId: string;
  poolId: string;
  ourTeamName: string;
  currentDay: number;
  dayCount: number;
}) => {
  const tenupUrl = `https://tenup.fft.fr/championnat/${championshipId}?division=${divisionId}&phase=${phaseId}&poule=${poolId}`;
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-700 text-white border border-slate-600 shadow-2xl rounded-xl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-16 h-16 md:w-32 md:h-32 bg-blue-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-green-400/20 rounded-full blur-2xl"></div>
      </div>
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {category} - {ourTeamName}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500/20 text-green-200">
                {division}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-200 ">
                {poolName}
              </Badge>
              <a
                className="z-10 bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm font-medium"
                href={tenupUrl}
                target="_blank"
              >
                Ten'Up
                <ExternalLink className="h-4 w-4 inline-block ml-1" />
              </a>
              {ballColor !== "yellow" && (
                <img
                  src={`/ball/${ballColor}.png`}
                  alt={ballColor}
                  className={cn(
                    "md:hidden",
                    ballColor === "orange" ? "w-9 h-8" : "w-8 h-8",
                  )}
                />
              )}
            </div>
            {/* Barre de progression de la saison */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">
                  Journée {currentDay} sur {dayCount}
                </span>
                <span className="text-xs text-slate-400">
                  {Math.round((currentDay / dayCount) * 100)}% terminé
                </span>
              </div>
              <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min((currentDay / dayCount) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          {ballColor !== "yellow" && (
            <div className="hidden md:flex mr-5 font-semibold gap-1 justify-center items-center flex-col">
              <img
                src={`/ball/${ballColor}.png`}
                alt={ballColor}
                className={cn(
                  "w-full",
                  ballColor === "orange" ? "ml-2 w-23 h-20" : "w-20 h-20",
                )}
              />
              Format {ballColor === "orange" ? "Orange" : "Vert"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExplicationSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-700 border border-slate-600 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500">
      {/* Effets de brillance */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>

      <CardHeader
        className="z-10 relative bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-b border-slate-600 hover:cursor-pointer"
        onClick={toggleExpanded}
      >
        <CardTitle className="flex items-center gap-3 text-indigo-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold">Règles du Championnat</span>
          <Button
            className="ml-auto bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 hover:border-indigo-400/50 rounded-lg hover:transition-all duration-200 hover:cursor-pointer"
            aria-label={isExpanded ? "Réduire" : "Développer"}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <div
        className={clsx("z-3 transition-all duration-300 overflow-hidden", {
          "max-h-none opacity-100": isExpanded,
          "max-h-0 opacity-0": !isExpanded,
        })}
      >
        <CardContent className="relative p-6 bg-gradient-to-b from-transparent to-slate-800/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Format du jeu */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-2 rounded-lg border border-blue-500/30">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-blue-300">
                  Format de Jeu
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <Badge className="bg-green-500/20 text-green-300 mb-2">
                    Simple
                  </Badge>
                  <p className="text-sm text-slate-300">2 sets à 6 jeux</p>
                  <p className="text-sm text-slate-300">
                    3ème set en SJD à 10 points
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <Badge className="bg-purple-500/20 text-purple-300 mb-2">
                    Double
                  </Badge>
                  <p className="text-sm text-slate-300">
                    2 sets à 6 jeux • Point décisif
                  </p>
                  <p className="text-sm text-slate-300">
                    3ème set en SJD à 10 points
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <Badge className="bg-amber-500/20 text-amber-300 mb-2">
                    Rencontres
                  </Badge>
                  <p className="text-sm text-slate-300">3 simples / 1 double</p>
                </div>
              </div>
            </div>

            {/* Points par rencontre */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-2 rounded-lg border border-yellow-500/30">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-yellow-300">
                  Barème des Points
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                  <span className="text-sm font-medium text-slate-300">
                    Victoire
                  </span>
                  <Badge className="bg-green-500/20 text-green-300 font-semibold">
                    +3 points
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                  <span className="text-sm font-medium text-slate-300">
                    Match nul
                  </span>
                  <Badge className="bg-blue-500/20 text-blue-300 font-semibold">
                    +2 points
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                  <span className="text-sm font-medium text-slate-300">
                    Défaite
                  </span>
                  <Badge className="bg-orange-500/20 text-orange-300 font-semibold">
                    +1 point
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                  <span className="text-sm font-medium text-slate-300">
                    Disqualification
                  </span>
                  <Badge className="bg-red-500/20 text-red-400 font-semibold">
                    -1 point
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                  <span className="text-sm font-medium text-slate-300">
                    Forfait
                  </span>
                  <Badge className="bg-red-600/20 text-red-300 font-semibold">
                    -2 points
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const RankingSection = ({ tableData }: { tableData: PoolRankingTable[] }) => {
  return (
    <div className="xl:col-span-2">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-700 border border-slate-600 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-full blur-2xl"></div>
        <CardHeader className="relative bg-gradient-to-r from-yellow-600/10 to-amber-600/10 border-b border-slate-600">
          <CardTitle className="flex items-center gap-3 text-yellow-200">
            <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-2 rounded-xl shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Classement</span>
            <div className="ml-auto bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium border border-yellow-700/50">
              {tableData.length} équipe{tableData.length > 1 ? "s" : ""}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6 bg-gradient-to-b from-transparent to-slate-800/30">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-600 overflow-hidden">
            <PoolRankingTableComponent
              columns={poolRankingColumns}
              data={tableData}
              noResultMessage="Aucune équipe trouvée"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const HeaderMatchCard = ({
  matchesCount,
  day,
  toggleDay,
  openedDays,
  color,
}: {
  matchesCount: number;
  day: number;
  toggleDay: (day: number) => void;
  openedDays: Record<number, boolean>;
  color: "purple" | "green";
}) => {
  return (
    <div
      className="z-10 relative flex items-center gap-3 border-b border-slate-600/50 pb-3 hover:cursor-pointer"
      onClick={() => toggleDay(day)}
    >
      <div
        className={clsx(
          "p-2 rounded-lg border ",
          color === "purple"
            ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20  border-purple-500/30"
            : "bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30",
        )}
      >
        <Calendar
          className={clsx("h-5 w-5", {
            "text-purple-400": color === "purple",
            "text-green-400": color === "green",
          })}
        />
      </div>
      <div className="flex-1">
        <h3
          className={clsx("text-lg font-bold", {
            "text-purple-200": color === "purple",
            "text-green-200": color === "green",
          })}
        >
          Journée {day}
        </h3>
        <p className="text-sm text-slate-400">
          {matchesCount} rencontre
          {matchesCount > 1 ? "s" : ""}{" "}
          {color === "purple" ? "programmée" : "jouée"}
          {matchesCount > 1 ? "s" : ""}
        </p>
      </div>
      <Button
        className={clsx(
          "rounded-lg hover:transition-all duration-200 border hover:cursor-pointer",
          color === "purple"
            ? "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 border-purple-500/30 hover:border-purple-400/50"
            : "bg-green-600/20 hover:bg-green-600/30 text-green-300 hover:text-green-200 border-green-500/30 hover:border-green-400/50",
        )}
        aria-label={openedDays[day] ? "Développer" : "Réduire"}
      >
        {openedDays[day] ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

const NextMatchCard = ({
  isClubMatch,
  isHome,
  match,
  homeTeam,
  awayTeam,
}: {
  isClubMatch: boolean;
  isHome: boolean;
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}) => {
  return (
    <div
      key={match.id}
      className={clsx(
        "relative overflow-hidden p-4 bg-gradient-to-br from-slate-700/80 to-slate-600/80 backdrop-blur-sm border border-slate-500 rounded-xl ",
        {
          "bg-purple-600 ": isClubMatch,
        },
      )}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-full blur-xl"></div>

      {/* En-tête de la rencontre */}
      <div className="flex items-center justify-between mb-3 gap-2">
        {isClubMatch && (
          <div className="flex items-center gap-2">
            <div
              className={clsx("p-1.5 rounded-lg", {
                "bg-green-600/20 text-green-400": isHome,
                "bg-blue-600/20 text-blue-400": !isHome,
              })}
            >
              {isHome ? (
                <Home className="h-3 w-3" />
              ) : (
                <Plane className="h-3 w-3" />
              )}
            </div>
            <span className="text-xs font-medium text-slate-300">
              {isHome ? "Domicile" : "Extérieur"}
            </span>
          </div>
        )}

        <div
          className={clsx("text-xs text-gray-400 ml-auto", {
            "h-6": !isClubMatch,
          })}
        >
          {isSameDay(new Date(match.date), new Date())
            ? "Résultats non connus"
            : isBefore(new Date(match.date), new Date())
              ? "Rencontre reportée, nouvelle date en attente"
              : new Date(match.date).toLocaleDateString("fr-FR")}
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="text-sm font-medium text-white">
          {homeTeam?.fromClub
            ? homeTeam?.name
            : replaceTeamName(homeTeam?.name || "")}
        </div>
        <div className="text-slate-400 text-sm">vs</div>
        <div className="text-sm font-medium text-white">
          {awayTeam?.fromClub
            ? awayTeam?.name
            : replaceTeamName(awayTeam?.name || "")}
        </div>
      </div>
      <div className="w-full h-1 bg-slate-600 rounded-full overflow-hidden mt-3">
        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

const NextMatchesSection = ({
  matches,
  teams,
  currentDay,
}: {
  matches: MatchesGrouped[];
  teams: Team[];
  currentDay: number;
}) => {
  const [openedDays, setOpenedDays] = useState<Record<number, boolean>>({});
  const toggleDay = (day: number) => {
    setOpenedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };
  if (matches.length === 0) return null;

  return (
    <div className="xl:col-span-3">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-700 border border-slate-600 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
        <CardHeader className="relative bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-slate-600">
          <CardTitle className="flex items-center gap-3 text-purple-200">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Prochaines Rencontres</span>
            <div className="ml-auto bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm font-medium border border-purple-700/50 text-center">
              {matches.length} rencontre
              {matches.length > 1 ? "s" : ""}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6 bg-gradient-to-b from-transparent to-slate-800/30 space-y-8">
          {matches.map(({ day, matches }) => {
            if (day === currentDay + 1 && openedDays[day] === undefined) {
              toggleDay(day);
            }
            return (
              <div key={day} className="space-y-4">
                <HeaderMatchCard
                  matchesCount={matches.length}
                  day={day}
                  toggleDay={toggleDay}
                  openedDays={openedDays}
                  color="purple"
                />
                <div
                  className={clsx(
                    "transition-all duration-300 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4",
                    {
                      "max-h-none opacity-100": openedDays[day],
                      "max-h-0 opacity-0": !openedDays[day],
                    },
                  )}
                >
                  {matches.map((match) => {
                    const homeTeam = teams.find(
                      (t) => t.id === match.homeTeamId,
                    );
                    const awayTeam = teams.find(
                      (t) => t.id === match.awayTeamId,
                    );
                    if (!homeTeam || !awayTeam) return null;
                    const isClubMatch = homeTeam.fromClub || awayTeam.fromClub;
                    const isHome = homeTeam.fromClub;
                    return (
                      <NextMatchCard
                        key={match.id}
                        isClubMatch={isClubMatch}
                        isHome={isHome}
                        match={match}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

const PreviousMatchCard = ({
  isClubMatch,
  isHome,
  match,
  homeTeam,
  awayTeam,
}: {
  isClubMatch: boolean;
  isHome: boolean;
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}) => {
  const router = useRouter();
  const { poolID } = useParams();
  return (
    <div
      key={match.id}
      className={clsx(
        "hover:cursor-pointer relative overflow-hidden p-4 bg-gradient-to-br from-slate-700/80 to-slate-600/80 backdrop-blur-sm border border-slate-500 rounded-xl hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 group",
        { "bg-green-500 ": isClubMatch },
        "relative z-10 pointer-events-auto",
      )}
      onClick={() =>
        router.push(`/teamChampionship/pool/${poolID}/match/${match.id}`)
      }
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-xl"></div>

      {/* En-tête de la rencontre */}
      <div className="flex items-center justify-between mb-3">
        {isClubMatch && (
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-green-600/20 text-green-400`}>
              {isHome ? (
                <Home className="h-3 w-3" />
              ) : (
                <Plane className="h-3 w-3" />
              )}
            </div>
            <span className="text-xs font-medium text-slate-300">
              {isHome ? "Domicile" : "Extérieur"}
            </span>
          </div>
        )}

        {match.isForfeit ? (
          <Badge
            className={clsx("text-xs ml-auto h-6", {
              "bg-slate-600": !isClubMatch,
              "bg-green-800": isClubMatch,
            })}
          >
            Forfait
          </Badge>
        ) : match.isDisqualified ? (
          <Badge
            className={clsx("text-xs ml-auto h-6", {
              "bg-slate-600": !isClubMatch,
              "bg-green-800": isClubMatch,
            })}
          >
            Disqualifié
          </Badge>
        ) : (
          <div className="text-xs text-gray-400 ml-auto h-6">
            {new Date(match.date).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>

      {/* Score et équipes */}
      <div className="text-center space-y-2">
        <div className="text-sm font-medium text-white">
          {homeTeam?.fromClub
            ? homeTeam?.name
            : replaceTeamName(homeTeam?.name || "")}
        </div>
        <div className="text-lg font-bold text-white bg-slate-800/50 rounded-lg px-3 py-1">
          {match.homeScore} - {match.awayScore}
        </div>
        <div className="text-sm font-medium text-white">
          {awayTeam?.fromClub
            ? awayTeam?.name
            : replaceTeamName(awayTeam?.name || "")}
        </div>
      </div>
    </div>
  );
};

const PreviousMatchesSection = ({
  previousMatches,
  teams,
}: {
  previousMatches: MatchesGrouped[];
  teams: Team[];
}) => {
  const [openedDays, setOpenedDays] = useState<Record<number, boolean>>({});
  const toggleDay = (day: number) => {
    setOpenedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };
  if (previousMatches.length === 0) return null;
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-700 border border-slate-600 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
      <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-b border-slate-600">
        <CardTitle className="flex items-center gap-3 text-green-200">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Derniers Résultats</span>
          <div className="ml-auto bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm font-medium border border-green-700/50 text-center">
            {previousMatches.length} rencontre
            {previousMatches.length > 1 ? "s" : ""}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6 bg-gradient-to-b from-transparent to-slate-800/30 space-y-8">
        {previousMatches.map(({ day, matches }, indexDay) => {
          if (indexDay === 0 && openedDays[day] === undefined) {
            toggleDay(day); // Open the first day by default
          }
          return (
            <div key={day} className="space-y-4">
              {/* En-tête de journée */}
              <HeaderMatchCard
                matchesCount={matches.filter(({ isPlayed }) => isPlayed).length}
                day={day}
                toggleDay={toggleDay}
                openedDays={openedDays}
                color="green"
              />

              {/* Rencontres pour cette journée */}
              <div
                className={clsx(
                  "transition-all duration-300 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4",
                  {
                    "max-h-none opacity-100": openedDays[day],
                    "max-h-0 opacity-0": !openedDays[day],
                  },
                )}
              >
                {matches.map((match) => {
                  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
                  const awayTeam = teams.find((t) => t.id === match.awayTeamId);
                  if (!homeTeam || !awayTeam) return null;
                  const isClubMatch = homeTeam?.fromClub || awayTeam?.fromClub;
                  const isHome = homeTeam?.fromClub;

                  if (match.isPlayed) {
                    return (
                      <PreviousMatchCard
                        key={match.id}
                        isClubMatch={isClubMatch}
                        isHome={isHome}
                        match={match}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                      />
                    );
                  } else {
                    return (
                      // show next match card style for unplayed matches
                      <NextMatchCard
                        key={match.id}
                        isClubMatch={isClubMatch}
                        isHome={isHome}
                        match={match}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                      />
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
