'use client'
import { CourseCard } from '@/components/custom/course-card'
import { Button } from '@/components/ui/button'
import { courseApi } from '@/services/courseService'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateCourseDialog } from './_components/create-course-dialog'
import { ManagementCourseCard } from '@/components/custom/management-course-card'
import Pagination from '@/components/custom/pagination'
import { useSearchParams } from 'next/navigation'

function Course() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 1
  const [openCourseDialog, setOpenCourseDialog] = useState<boolean>(false)
  const {
    data: courses,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      return courseApi.getCourses({ page: +page, limit: 12 })
    },
    queryKey: ['courses', page],
    staleTime: 10 * 60 * 1000,
  })

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Course Management</h1>
        <Button onClick={() => setOpenCourseDialog(true)}>
          Create <Plus />
        </Button>
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
            pageSize={courses?.meta.total_pages || 10}
            queryConfig={{ page: courses?.meta.current_page || 1 }}
          />
        )}
      </div>
    </div>
  )
}

export default Course
