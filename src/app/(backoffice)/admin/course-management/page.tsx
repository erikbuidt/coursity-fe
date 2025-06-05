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

function Course() {
  const { getToken } = useAuth()
  const [openCourseDialog, setOpenCourseDialog] = useState<boolean>(false)
  const {
    data: courses,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getCourses({ page: 1 })
    },
    queryKey: ['courses'],
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
        <div className="grid grid-cols-4 gap-4 mt-4">
          {courses?.items?.map((course) => (
            <ManagementCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <CreateCourseDialog
        open={openCourseDialog}
        onChange={(status) => setOpenCourseDialog(status)}
      />
    </div>
  )
}

export default Course
