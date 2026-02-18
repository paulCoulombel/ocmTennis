import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export interface FilterHeaderCheckboxProps {
  placeholder: string;
  column: Column<any>;
  filterOptions: string[];
  resetFilterTranslation: string;
  defaultValues?: string[];
}

export default function FilterHeaderCheckbox({
  placeholder,
  column,
  filterOptions,
  resetFilterTranslation,
  defaultValues = [],
}: FilterHeaderCheckboxProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    column.setFilterValue(selectedValues);
  }, []);
  const handleToggle = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    column.setFilterValue(newSelectedValues);
  };

  const handleReset = () => {
    setSelectedValues([]);
    column.setFilterValue(undefined);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={clsx(
            "min-w-32 justify-between transition-all duration-200 shadow-sm",
            "bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600",
            "text-neutral-100 hover:text-white border-neutral-600 shadow-neutral-500/20",
          )}
        >
          <span className="truncate font-medium">{placeholder}</span>
          <ChevronDown
            className={clsx(
              "h-4 w-4 transition-all duration-200",
              open ? "rotate-180 text-blue-400" : "text-neutral-400",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-neutral-800 border-neutral-600 shadow-xl">
        {filterOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            className={clsx(
              "flex items-center gap-3 cursor-pointer transition-all duration-150",
              "text-neutral-200 hover:bg-neutral-700 hover:text-white",
              "focus:bg-neutral-700 focus:text-white",
            )}
            onClick={() => handleToggle(option)}
            onSelect={(e) => e.preventDefault()}
          >
            <div
              className={clsx(
                "flex h-4 w-4 items-center justify-center rounded border transition-all duration-150",
                selectedValues.includes(option)
                  ? "bg-blue-600 border-blue-600 shadow-blue-500/25"
                  : "border-neutral-500 hover:border-blue-400",
              )}
            >
              {selectedValues.includes(option) && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            <span className="flex-1">{option}</span>
          </DropdownMenuItem>
        ))}
        {selectedValues.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-neutral-600" />
            <DropdownMenuItem
              className={clsx(
                "cursor-pointer transition-all duration-150",
                "text-red-400 hover:text-red-300 hover:bg-red-900/20",
                "focus:bg-red-900/20 focus:text-red-300",
              )}
              onClick={handleReset}
            >
              {resetFilterTranslation}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
