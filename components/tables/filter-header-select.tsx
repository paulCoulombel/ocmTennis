import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column } from "@tanstack/react-table";
import clsx from "clsx";
import { useState } from "react";

export interface FilterHeaderSelectProps {
  placeholder: string;
  column: Column<any>;
  filterOptions: any[];
  resetFilterTranslation: string;
}
export default function FilterHeaderSelect({
  placeholder,
  column,
  filterOptions,
  resetFilterTranslation,
}: FilterHeaderSelectProps) {
  const [value, setValue] = useState("");

  const handleValueChange = (value: string) => {
    const valueToSet = value === "reset" ? "" : value;
    setValue(valueToSet);
    column.setFilterValue(valueToSet);
  };
  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger
        className={clsx("min-w-32 data-[placeholder]:text-white", {
          "border-slate-500": !value,
        })}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filterOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
        {value && (
          <SelectItem value="reset" className="relative h-10">
            <Button
              variant="destructive"
              className="absolute left-1/2 top-0 w-[80%] -translate-x-1/2"
            >
              {resetFilterTranslation}
            </Button>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
