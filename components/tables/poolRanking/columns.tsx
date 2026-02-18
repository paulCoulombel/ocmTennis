"use client";
import { replaceTeamName } from "@/lib/utils/replaceTeamName";
// cspell: disable
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Home } from "lucide-react";

export interface PoolRankingTable {
  id: number;
  name: string;
  points: number;
  rank: number;
  fromClub: boolean;
  wins: number;
  draws: number;
  losses: number;
}

export const poolRankingColumns: ColumnDef<PoolRankingTable>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("rank")}</div>
    ),
    meta: {
      className: "text-center",
    },
  },
  {
    accessorKey: "name",
    header: "Équipe",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="flex items-center space-x-2">
          {team.fromClub ? (
            <>
              <span className="font-medium">{team.name}</span>
              <Badge
                variant="secondary"
                className="bg-yellow-500/20 text-yellow-200 border-yellow-500/10"
              >
                <Home className="w-3 h-3" />
              </Badge>
            </>
          ) : (
            <span className="font-medium">{replaceTeamName(team.name)}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "points",
    header: () => <div className="text-center">Pts</div>,
    cell: ({ row }) => (
      <div className="text-center font-bold">{row.getValue("points")}</div>
    ),
    meta: {
      className: "text-center",
    },
  },
  {
    id: "record",
    header: () => <div className="text-center">V/N/D</div>,
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="text-center">
          <span className="text-green-400 font-medium">{team.wins}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-yellow-400 font-medium">{team.draws}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-red-400 font-medium">{team.losses}</span>
        </div>
      );
    },
    meta: {
      className: "text-center",
    },
  },
];
