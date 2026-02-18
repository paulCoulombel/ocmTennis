"use client";

import { Badge } from "@/components/ui/badge";
import { trpc } from "@/server/client";
import { clsx } from "clsx";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { replaceTeamName } from "@/lib/utils/replaceTeamName";

function TennisResultsContent() {
  const today = useMemo(() => new Date(), []);
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const day = Number(searchParams.get("day"));
  if (!category) {
    return <div>Category is required</div>;
  }
  const { data, isLoading } = trpc.pdf.getScoreResults.useQuery({
    day,
    category,
  });
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <div
      id="story-export"
      className="w-[405px] h-[720px] bg-slate-900 text-white p-6 flex flex-col relative overflow-hidden font-sans"
    >
      {/* Design Elements - Cercles décoratifs en arrière-plan */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute top-1/2 -left-20 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-30"></div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2 justify-between">
          <h2 className="text-yellow-400 font-black italic text-3xl uppercase tracking-tighter">
            Résultats
          </h2>
          <Badge className="bg-yellow-400 text-slate-900 px-2 text-sm font-black rounded-full uppercase shadow-lg ">
            Journée {data[0].day}
          </Badge>
        </div>
        <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">
          {today.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="h-1 w-12 bg-yellow-400 mt-2"></div>
      </div>

      {/* Liste des Matchs */}
      <div className="relative z-10 flex flex-col gap-4">
        {data.map((match) => (
          <div
            key={match.homeTeamName}
            className="bg-white/5 border-l-4 border-yellow-400 p-4 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {match.category}
              </span>
              <span className="text-[10px] text-yellow-400 font-bold">
                {match.isHome ? "DOMICILE" : "EXTÉRIEUR"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="font-black text-lg leading-tight uppercase truncate">
                  {match.isHome ? match.homeTeamName : match.awayTeamName}
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  vs{" "}
                  {match.isHome
                    ? replaceTeamName(match.awayTeamName)
                    : replaceTeamName(match.homeTeamName)}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <span
                  className={clsx(
                    "text-2xl font-black",
                    match.homeScore !== null && match.awayScore !== null
                      ? match.homeScore > match.awayScore
                        ? "text-yellow-400"
                        : "text-slate-400"
                      : "text-slate-300"
                  )}
                >
                  {match.homeScore}
                </span>
                <span className="text-slate-600 font-bold">-</span>
                <span
                  className={clsx(
                    "text-2xl font-black",
                    match.homeScore !== null && match.awayScore !== null
                      ? match.homeScore < match.awayScore
                        ? "text-yellow-400"
                        : "text-slate-400"
                      : "text-slate-300"
                  )}
                >
                  {match.awayScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Logo Club */}
      <div className="mt-auto relative z-10 pt-6 flex justify-between items-center border-t border-white/10">
        <div className="font-black italic text-xl">MONTAUBAN</div>
        <div className="bg-yellow-400 text-slate-900 px-3 py-1 text-[10px] font-black rounded-full uppercase">
          Matchday
        </div>
      </div>
    </div>
  );
}

export default function TennisResultsStory() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TennisResultsContent />
    </Suspense>
  );
}
