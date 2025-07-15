'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MultiSelect, type Option } from '@/components/custom/multi-select'
import Table from '@/components/custom/table'
import { Badge } from '@/components/ui/badge'
import { COURSE_STATUS, courseStatusMapping } from '@/constants/course'
import useFilters from '@/hooks/use-filters'
import { courseApi } from '@/services/courseService'
import type { Course } from '@/types/course.type'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

const options: Option[] = [
  { label: 'In Review', value: 'in_review' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Published', value: 'published' },
]

const columns: ColumnDef<Course>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue('status') === COURSE_STATUS.IN_REVIEW ? (
          <Badge variant="secondary">
            {courseStatusMapping[row.getValue('status') as COURSE_STATUS]}
          </Badge>
        ) : row.getValue('status') === COURSE_STATUS.PUBLISHED ? (
          <Badge variant="default">
            {courseStatusMapping[row.getValue('status') as COURSE_STATUS]}
          </Badge>
        ) : row.getValue('status') === COURSE_STATUS.REJECTED ? (
          <Badge variant="destructive">
            {courseStatusMapping[row.getValue('status') as COURSE_STATUS]}
          </Badge>
        ) : (
          ''
        )}
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'instructor_email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('instructor_email')}</div>,
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'))

      // Format the price as a dollar price
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    meta: 'flex justify-center',
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-center">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
export default function DataTableDemo() {
  const { getToken } = useAuth()
  const [selected, setSelected] = React.useState<Option[]>([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const filterConfig = useFilters()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pagination state
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '10')
  const pagination = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: limit,
    }),
    [page, limit],
  )

  // Query for courses
  const {
    data: courses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['courses-reviews', filterConfig],
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getAllCourses(
        {
          page: filterConfig.page ? Number(filterConfig.page) : 1,
          limit: Math.min(filterConfig.limit ? Number(filterConfig.limit) : 20, 20),
          status: filterConfig.status,
          search: filterConfig.search,
        },
        token || '',
      )
    },
    staleTime: 10 * 60 * 1000,
  })

  // Sync selected status with filterConfig
  React.useEffect(() => {
    const arrStatus = filterConfig.status?.split(',') || []
    setSelected(options.filter((o) => arrStatus.includes(o.value)))
  }, [filterConfig.status])

  // Update status param in URL when selected changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const status = selected.map((o) => o.value).join(',')
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.replace(`?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // Update search param in URL when debouncedSearchTerm changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm)
    } else {
      params.delete('search')
    }
    router.replace(`?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

  // Keep searchTerm in sync with filterConfig.search
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (filterConfig.search !== searchTerm) {
      setSearchTerm(filterConfig.search || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterConfig.search])

  // Handle pagination change
  const handlePaginationChange = React.useCallback(
    (paginate: any) => {
      let pageIndex = pagination.pageIndex
      let pageSize = pagination.pageSize
      if (typeof paginate === 'function') {
        const result = paginate(pagination)
        pageIndex = result.pageIndex
        pageSize = result.pageSize
      } else if (paginate && typeof paginate === 'object') {
        pageIndex = paginate.pageIndex
        pageSize = paginate.pageSize
      }
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', (pageIndex + 1).toString())
      params.set('limit', pageSize.toString())
      router.replace(`?${params.toString()}`)
    },
    [pagination, router, searchParams],
  )

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div>
          <MultiSelect onChange={setSelected} options={options} selected={selected} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table
          data={courses?.items || []}
          columns={columns}
          pagination={pagination}
          paginationOptions={{
            pageCount: courses?.meta.total_pages,
            manualPagination: true,
            onPaginationChange: handlePaginationChange,
          }}
        />
      </div>
    </div>
  )
}
