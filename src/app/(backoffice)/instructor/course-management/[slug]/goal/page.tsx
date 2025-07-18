'use client'
import OverlayLoading from '@/components/custom/overlay-loading'
import TodoInput, { type Task } from '@/components/custom/todo-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCourse } from '@/contexts/course-context'
import { courseApi } from '@/services/courseService'
import type { Course } from '@/types/course.type'
import { useAuth } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type ZodType, z } from 'zod'
type FormData = {
  will_learns: Task[]
  requirements: Task[]
}

const updateCourseSchema: ZodType<FormData> = z.object({
  will_learns: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        isNew: z.boolean(),
      }),
    )
    .min(1, { message: 'At least one is required' }),
  requirements: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        isNew: z.boolean(),
      }),
    )
    .min(1, { message: 'At least one is required' }),
})
function Goal() {
  const queryClient = useQueryClient()
  const { slug } = useParams()
  const { getToken } = useAuth()
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      will_learns: [],
      requirements: [],
    },
    resolver: zodResolver(updateCourseSchema),
  })
  const course = useCourse()
  const { mutateAsync: updateCourse, isPending } = useMutation({
    mutationFn: async (arg: { payload: Partial<Course> }) => {
      const { payload } = arg
      const token = await getToken()
      return courseApi.updateCourse(slug as string, payload, token || '')
    },
    onSuccess: () => {
      toast.success('Course has been update successfully', {})
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
    onError: () => {
      toast.error('Something went wrong', {})
    },
  })
  const onSubmit = (data: FormData) => {
    const payload: Partial<Course> = {
      will_learns: data.will_learns.map((i) => i.text),
      requirements: data.requirements.map((i) => i.text),
    }
    updateCourse({ payload })
  }
  useEffect(() => {
    if (course) {
      reset({
        will_learns:
          course.will_learns?.map((item, index) => ({
            id: Date.now().toString() + index,
            text: item,
            isNew: false,
          })) || [],
        requirements:
          course.requirements?.map((item, index) => ({
            id: Date.now().toString() + index,
            text: item,
            isNew: false,
          })) || [],
      })
    }
  }, [course, reset])

  return (
    <>
      <Card className="w-full max-w-8xl container">
        <CardHeader>
          <CardTitle className="text-3xl p-3 border-b-1">Intended learners</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label>
                  <span className="font-bold">What will students learn in your course?</span>{' '}
                  <span className="text-red-500">*</span>
                  <p>
                    <span>
                      You must enter at least 4 learning objectives or outcomes that learners can
                      expect to achieve after completing your course.
                    </span>
                  </p>
                </Label>
                <Controller
                  name="will_learns"
                  control={control}
                  render={({ field }) => (
                    <TodoInput {...field} error={errors.will_learns?.message} />
                  )}
                />
              </div>
              <div className="grid gap-3">
                <Label>
                  <span className="font-bold">
                    What are the requirements or prerequisites for taking your course?
                  </span>{' '}
                  <span className="text-red-500">*</span>
                  <p>
                    <span>
                      List the required skills, experience, tools or equipment learners should have
                      prior to taking your course. If there are no requirements, use this space as
                      an opportunity to lower the barrier for beginners.
                    </span>
                  </p>
                </Label>
                <Controller
                  name="requirements"
                  control={control}
                  render={({ field }) => (
                    <TodoInput {...field} error={errors.requirements?.message} />
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="mt-4">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
      <OverlayLoading open={isPending} />
    </>
  )
}

export default Goal
