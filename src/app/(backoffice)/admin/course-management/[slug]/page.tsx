'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import {
  type ChapterItem,
  SortableChapterList,
  SortableChapterListItem,
} from '@/components/custom/sortable-chapter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { courseApi } from '@/services/courseService'
import { Label } from '@radix-ui/react-dropdown-menu'
import EditChapterDialog from '../_components/edit-chapter-dialog'
import type { Chapter, Course } from '@/types/course.type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Controller, useForm } from 'react-hook-form'
import IconInput from '@/components/custom/icon-input'
import { DollarSign, Plus } from 'lucide-react'
import TodoInput, { type Task } from '@/components/custom/todo-input'
import { ImageUpload } from '@/components/custom/image-upload'
import OverlayLoading from '@/components/custom/overlay-loading'
import { toast } from 'sonner'
import { chapterApi } from '@/services/chapterService'
import { type ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
type FormData = {
  title: string
  description: string
  thumbnail: File | null | undefined
  price: number
  category: string
  will_learns: Task[]
  requirements: Task[]
  image_url: string
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
  price: z.string({
    required_error: 'Price is required',
  }),
  thumbnail: z
    .any({
      required_error: 'Thumbnail is required',
    })
    .refine(
      (file) => {
        console.log({ file })
        return file instanceof File || file === null || file === undefined
      },
      {
        message: 'File must be a File object or null',
      },
    ),
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
  image_url: z.string({
    required_error: 'Image URL is required',
  }),
})
function EditCourse() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()
  const { slug } = useParams()
  const [items, setItems] = useState<ChapterItem[]>([])
  const [originalChapters, setOriginalChapters] = useState<ChapterItem[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [chapterEditingText, setChapterEditingText] = useState<string | null>(null)
  const [chapterEditing, setChapterEditing] = useState<ChapterItem | null | undefined>(null)
  const [isChangeOrder, setIsChangeOrder] = useState<boolean>(false)
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
      price: 0,
      category: '',
      will_learns: [],
      requirements: [],
      image_url: '',
    },
    resolver: zodResolver(updateCourseSchema),
  })
  const {
    data: course,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getCourse(slug as string, token || '')
    },
    queryKey: ['course', slug],
  })

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
  const { mutateAsync: upsertChapters, isPending: isPendingSaveChapter } = useMutation({
    mutationFn: async (arg: {
      courseId: number
      payload: { chapters: Partial<Chapter & { is_new: boolean }>[] }
    }) => {
      const { payload, courseId } = arg
      const token = await getToken()
      return chapterApi.upsertChapters(courseId, payload, token || '')
    },
    onSuccess: () => {
      toast.success('Chapters have been update successfully', {})
      setIsChangeOrder(false)
      queryClient.invalidateQueries({ queryKey: ['course', slug] })
    },
    onError: () => {
      toast.error('Something went wrong', {})
    },
  })
  // Initialize form fields and items from course data
  useEffect(() => {
    if (!isLoading && course) {
      reset({
        title: course.title || '',
        description: course.description || '',
        thumbnail: null, // or course.thumbnail if you have it as a File or URL
        price: course.price || 0,
        category: course.category || '',
        image_url: course.image_url,
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
      setTitle(course.title || '')
      setDescription(course.description || '')
      const sortedChapters = course.chapters
        .sort((a, b) => a.position - b.position)
        .map((c) => ({
          ...c,
          isNew: false,
          checked: false,
        }))
      setItems(sortedChapters)
      setOriginalChapters(sortedChapters) // Save original for comparison
    }
  }, [isLoading, course, reset])

  useEffect(() => {
    if (chapterEditing?.id && course?.chapters) {
      const updated = course.chapters.find((c) => c.id === chapterEditing.id)
      if (updated) {
        setChapterEditing({
          ...updated,
          isNew: false,
          checked: false,
        })
      }
    }
  }, [course, chapterEditing?.id])
  const handleAddItem = useCallback(() => {
    const newItem: ChapterItem = {
      id: Date.now(),
      title: `Chapter ${items.length + 1}`,
      checked: false,
      position: items.length + 1,
      isNew: true,
    }

    // setChapterEditingId(newItem.id)
    setItems((prev) => [...prev, newItem])
  }, [items.length])
  const handleResetItems = useCallback(() => setItems([]), [])

  const handleCompleteItem = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    )
  }, [])

  const handleRemoveItem = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])
  const handleUpdateItem = useCallback(
    (id: number, text: string) => {
      if (!course) return
      upsertChapters({
        courseId: course.id,
        payload: {
          chapters: [
            {
              id: id,
              title: text,
              position: items.findIndex((i) => i.id === id) + 1,
              is_new: false,
            },
          ],
        },
      })
    },
    [course, items],
  )
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleCreateItem = useCallback(
    (item: ChapterItem) => {
      if (!course) return
      upsertChapters({
        courseId: course.id,
        payload: {
          chapters: [
            {
              title: item.title,
              position: item.position,
              is_new: item.isNew,
            },
          ],
        },
      })
    },
    [course],
  )
  const handleCancelUpdateItem = useCallback(
    (id: number, text: string) => {
      const editingItem = items.find((obj) => obj.id === id)
      let newTasks = items
      if (editingItem?.isNew && !text) {
        newTasks = items.filter((obj) => obj.id !== id)
        setItems(newTasks)
      }
    },
    [items],
  )
  const renderItem = useCallback(
    (
      item: ChapterItem,
      index: number,
      onCompleteItem: (id: number) => void,
      onUpdateItem: (id: number, text: string) => void,
      onCreateItem: (item: ChapterItem) => void,
      onCancelUpdateItem: (id: number, text: string) => void,
      onRemoveItem: (id: number) => void,
    ) => (
      <SortableChapterListItem
        key={item.id}
        item={item}
        onCompleteItem={onCompleteItem}
        onUpdateItem={onUpdateItem}
        onCreateItem={onCreateItem}
        onCancelUpdateItem={onCancelUpdateItem}
        onRemoveItem={onRemoveItem}
        handleDrag={() => {}}
        order={index}
        onEdit={(chapter) => setChapterEditing(chapter)}
      />
    ),
    [],
  )
  const handleSaveChapters = () => {
    if (!course) return

    // Find updated chapters (title or position changed)
    const updatedChapters = items.filter((item, idx) => {
      const orig = originalChapters.find((o) => o.id === item.id)
      return orig && (orig.title !== item.title || orig.position !== idx + 1)
    })

    // Prepare payload
    const changedChapters = [
      ...updatedChapters.map((item, idx) => ({
        ...item,
        is_new: false,
        position: items.findIndex((i) => i.id === item.id) + 1,
      })),
    ]

    if (changedChapters.length === 0) {
      toast.info('No changes to save.')
      return
    }
    upsertChapters({
      courseId: course.id,
      payload: {
        chapters: changedChapters,
      },
    })
  }
  const handleReorder = (newItems: ChapterItem[]) => {
    const updatedChapters = newItems.filter((item, idx) => {
      const orig = originalChapters.find((o) => o.id === item.id)
      return orig && orig.position !== idx + 1
    })
    if (updatedChapters.length > 0) setIsChangeOrder(true)
    else setIsChangeOrder(false)
  }

  const onSubmit = (data: FormData) => {
    const payload: Partial<Course> = {
      ...data,
      will_learns: data.will_learns.map((i) => i.text),
      requirements: data.requirements.map((i) => i.text),
    }
    updateCourse({ payload })
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load course. Please try again later.</div>
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <Card className="w-full max-w-8xl container">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
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
                <div className="grid gap-1">
                  <Label className="font-semibold">Price</Label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <IconInput type="number" icon={<DollarSign size={15} />} {...field} />
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label className="font-semibold">
                  What will learns <span className="text-red-500">*</span>
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
                <Label className="font-semibold">
                  Requirements <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="requirements"
                  control={control}
                  render={({ field }) => (
                    <TodoInput {...field} error={errors.requirements?.message} />
                  )}
                />
              </div>
              <div className="grid gap-1">
                <Label>
                  Thumbnail <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload image_preview={getValues('image_url')} {...field} />
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
      <Card className="w-full max-w-8xl container">
        <CardHeader>
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableChapterList
            items={items || []}
            setItems={setItems}
            onReorder={handleReorder}
            onCompleteItem={handleCompleteItem}
            onUpdateItem={handleUpdateItem}
            onCreateItem={handleCreateItem}
            onCancelUpdateItem={handleCancelUpdateItem}
            renderItem={renderItem}
          />
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-primary border-primary hover:text-primary"
            onClick={handleAddItem}
          >
            <Plus />
            Add Chapter
          </Button>

          {isChangeOrder && (
            <Button type="submit" onClick={handleSaveChapters}>
              Save
            </Button>
          )}
        </CardFooter>
      </Card>
      <EditChapterDialog
        open={!!chapterEditing}
        onChange={(status) => {
          if (!status) setChapterEditing(null)
        }}
        chapterEditing={chapterEditing}
      />
      <OverlayLoading open={isPending || isPendingSaveChapter} />
    </div>
  )
}

export default EditCourse
