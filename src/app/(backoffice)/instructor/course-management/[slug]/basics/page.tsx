'use client'
import { ImageUpload } from '@/components/custom/image-upload'
import OverlayLoading from '@/components/custom/overlay-loading'
import { VideoUpload } from '@/components/custom/video-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCourse } from '@/contexts/course-context'
import { courseApi } from '@/services/courseService'
import type { Course } from '@/types/course.type'
import { useAuth } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type ZodType, z } from 'zod'
type FormData = {
  title: string
  description: string
  thumbnail?: File | null | undefined
  promotion_video?: File | null | undefined
  category?: string
  image_url: string
  promotion_video_url?: string
}

const updateCourseSchema: ZodType<FormData> = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .nonempty(),
  category: z.string().optional(),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .nonempty(),

  thumbnail: z
    .any({
      required_error: 'Thumbnail is required',
    })
    .optional()
    .refine(
      (file) => {
        return file instanceof File || file === null || file === undefined
      },
      {
        message: 'File must be a File object or null',
      },
    ),
  promotion_video: z
    .any({
      required_error: 'Promotion video is required',
    })
    .optional()
    .refine(
      (file) => {
        return file instanceof File || file === null || file === undefined
      },
      {
        message: 'File must be a File object or null',
      },
    ),
  image_url: z.string({
    required_error: 'Image URL is required',
  }),
  promotion_video_url: z.any().optional(),
})
function Basics() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()
  const { slug } = useParams()
  const {
    control,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      thumbnail: null,
      promotion_video: null,
      category: '',
      image_url: '',
      promotion_video_url: '',
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
  // Initialize form fields and items from course data
  useEffect(() => {
    if (course) {
      reset({
        title: course.title || '',
        description: course.description || '',
        thumbnail: null, // or course.thumbnail if you have it as a File or URL
        category: course.category || '',
        image_url: course.image_url,
        promotion_video_url: course.promotion_video_url || '',
      })
    }
  }, [course, reset])

  const onSubmit = (data: FormData) => {
    const payload: Partial<Course> = {
      ...data,
    }
    updateCourse({ payload })
  }

  return (
    <div className="relative">
      <Card className="w-full max-w-8xl container">
        <CardHeader>
          <CardTitle className="text-3xl p-3 border-b-1">Course and landing page</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label className="font-semibold">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} spellCheck error={errors.title?.message} />
                  )}
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-semibold">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} spellCheck error={errors.description?.message} />
                  )}
                />
              </div>
              <div className="flex gap-4">
                <div className="grid gap-1">
                  <Label className="font-semibold">Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Video Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Youtube</SelectItem>
                          <SelectItem value="dark">System</SelectItem>
                          <SelectItem value="system">Vimeo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label className="font-semibold">
                  Thumbnail <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3 flex-1">
                  <Controller
                    name="thumbnail"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload image_preview={getValues('image_url')} {...field} />
                    )}
                  />
                  <p className="flex-3">
                    <span>
                      Upload your course image here. It must meet our course image quality standards
                      to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or
                      .png. no text on the image.
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid gap-1">
                <Label className="">
                  <span className="font-semibold">Promotion video</span>{' '}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3 flex-1">
                  <Controller
                    name="promotion_video"
                    control={control}
                    render={({ field }) => (
                      <VideoUpload video_preview={getValues('promotion_video_url')} {...field} />
                    )}
                  />
                  <p className="flex-3">
                    <span>
                      Your promo video is a quick and compelling way for students to preview what
                      they’ll learn in your course. Students considering your course are more likely
                      to enroll if your promo video is well-made
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <Button type="submit" className="mt-4">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
      <OverlayLoading open={isPending} />
    </div>
  )
}

export default Basics
