import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'

export interface FilterInputProps {
  table: Table<any>
  columnToFilter: string
  placeholder: string
}
export default function FilterInput({
  table,
  columnToFilter,
  placeholder,
}: FilterInputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={
        (table.getColumn(columnToFilter)?.getFilterValue() as string) ?? ''
      }
      onChange={(event) => {
        table.getColumn(columnToFilter)?.setFilterValue(event.target.value)
      }}
      className="max-w-sm"
    />
  )
}
