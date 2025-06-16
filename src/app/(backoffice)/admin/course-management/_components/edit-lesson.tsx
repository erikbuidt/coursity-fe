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
import { lessonApi } from '@/services/lessonService'
import type { Lesson } from '@/types/course.type'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
type FormData = {
  title: string
  video_provider: string
  video_url: string
  video_file: File | null
}
function EditLesson({ editingLesson }: { editingLesson: Lesson }) {
  const queryClient = useQueryClient()
  const { slug } = useParams()
  console.log({ slug })
  const { handleSubmit, control, reset, getValues, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      video_provider: 'system', // or 'system' if you want a default
      video_url: '',
      video_file: null,
    },
  })
  const { getToken } = useAuth()
  const { mutateAsync: updateLesson, isPending: isPendingUpdateLesson } = useMutation({
    mutationFn: async (arg: {
      lessonId: number
      payload: Partial<Lesson>
    }) => {
      const { payload, lessonId } = arg
      const token = await getToken()
      return lessonApi.updateLesson(lessonId, payload, token || '')
    },
    onSuccess: () => {
      toast.success('Lessons have been update successfully', {})
      queryClient.invalidateQueries({ queryKey: ['course', slug] })
    },
    onError: () => {
      toast.error('Something went wrong', {})
    },
  })
  const video_provider = watch('video_provider')
  const formValue = getValues()

  const onSubmit = (data: FormData) => {
    updateLesson({ payload: data, lessonId: editingLesson.id })
  }
  useEffect(() => {
    if (
      editingLesson?.title &&
      editingLesson.video_provider &&
      typeof editingLesson.video_provider === 'string' &&
      editingLesson.video_provider.length > 0
    ) {
      reset({
        title: editingLesson.title,
        video_provider: editingLesson.video_provider,
        video_url: editingLesson.video_url,
        video_file: null,
      })
    }
  }, [editingLesson, reset])
  return (
    <div className="min-h-[370px] flex flex-col">
      <h4 className="font-bold">Edit Lesson</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 gap-1">
        <div className="space-y-2">
          <Label htmlFor="title">Lesson Title</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} spellCheck />}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_provider">Video Provider</Label>
          <Controller
            name="video_provider"
            control={control}
            render={({ field }) => {
              console.log({ value: field.value })
              return (
                <Select
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-[180px] m-0">
                    <SelectValue placeholder="Video Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">Youtube</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                  </SelectContent>
                </Select>
              )
            }}
          />
        </div>
        {video_provider === 'system' && (
          <div className="space-y-2">
            <Label htmlFor="file">Video</Label>
            <Controller
              name="video_file"
              control={control}
              render={({ field }) => (
                <VideoUpload video_preview={getValues('video_url')} {...field} />
              )}
            />
          </div>
        )}
        {video_provider !== 'system' && (
          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Controller
              name="video_url"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>
        )}

        <div className="mt-auto flex">
          <Button className="w-fit bg-primary ml-auto">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default EditLesson
