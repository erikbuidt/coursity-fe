'use client'
import { ManagementCourseCard } from '@/components/custom/management-course-card'
import Pagination from '@/components/custom/pagination'
import { Button } from '@/components/ui/button'
import { useAbilityContext } from '@/contexts/ability-context'
import { instructorApi } from '@/services/instructorService'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { CreateCourseDialog } from './_components/create-course-dialog'
import Guard from '@/components/custom/guard'

function Course() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 1
  const { getToken } = useAuth()
  const [openCourseDialog, setOpenCourseDialog] = useState<boolean>(false)
  const { data: courses, isLoading } = useQuery({
    queryFn: async () => {
      const token = await getToken()
      return instructorApi.getTaughtCourses({ page: +page, limit: 12 }, token || '')
    },
    queryKey: ['courses', page],
    staleTime: 10 * 60 * 1000,
  })
  const { ability } = useAbilityContext()

  return (
    <Guard action="view" resource="course_management_page">
      <div className="flex flex-col ">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Course Management</h1>
          {ability?.can('create', 'course') && (
            <Button onClick={() => setOpenCourseDialog(true)}>
              Create <Plus />
            </Button>
          )}
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
            {courses?.items?.map((course) => (
              <ManagementCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <CreateCourseDialog
          open={openCourseDialog}
          onChange={(status) => setOpenCourseDialog(status)}
        />
        <div className="mt-4">
          {!isLoading && (
            <Pagination
              pageSize={courses?.meta.total_pages || 1}
              queryConfig={{ page: courses?.meta.current_page || 1 }}
            />
          )}
        </div>
      </div>
    </Guard>
  )
}
export default function CoursePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Course />
    </Suspense>
  )
}
