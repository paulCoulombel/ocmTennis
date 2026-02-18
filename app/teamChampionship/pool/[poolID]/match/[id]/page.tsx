"use client";

import { RankingIcon } from "@/components/icons/hugeicons-ranking";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { replaceTeamName } from "@/lib/utils/replaceTeamName";
import { trpc } from "@/server/client";
import { clsx } from "clsx";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Crown,
  ExternalLink,
  Home,
  Plane,
  Target,
  Trophy,
} from "lucide-react";
import { useParams } from "next/navigation";

type TeamInformation = {
  name: string;
  id: number;
  score: number;
  isWinner: boolean | null;
  isForfeit: boolean | null;
  isDisqualified: boolean;
  rank: number | null;
  players: {
    firstName: string;
    lastName: string;
    rank: string | null;
  }[];
};

type MatchInformation = {
  id: number;
  isSingle: boolean;
  matchNumber: number;
  victoryType: string;
  homeScores: {
    score: number;
    scoreTieBreak?: number | undefined;
  }[];
  awayScores: {
    score: number;
    scoreTieBreak?: number | undefined;
  }[];
  homeIsWinner: boolean;
  homePlayer: {
    firstName: string;
    lastName: string;
    rank: string | null;
  }[];
  awayPlayer: {
    firstName: string;
    lastName: string;
    rank: string | null;
  }[];
};

export default function HomePage() {
  const { poolID, id } = useParams();
  const { data, isLoading } = trpc.pool.getMatchInformation.useQuery({
    poolId: parseInt(poolID as string),
    matchId: parseInt(id as string),
  });

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center text-white">
            <p>Match non trouvé</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-6 pt-30">
      <div className="max-w-7xl mx-auto space-y-6">
        <MatchHeader
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
          date={data.date}
          championshipId={data.championshipId}
          divisionId={data.divisionId}
          phaseId={data.phaseId}
          poolId={poolID as string}
          matchId={id as string}
        />
        {data.matches.length === 0 ? (
          <NoResultSection />
        ) : (
          <>
            <TeamsOverview homeTeam={data.homeTeam} awayTeam={data.awayTeam} />
            <MatchList matches={data.matches} />
          </>
        )}
      </div>
    </div>
  );
}

