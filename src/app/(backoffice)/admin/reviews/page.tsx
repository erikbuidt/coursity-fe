'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'

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
import PreviewCourseDialog from './_components/preview-course-dialog'

const options: Option[] = [
  { label: 'In Review', value: 'in_review' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Published', value: 'published' },
]

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 20
function DataTableDemo() {
  const { getToken } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    page: pageParam = DEFAULT_PAGE,
    limit: limitParam = DEFAULT_LIMIT,
    status: statusParam = '',
    search: searchParam = '',
  } = useFilters()

  // Local searchTerm state synced with URL param but debounced
  const [searchTerm, setSearchTerm] = useState(searchParam)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [coursePreviewing, setCoursePreviewing] = useState<Course | null>(null)

  // Keep selected statuses in sync with URL param
  const initialSelected = useMemo(() => {
    const statuses = statusParam?.split(',').filter(Boolean)
    return options.filter((opt) => statuses?.includes(opt.value))
  }, [statusParam])

  const [selected, setSelected] = useState<Option[]>(initialSelected)

  // // Fetch courses using React Query with filterConfig built from URL params
  const { data: courses, isLoading } = useQuery({
    queryKey: [
      'courses-reviews',
      { page: pageParam, limit: limitParam, status: statusParam, search: searchParam },
    ],
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getAllCourses(
        {
          page: Number(pageParam),
          limit: Math.min(Number(limitParam), MAX_LIMIT),
          status: statusParam || undefined,
          search: searchParam || undefined,
        },
        token || '',
      )
    },
    staleTime: 10 * 60 * 1000,
  })

  // Fetch course reviews using React Query
  const columns: ColumnDef<Course>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
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
            <Badge variant="secondary" className="bg-amber-200">
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
          ) : row.getValue('status') === COURSE_STATUS.DRAFT ? (
            <Badge variant="outline">
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
      cell: ({ row }) => {
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
              <DropdownMenuItem onClick={() => setCoursePreviewing(row.original)}>
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const { data: course } = useQuery({
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getCourse(coursePreviewing?.slug as string, token || '')
    },
    enabled: !!coursePreviewing,
    queryKey: ['course', coursePreviewing?.id],
    staleTime: 1000 * 60 * 5,
  })
  // When URL 'status' param changes externally, sync selected state
  useEffect(() => {
    setSelected(initialSelected)
  }, [initialSelected])

  // Pagination state derived from URL params
  const pagination = useMemo(
    () => ({
      pageIndex: Number(pageParam) - 1,
      pageSize: Number(limitParam),
    }),
    [pageParam, limitParam],
  )

  // Centralized function to update URL params
  const updateSearchParams = useCallback(
    (newParams: Partial<{ page: number; limit: number; status: string; search: string }>) => {
      const params = new URLSearchParams(searchParams.toString())

      if (newParams.page !== undefined) params.set('page', String(newParams.page))
      if (newParams.limit !== undefined) params.set('limit', String(newParams.limit))
      if (newParams.status !== undefined) {
        if (newParams.status) params.set('status', newParams.status)
        else params.delete('status')
      }
      if (newParams.search !== undefined) {
        if (newParams.search) params.set('search', newParams.search)
        else params.delete('search')
      }

      // Use router.replace with pathname to avoid navigation effect
      router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  // When selected changes, update 'status' param in URL
  useEffect(() => {
    const statusStr = selected.map((o) => o.value).join(',')
    if (statusStr !== statusParam) {
      updateSearchParams({ status: statusStr, page: 1 }) // Reset to page 1 on filter change
    }
  }, [selected, statusParam, updateSearchParams])

  // When debounced search changes, update 'search' param in URL
  useEffect(() => {
    if (debouncedSearchTerm !== searchParam) {
      updateSearchParams({ search: debouncedSearchTerm, page: 1 }) // Reset to page 1 on search change
    }
  }, [debouncedSearchTerm, searchParam, updateSearchParams])

  // If external search param changes, sync local searchTerm
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (searchParam !== searchTerm) {
      setSearchTerm(searchParam)
    }
  }, [searchParam])

  // Handler function for pagination changes (page/limit)
  const handlePaginationChange = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
      updateSearchParams({ page: pageIndex + 1, limit: pageSize })
    },
    [pagination, updateSearchParams],
  )

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2 max-w-xl">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search courses"
        />
        <MultiSelect
          onChange={setSelected}
          options={options}
          selected={selected}
          placeholder="Status"
          className="max-w-[40%]"
          aria-label="Filter by status"
        />
      </div>

      <div className="rounded-md border">
        <Table
          isLoading={isLoading}
          data={courses?.items || []}
          columns={columns}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          paginationOptions={{
            pageCount: courses?.meta?.total_pages ?? 1,
            manualPagination: true,
            onPaginationChange: handlePaginationChange,
          }}
        />
        {course && (
          <PreviewCourseDialog
            open={!!coursePreviewing}
            onChange={() => setCoursePreviewing(null)}
            course={course}
          />
        )}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTableDemo />
    </Suspense>
  )
}
