'use client'
import LoadingButton from '@/components/ui/loading-button'
import { useCourse } from '@/contexts/course-context'
import { cn } from '@/lib/utils'
import { courseApi } from '@/services/courseService'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Circle } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { COURSE_STATUS, courseStatusMapping } from '@/constants/course'

function Navigation() {
  const pathname = usePathname().split('/').slice(-1)[0] || ''
  const { slug } = useParams()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const course = useCourse()
  const { mutateAsync: submitToReview, isPending: isPendingSubmit } = useMutation({
    mutationFn: async (arg: {
      slug: string
    }) => {
      const { slug } = arg
      const token = await getToken()
      return courseApi.submitToReview(slug, token || '')
    },
    onSuccess: () => {
      toast.success('Course have been submitted successfully', {})
      queryClient.invalidateQueries({ queryKey: ['course', slug] })
    },
    onError: () => {
      toast.error('Something went wrong', {})
    },
  })
  return (
    <>
      <ul className="flex flex-col">
        <h3 className="font-bold p-2"> Plan your course</h3>
        <li
          className={cn('hover:bg-accent p-2 cursor-pointer', pathname === 'goal' && 'bg-accent')}
        >
          <Link className="flex gap-2" href={`/admin/course-management/${slug}/goal`}>
            <Circle />
            <span> Intended learners</span>
          </Link>
        </li>
      </ul>
      <ul className="flex flex-col">
        <h3 className="font-bold p-2"> Create your content</h3>
        <li
          className={cn(
            'hover:bg-accent p-2 cursor-pointer',
            pathname === 'curriculum' && 'bg-accent',
          )}
        >
          <Link className="flex gap-2" href={`/admin/course-management/${slug}/curriculum`}>
            <Circle />
            <span> Curriculum</span>
          </Link>
        </li>
      </ul>
      <ul className="flex flex-col">
        <h3 className="font-bold p-2"> Publish your course</h3>
        <li
          className={cn('hover:bg-accent p-2 cursor-pointer', pathname === 'basics' && 'bg-accent')}
        >
          <Link className="flex gap-2" href={`/admin/course-management/${slug}/basics`}>
            <Circle />
            <span> Course and landing page</span>
          </Link>
        </li>
        <li
          className={cn(
            'hover:bg-accent p-2 cursor-pointer',
            pathname === 'pricing' && 'bg-accent',
          )}
        >
          <Link className="flex gap-2" href={`/admin/course-management/${slug}/pricing`}>
            <Circle />
            <span> Pricing</span>
          </Link>
        </li>
        <li
          className={cn(
            'hover:bg-accent p-2 cursor-pointer',
            pathname === 'promotion' && 'bg-accent',
          )}
        >
          <Link className="flex gap-2" href={`/admin/course-management/${slug}/promotion`}>
            <Circle />
            <span> Promotion</span>
          </Link>
        </li>
      </ul>
      {course?.status === 'draft' ? (
        <LoadingButton
          isLoading={isPendingSubmit}
          fallback="Submitting..."
          type="button"
          className="w-full p-3 flex justify-center"
          onClick={() => submitToReview({ slug: slug as string })}
        >
          Submit for review
        </LoadingButton>
      ) : course?.status === COURSE_STATUS.IN_REVIEW ? (
        <Badge variant="secondary">{course && courseStatusMapping[course.status]}</Badge>
      ) : course?.status === COURSE_STATUS.PUBLISHED ? (
        <Badge variant="default">{course && courseStatusMapping[course.status]}</Badge>
      ) : course?.status === COURSE_STATUS.REJECTED ? (
        <Badge variant="destructive">{course && courseStatusMapping[course.status]}</Badge>
      ) : (
        ''
      )}
    </>
  )
}

export default Navigation
