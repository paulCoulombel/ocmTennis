import { Button } from '@/components/ui/button'
import { Column } from '@tanstack/react-table'
import clsx from 'clsx'
import { ArrowUpDown } from 'lucide-react'
export interface SortableHeaderProps {
  column: Column<any>
  header: string
}
export const SortableHeader = ({ column, header }: SortableHeaderProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === 'asc')
      }}
    >
      {header}
      <ArrowUpDown
        className={clsx('ml-2 h-4 w-4', {
          'text-primary': column.getIsSorted(),
        })}
      />
    </Button>
  )
}
