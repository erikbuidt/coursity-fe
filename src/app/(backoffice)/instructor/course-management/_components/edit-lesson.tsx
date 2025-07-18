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
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Trash } from 'lucide-react'
import LoadingButton from '@/components/ui/loading-button'
import { AlertConfirm } from '@/components/custom/alert-confirm'
import type { LessonItem } from '@/components/custom/sortable-lesson'
import Image from 'next/image'
type FormData = {
  title: string
  video_provider: string
  video_url: string
  video_file: File | null
}
function EditLesson({
  editingLesson,
  setEditingLesson,
  onDeleteLesson,
}: {
  editingLesson: Lesson
  setEditingLesson: Dispatch<SetStateAction<LessonItem | null>>
  onDeleteLesson: (lessonId: number) => void
}) {
  const queryClient = useQueryClient()
  const { slug } = useParams()
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false)
  const [ytbThumbnail, setYtbThumbnail] = useState<string>('')
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

  const { mutateAsync: deleteLesson, isPending: isPendingDeleteLesson } = useMutation({
    mutationFn: async (arg: {
      lessonId: number
    }) => {
      const { lessonId } = arg
      const token = await getToken()
      return lessonApi.deleteLesson(lessonId, token || '')
    },
    onSuccess: () => {
      toast.success('Lesson has been delete successfully', {})
      setIsOpenConfirm(false)
      onDeleteLesson?.(editingLesson.id)
      setEditingLesson(null)
      queryClient.invalidateQueries({ queryKey: ['course', slug] })
    },
    onError: () => {
      toast.error('Something went wrong', {})
    },
  })
  const video_url = watch('video_url')
  const video_provider = watch('video_provider')

  const handleContinue = async () => {
    deleteLesson({ lessonId: editingLesson.id })
  }

  const onSubmit = (data: FormData) => {
    updateLesson({ payload: data, lessonId: editingLesson.id })
  }
  useEffect(() => {
    if (editingLesson) {
      reset({
        title: editingLesson.title,
        video_provider: editingLesson.video_provider,
        video_url: editingLesson.video_url,
        video_file: null,
      })
    }
  }, [editingLesson, reset])
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
      <div className="flex justify-between">
        <h4 className="font-bold">Edit Lesson</h4>
        <Button
          onClick={() => setIsOpenConfirm(true)}
          type="button"
          size="icon"
          variant="destructive"
          className="cursor-pointer"
        >
          <Trash />
        </Button>
      </div>
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
              return (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    value && field.onChange(value) // Update form state
                  }}
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
          <div className="space-y-2 h-[100px]">
            <Label htmlFor="link">Link</Label>
            <Controller
              name="video_url"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <div className=''>
              {ytbThumbnail && <Image className='rounded-lg overflow-hidden' width={200} height={300} src={ytbThumbnail} alt="" />}
            </div>
          </div>
        )}

        <div className="mt-auto flex">
          <LoadingButton className="ml-auto" isLoading={isPendingUpdateLesson} fallback="Saving...">
            Save
          </LoadingButton>
        </div>
      </form>
      <AlertConfirm
        open={isOpenConfirm}
        isPending={isPendingDeleteLesson}
        onCancel={() => setIsOpenConfirm(false)}
        onContinue={handleContinue}
      />
    </div>
  )
}

export default EditLesson
