"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { addUnit } from "@/lib/utils/formatters";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Medal,
  MoreHorizontal,
  Square,
  Trophy,
} from "lucide-react";
import React from "react";
import FilterHeaderCheckbox from "../filter-header-checkbox";

export interface ClubTeamsTable {
  matchResults: {
    result: "win" | "loss" | "draw" | "notPlayed";
    day: number;
  }[];
  name: string;
  points: number;
  rank: number;
  pool: {
    division: string;
    category: string;
    name: string;
    championshipId: string;
    divisionId: string;
    phaseId: string;
    id: string;
    dayNumber: number;
  };
}
// cspell: disable

export const generateClubTeamsColumns: ({
  dayNumber,
  setDayNumber,
  maxDayNumber,
  defaultCategoryFilter,
}: {
  dayNumber: number;
  setDayNumber: (day: number) => void;
  maxDayNumber: number;
  redirectToPoolPage: (poolId: string) => void;
  defaultCategoryFilter?: string[];
}) => ColumnDef<any>[] = ({
  dayNumber,
  setDayNumber,
  maxDayNumber,
  redirectToPoolPage,
  defaultCategoryFilter = [],
}) => [
  {
    accessorKey: "name",
    header: ({ table, column }) => {
      const columnValues = table
        .getCoreRowModel()
        .rows.map((row) => row.original.pool.category);
      const uniqueValues = Array.from(new Set(columnValues));
      const categoryColumn = table.getColumn("category");
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div className="text-center justify-center flex items-center gap-2">
          <FilterHeaderCheckbox
            column={categoryColumn ?? column}
            filterOptions={uniqueValues}
            placeholder={"Équipe"}
            resetFilterTranslation={"Annuler"}
            defaultValues={defaultCategoryFilter}
          />
          <Tooltip open={isOpen} onOpenChange={setIsOpen}>
            <TooltipTrigger
              asChild
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <Info />
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-800">
              SD = Senior dame <br />
              S35 = Senior homme +35 ans <br />
              SH = Senior homme <br />
              G = Garçon <br />
              F = Fille <br />
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
    cell: ({ row }) => {
      if (row.getValue("rank") === 1) {
        return (
          <div
            className="relative text-center underline hover:cursor-pointer justify-center flex items-center"
            onClick={() => redirectToPoolPage(row.original.pool.id)}
          >
            <Medal className="absolute mr-26 h-4 w-4" />
            {row.getValue("name")}
          </div>
        );
      }
      return (
        <div
          className="text-center underline hover:cursor-pointer"
          onClick={() => redirectToPoolPage(row.original.pool.id)}
        >
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "division",
    header: () => {
      return <div className="text-center">Division</div>;
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "relative flex justify-center items-center",
          row.original.pool.ballColor !== "yellow" && "pl-1",
        )}
      >
        {row.original.pool.division}
        {row.original.pool.ballColor === "orange" && (
          <img
            src="/ball/orange.png"
            alt="Balle orange"
            className="h-7 w-8 lg:absolute lg:transform lg:translate-x-8"
          />
        )}
        {row.original.pool.ballColor === "green" && (
          <img
            src="/ball/green.png"
            alt="Balle verte"
            className="h-8 w-8 lg:absolute lg:transform lg:translate-x-8"
          />
        )}
      </div>
    ),
  },
  {
    accessorKey: "rank",
    header: () => {
      return <div className="text-center">Classement</div>;
    },
    cell: ({ row }) => {
      if (row.getValue("rank") === 1) {
        return (
          <div className="relative flex justify-center items-center">
            {" "}
            <Medal className="absolute mr-12 inline-block mr-2 h-4 w-4" />
            1er
          </div>
        );
      }
      return (
        <div className="text-center">
          {row.getValue("rank") === 0
            ? "Aucun match joué"
            : addUnit(row.getValue("rank"), "e")}
        </div>
      );
    },
  },
  {
    accessorKey: "points",
    header: () => {
      return <div className="text-center">Points</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("rank") === 0 ? "-" : row.getValue("points")}
      </div>
    ),
  },
  {
    accessorKey: "matchResults",
    header: () => {
      return (
        <div className="text-center gap-3 flex items-center justify-center">
          <ChevronLeft
            className="inline-block mr-1 h-4 w-4 text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors"
            onClick={() => {
              if (dayNumber > 0) {
                setDayNumber(dayNumber - 1);
              }
            }}
          />
          <span>Journée {dayNumber + 1}</span>
          <ChevronRight
            className="inline-block ml-1 h-4 w-4 text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors"
            onClick={() => {
              if (dayNumber < maxDayNumber - 1) {
                setDayNumber(dayNumber + 1);
              }
            }}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const results = row.getValue("matchResults") as {
        result: "win" | "loss" | "draw" | "notPlayed";
        day: number;
      }[];
      const displayedResult =
        dayNumber >= row.original.pool.dayNumber
          ? "notPlayed"
          : results[dayNumber]?.result || "notPlayed";
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <div
              className={clsx(
                "text-center flex justify-center items-center",
                { "text-emerald-400": displayedResult === "win" },
                { "text-rose-400": displayedResult === "loss" },
                { "text-amber-400": displayedResult === "draw" },
              )}
            >
              {dayNumber >= row.original.pool.dayNumber ? (
                "-"
              ) : displayedResult === "notPlayed" ? (
                "À venir"
              ) : (
                <Trophy />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="flex gap-1 flex-row bg-neutral-800 border-neutral-600 shadow-xl">
            {Array(row.original.pool.dayNumber)
              .fill(0)
              .map((_, day) => {
                const result =
                  day >= results.length ? "notPlayed" : results[day].result;
                return (
                  <Square
                    key={day}
                    className={clsx(
                      "flex justify-center items-center h-4 w-4",
                      { "text-emerald-400 fill-emerald-400": result === "win" },
                      { "text-rose-400 fill-rose-400": result === "loss" },
                      { "text-amber-400 fill-amber-400": result === "draw" },
                      {
                        "text-neutral-500 fill-neutral-500":
                          result === "notPlayed",
                      },
                    )}
                  />
                );
              })}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => null,
    cell: ({ row }) => {
      const { championshipId, divisionId, phaseId, id, name } =
        row.original.pool;
      const tenupUrl = `https://tenup.fft.fr/championnat/${championshipId}?division=${divisionId}&phase=${phaseId}&poule=${id}`;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-500 border border-gray-300/50"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-neutral-800 border-neutral-600 shadow-xl"
            >
              <DropdownMenuLabel className="text-white font-semibold border-b border-gray-500">
                {name}
              </DropdownMenuLabel>
              <DropdownMenuItem
                className={clsx(
                  "flex w-full cursor-pointer gap-2 transition-all duration-150",
                  "text-neutral-200 hover:text-white hover:bg-neutral-700",
                  "focus:bg-neutral-700 focus:text-white",
                )}
                onClick={() => redirectToPoolPage(row.original.pool.id)}
              >
                Détail
              </DropdownMenuItem>
              <DropdownMenuItem
                className={clsx(
                  "flex w-full cursor-pointer gap-2 transition-all duration-150",
                  "text-neutral-200 hover:text-white hover:bg-neutral-700",
                  "focus:bg-neutral-700 focus:text-white",
                )}
                onClick={() => window.open(tenupUrl, "_blank")}
              >
                Ten'Up
                <ExternalLink className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-600" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    // nest lines are used for the filter of the first column
    accessorFn: (row) => row.pool.category,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
];
