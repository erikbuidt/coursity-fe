import { VideoUpload } from '@/components/custom/video-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, type ZodType } from 'zod' // Add new import
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Lesson } from '@/types/course.type'
import { lessonApi } from '@/services/lessonService'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import LoadingButton from '@/components/ui/loading-button'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type FormData = {
  title: string
  video_provider: string
  video_url?: string
  video_file?: File | null
}
const createLessonSchema: ZodType<FormData> = z
  .object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .nonempty(),
    category: z.string().optional(),
    video_provider: z.string(),
    video_file: z.any().optional(),
    video_url: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.video_provider === 'system') {
      if (!(data.video_file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Video file is required',
          path: ['video_file'],
        })
      }
    } else {
      if (!data.video_url || data.video_url.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Video URL is required',
          path: ['video_url'],
        })
      }
    }
  })

function CreateLesson({ chapter_id }: { chapter_id: number }) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      video_provider: 'system',
      video_url: '',
      video_file: null,
    },
    resolver: zodResolver(createLessonSchema),
  })
  const [ytbThumbnail, setYtbThumbnail] = useState<string>('')
  const video_provider = watch('video_provider')
  const video_url = watch('video_url')
  const { mutateAsync: createLesson, isPending: isPendingCreateLesson } = useMutation({
    mutationFn: async (arg: {
      payload: FormData & { chapter_id: number }
    }) => {
      const { payload } = arg

      const token = await getToken()
      return lessonApi.createLesson(payload, token || '')
    },
    onSuccess: () => {
      toast.success('Lessons have been update successfully', {})
      reset({
        title: '',
        video_provider: 'system',
        video_url: '',
        video_file: null,
      })
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
    onError: () => {
      toast.error('Something went wrong', {})
    },
  })

  const onSubmit = (data: FormData) => {
    createLesson({
      payload: {
        ...data,
        chapter_id: chapter_id,
      },
    })
  }
  useEffect(() => {
    if (video_url?.startsWith('https://www.youtube.com/watch?v') && video_provider === 'youtube') {
      const videoId = video_url.split('v=')[1]
      setYtbThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
    } else {
      setYtbThumbnail('')
    }
  }, [video_url, video_provider])
  return (
    <div className="min-h-[370px] flex flex-col">
      <h4 className="font-bold">Create Lesson</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="space-y-2">
          <Label htmlFor="title">
            Lesson Title <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} spellCheck error={errors.title?.message} />}
          />
        </div>
        <div className="space-y-2 mt-2">
          <Label htmlFor="video_provider">Video Provider</Label>
          <Controller
            name="video_provider"
            control={control}
            render={({ field }) => (
              <Select value={field.value} defaultValue="system" onValueChange={field.onChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Video Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">Youtube</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {video_provider === 'system' && (
          <div className="space-y-2">
            <Label htmlFor="file">
              Video <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="video_file"
              control={control}
              render={({ field }) => (
                <VideoUpload
                  video_preview={getValues('video_url')}
                  {...field}
                  error={errors.video_file?.message}
                />
              )}
            />
          </div>
        )}
        {video_provider !== 'system' && (
          <div className="space-y-2">
            <Label htmlFor="link">
              Link <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="video_url"
              control={control}
              render={({ field }) => <Input {...field} error={errors.video_url?.message} />}
            />
            {ytbThumbnail && <Image className='rounded-lg overflow-hidden' width={200} height={300} src={ytbThumbnail} alt="" />}
          </div>
        )}
        <div className="mt-auto flex">
          <LoadingButton
            isLoading={isPendingCreateLesson}
            className="ml-auto"
            fallback={'Creating...'}
          >
            Create
          </LoadingButton>
        </div>
      </form>
    </div>
  )
}

export default CreateLesson