const MatchHeader = ({
  homeTeam,
  awayTeam,
  date,
  championshipId,
  divisionId,
  phaseId,
  poolId,
  matchId,
}: {
  homeTeam: TeamInformation;
  awayTeam: TeamInformation;
  date: string;
  championshipId: number;
  divisionId: number;
  phaseId: number;
  poolId: string;
  matchId: string;
}) => {
  const matchDate = new Date(date);
  const tenupUrl = `https://tenup.fft.fr/championnat/${championshipId}/division/${divisionId}/phase/${phaseId}/poule/${poolId}/rencontre/${matchId}`;

  return (
    <Card className="relative overflow-hidden bg-slate-800 text-white border border-slate-600 shadow-xl">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-16 h-16 md:w-32 md:h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-12 h-12 md:w-24 md:h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <CardHeader className="relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 bg-slate-700/80 backdrop-blur-sm p-4 rounded-xl border border-slate-500 shadow-lg">
            <Trophy className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl font-extrabold mb-2">
              Détail de la rencontre
            </CardTitle>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="h-4 w-4 flex-shrink-0 mt-0.5 md:mt-0" />
              <span className="text-base md:text-lg leading-tight">
                {format(matchDate, "EEEE dd MMMM yyyy", {
                  locale: fr,
                })}
              </span>
              <a
                className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm font-medium"
                href={tenupUrl}
                target="_blank"
              >
                Ten'Up
                <ExternalLink className="h-4 w-4 inline-block ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="relative hidden md:flex items-center justify-between bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
          {/* Team home */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
            </div>
            <h3
              className={clsx(
                "text-xl font-bold",
                homeTeam.isWinner ? "text-yellow-400" : "text-slate-300",
              )}
            >
              {replaceTeamName(homeTeam.name)}
            </h3>
          </div>

          {/* Score */}
          <div className="flex items-center gap-8 text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={clsx(
                "text-4xl font-bold",
                homeTeam.isWinner ? "text-yellow-400" : "text-slate-300",
              )}
            >
              {homeTeam.score}
            </div>
            <div className="text-slate-400 text-2xl">-</div>
            <div
              className={clsx(
                "text-4xl font-bold",
                awayTeam.isWinner ? "text-yellow-400" : "text-slate-300",
              )}
            >
              {awayTeam.score}
            </div>
          </div>

          {/* Team away */}
          <div className="flex items-center gap-4 text-right">
            <h3
              className={clsx(
                "text-xl font-bold",
                awayTeam.isWinner ? "text-yellow-400" : "text-slate-300",
              )}
            >
              {replaceTeamName(awayTeam.name)}
            </h3>
            <div className="flex items-center gap-2">
              {awayTeam.isWinner && (
                <Crown className="h-5 w-5 text-amber-400" />
              )}
              <Plane className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600 space-y-4">
          {/* Home team */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4" />
              <h3
                className={clsx(
                  "text-lg font-bold flex-1",
                  homeTeam.isWinner ? "text-yellow-400" : "text-slate-300",
                )}
              >
                {replaceTeamName(homeTeam.name)}
              </h3>
              {homeTeam.isWinner && (
                <Crown className="h-4 w-4 text-amber-400" />
              )}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-b border-slate-600">
            <div
              className={clsx(
                "text-3xl font-bold",
                homeTeam.isWinner ? "text-yellow-400" : "text-slate-300",
              )}
            >
              {homeTeam.score}
            </div>
            <div className="text-slate-400 text-xl">-</div>
            <div
              className={clsx(
                "text-3xl font-bold",
                awayTeam.isWinner ? "text-yellow-400" : "text-slate-300",
              )}
            >
              {awayTeam.score}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Plane className="h-4 w-4" />
            <h3
              className={clsx(
                "text-lg font-bold flex-1",
                awayTeam.isWinner ? "text-yellow-400" : "text-slate-300",
              )}
            >
              {replaceTeamName(awayTeam.name)}
            </h3>
            {awayTeam.isWinner && <Crown className="h-4 w-4 text-amber-400" />}
          </div>
        </div>

        {/* Special match */}
        {(homeTeam.isForfeit ||
          awayTeam.isForfeit ||
          homeTeam.isDisqualified ||
          awayTeam.isDisqualified) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {homeTeam.isForfeit && (
              <Badge
                variant="destructive"
                className="bg-red-600 text-xs sm:text-sm"
              >
                {replaceTeamName(homeTeam.name)} - Forfait
              </Badge>
            )}
            {awayTeam.isForfeit && (
              <Badge
                variant="destructive"
                className="bg-red-600 text-xs sm:text-sm"
              >
                {replaceTeamName(awayTeam.name)} - Forfait
              </Badge>
            )}
            {homeTeam.isDisqualified && (
              <Badge
                variant="destructive"
                className="bg-orange-600 text-xs sm:text-sm"
              >
                {replaceTeamName(homeTeam.name)} - Disqualification
              </Badge>
            )}
            {awayTeam.isDisqualified && (
              <Badge
                variant="destructive"
                className="bg-orange-600 text-xs sm:text-sm"
              >
                {replaceTeamName(awayTeam.name)} - Disqualification
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

const TeamsOverview = ({
  homeTeam,
  awayTeam,
}: {
  homeTeam: TeamInformation;
  awayTeam: TeamInformation;
}) => {
  return (
    <>
      {window.innerWidth >= 1024 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamCard team={homeTeam} isHome={true} />
          <TeamCard team={awayTeam} isHome={false} />
        </div>
      )}
    </>
  );
};

const TeamCard = ({
  team,
  isHome,
}: {
  team: TeamInformation;
  isHome: boolean;
}) => {
  return (
    <Card className="bg-slate-800/80 backdrop-blur-sm text-white border border-slate-600 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {isHome ? (
                <Home className="h-6 w-6 text-slate-300 " />
              ) : (
                <Plane className="h-6 w-6 text-slate-300" />
              )}
            </div>
            <CardTitle
              className={clsx("text-lg sm:text-xl flex items-center gap-2")}
            >
              {replaceTeamName(team.name)}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-right text-xl sm:text-2xl font-bold text-slate-300">
            <RankingIcon className="h-5 w-5 text-slate-400" />
            <span>
              {team.rank !== null
                ? `${team.rank}${team.rank === 1 ? "er" : "e"}`
                : "N/A"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-amber-400/70" />
            <span className="font-semibold text-amber-400/70 mt-1">Équipe</span>
          </div>
          <div className="space-y-3">
            {team.players.map((player, index) =>
              player ? (
                <div
                  key={index}
                  className="border-l-2 border-slate-600 pl-3 text-lg font-medium flex items-center gap-2"
                >
                  {player.firstName} {player.lastName}{" "}
                  {player.rank && (
                    <Badge className="bg-slate-800 text-slate-300">
                      {player.rank}
                    </Badge>
                  )}
                </div>
              ) : null,
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MatchList = ({ matches }: { matches: MatchInformation[] }) => {
  return (
    <Card className="bg-slate-800/80 backdrop-blur-sm text-white border border-slate-600 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Target className="h-6 w-6 text-amber-400/70" />
          Détail des matchs
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MatchCard = ({ match }: { match: MatchInformation }) => {
  const formatPlayerNames = (players: {
    firstName: string;
    lastName: string;
    rank: string | null;
  }) => {
    return players.firstName
      ? `${players.firstName} ${players.lastName}`
      : "Non renseigné";
  };

  const getPlayerClassements = (
    players: {
      firstName: string;
      lastName: string;
      rank: string | null;
    }[],
  ) => {
    return players.map((p) => ({
      rank: p.rank,
    }));
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
      <div className="flex items-center justify-center flex items-center gap-3 mb-4">
        <Badge
          variant="outline"
          className="bg-slate-600 text-white border border-slate-600 text-slate-200"
        >
          {match.isSingle ? "Simple" : "Double"} #{match.matchNumber}
        </Badge>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-3 gap-4 items-center">
        {/* Home player name */}
        <div className="text-left text-slate-100">
          <div className="font-semibold flex items-center justify-start">
            {match.homeIsWinner ? (
              <Crown className="h-4 w-4 text-amber-400 inline-block mr-2 mb-1" />
            ) : null}
            <div className="flex flex-col gap-1">
              {match.homePlayer.map((player, index) => {
                if (match.isSingle && index === 1) return null;
                return <span key={index}>{formatPlayerNames(player)}</span>;
              })}
            </div>
          </div>
          <div className="text-sm text-slate-400 mt-3 flex gap-2">
            {match.isSingle &&
              getPlayerClassements(match.homePlayer).map(({ rank }, index) => {
                if (!rank) return null;
                return (
                  <Badge key={index} className="bg-slate-800 text-slate-300">
                    {rank}
                  </Badge>
                );
              })}
          </div>
        </div>

        {/* Scores */}
        <div className="text-center flex items-center justify-center gap-2 flex-col">
          {match.homeScores.map((set, index) => (
            <Badge
              className="flex items-center gap-1 font-mono text-lg p-2 border border-slate-600 bg-slate-900/50 rounded-sm"
              key={index}
            >
              <span
                className={clsx(
                  set.score > match.awayScores[index]?.score
                    ? "font-bold text-amber-300"
                    : "text-slate-300",
                )}
              >
                {set.score}
              </span>{" "}
              -
              <span
                className={clsx(
                  set.score < match.awayScores[index]?.score
                    ? "font-bold text-amber-300"
                    : "text-slate-300",
                )}
              >
                {match.awayScores[index]?.score}
              </span>
            </Badge>
          ))}
        </div>

        {/* Away player name */}
        <div className="text-right text-slate-100">
          <div className="font-semibold flex items-center justify-end">
            {!match.homeIsWinner ? (
              <Crown className="h-4 w-4 text-amber-400 inline-block mr-2 mb-1" />
            ) : null}
            <div className="flex flex-col items-end gap-1">
              {match.awayPlayer.map((player, index) => {
                if (match.isSingle && index === 1) return null;
                return <span key={index}>{formatPlayerNames(player)}</span>;
              })}
            </div>
          </div>
          <div className="text-sm text-slate-400 mt-1 flex gap-2 justify-end">
            {match.isSingle &&
              getPlayerClassements(match.awayPlayer).map(({ rank }, index) => {
                if (!rank) return null;
                return (
                  <Badge key={index} className="bg-slate-800 text-slate-300">
                    {rank}
                  </Badge>
                );
              })}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-4">
        {/* Players */}
        <div className="space-y-3">
          {/* Home player */}
          <div className="flex items-center gap-2 p-3 bg-slate-600/30 rounded-lg">
            {match.homeIsWinner && (
              <Crown className="h-4 w-4 text-amber-400 flex-shrink-0" />
            )}
            <div className="font-medium text-slate-100">
              {match.homePlayer.map((player, index) => {
                if (match.isSingle && index === 1) return null;
                return (
                  <div key={index} className="text-sm sm:text-base">
                    {formatPlayerNames(player)}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 items-center">
              {match.isSingle &&
                getPlayerClassements(match.homePlayer).map(
                  ({ rank }, index) => {
                    if (!rank) return null;
                    return (
                      <Badge
                        key={index}
                        className="bg-slate-800 text-slate-300 text-xs"
                      >
                        {rank}
                      </Badge>
                    );
                  },
                )}
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="flex items-center justify-center gap-2 flex-wrap  border-slate-600">
          {match.homeScores.map((set, index) => (
            <Badge
              className="flex flex-col px-5 py-2 items-center gap-1 font-mono text-base border border-slate-600 bg-slate-900/50 rounded-sm"
              key={index}
            >
              <div
                className={clsx(
                  set.score > match.awayScores[index]?.score
                    ? "font-bold text-amber-300"
                    : "text-slate-300",
                )}
              >
                {set.score}
              </div>
              <div
                className={clsx(
                  set.score < match.awayScores[index]?.score
                    ? "font-bold text-amber-300"
                    : "text-slate-300",
                )}
              >
                {match.awayScores[index]?.score}
              </div>
            </Badge>
          ))}
        </div>

        {/* Away player */}
        <div className="flex items-center gap-2 p-3 bg-slate-600/30 rounded-lg">
          {!match.homeIsWinner && (
            <Crown className="h-4 w-4 text-amber-400 flex-shrink-0" />
          )}
          <div className="font-medium text-slate-100">
            {match.awayPlayer.map((player, index) => {
              if (match.isSingle && index === 1) return null;
              return (
                <div key={index} className="text-sm sm:text-base">
                  {formatPlayerNames(player)}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            {match.isSingle &&
              getPlayerClassements(match.awayPlayer).map(({ rank }, index) => {
                if (!rank) return null;
                return (
                  <Badge
                    key={index}
                    className="bg-slate-800 text-slate-300 text-xs"
                  >
                    {rank}
                  </Badge>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoResultSection = () => {
  return (
    <div className="text-center text-slate-300 py-10">
      <p>Aucun résultat de match disponible.</p>
    </div>
  );
};
