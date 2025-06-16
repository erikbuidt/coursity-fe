'use client'
import {
  LessonItem,
  SortableLessonList,
  SortableLessonListItem,
} from '@/components/custom/sortable-lesson'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { Chapter, Lesson } from '@/types/course.type'

import { useCallback, useEffect, useState } from 'react'
import CreateLesson from './create-lesson'
import EditLesson from './edit-lesson'
import { Plus } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@clerk/nextjs'
import { lessonApi } from '@/services/lessonService'
import LoadingButton from '@/components/ui/loading-button'

export function EditChapterDialog({
  open = false,
  onChange,
  chapterEditing,
}: {
  open: boolean
  onChange: (status: boolean) => void
  chapterEditing?: Chapter | null | undefined
}) {
  const queryClient = useQueryClient()
  const [items, setItems] = useState<LessonItem[]>([])
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null)
  const [originalLessons, setOriginalLessons] = useState<LessonItem[]>([])
  const { getToken } = useAuth()
  const { mutateAsync: updateLessonPositions, isPending: isPendingUpsertLesson } = useMutation({
    mutationFn: async (arg: {
      payload: { lessons: Partial<Lesson>[] }
    }) => {
      const { payload } = arg
      const token = await getToken()
      return lessonApi.updateLessonPositions(payload, token || '')
    },
    onSuccess: () => {
      toast.success('Lessons have been update successfully', {})
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
    onError: () => {
      toast.error('Something went wrong', {})
    },
  })

  const handleCompleteItem = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    )
  }, [])

  const handleRemoveItem = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const handleSelectItem = (id: number) => {
    if (chapterEditing) setEditingLesson(items.find((l) => l.id === id) || null)
  }
  const handleSaveLessons = () => {
    if (!chapterEditing) return

    // Find updated lessons (title or position changed)
    const updatedLessons = items.filter((item, idx) => {
      const orig = originalLessons.find((o) => o.id === item.id)
      return orig && (orig.title !== item.title || orig.position !== idx + 1)
    })

    // Find deleted lessons (in original but not in items)
    const deletedLessons = originalLessons.filter(
      (orig) => !items.some((item) => item.id === orig.id),
    )

    // Prepare payload
    const changedLessons = [
      ...updatedLessons.map((item, idx) => ({
        id: item.id,
        position: items.findIndex((i) => i.id === item.id) + 1,
      })),
      ...deletedLessons.map((item) => ({
        id: item.id,
        is_deleted: true,
      })),
    ]

    if (changedLessons.length === 0) {
      return
    }
    updateLessonPositions({
      payload: {
        lessons: changedLessons,
      },
    })
  }
  const renderItem = useCallback(
    (
      item: LessonItem,
      editingItem: LessonItem | null,
      index: number,
      onCompleteItem: (id: number) => void,
      onRemoveItem: (id: number) => void,
      onSelectItem: (id: number) => void,
    ) => (
      <SortableLessonListItem
        key={item.id}
        item={item}
        onSelectItem={onSelectItem}
        onCompleteItem={onCompleteItem}
        onRemoveItem={onRemoveItem}
        handleDrag={() => {}}
        order={index}
        selected={item.id === editingItem?.id}
      />
    ),
    [],
  )

  useEffect(() => {
    if (chapterEditing) {
      console.log('rerender')

      const sortedLessons = chapterEditing.lessons
        ?.sort((a, b) => a.position - b.position)
        .map((c) => ({
          ...c,
          isNew: false,
          checked: false,
        }))
      if (sortedLessons) {
        setItems(sortedLessons)
        setOriginalLessons(sortedLessons)
      }
    }
  }, [chapterEditing])

  return (
    <Dialog open={open} onOpenChange={(status) => onChange(status)}>
      <div className="col-span-3">
        <form>
          <DialogContent className="sm:max-w-[1225px]">
            <DialogHeader className="p-4">
              <DialogTitle>{chapterEditing?.title}</DialogTitle>
            </DialogHeader>
            <Separator />

            <div className="grid grid-cols-12">
              <div className="col-span-3 flex flex-col gap-2 p-4 bg-accent">
                <SortableLessonList
                  items={items}
                  setItems={setItems}
                  onCompleteItem={handleCompleteItem}
                  onSelectItem={handleSelectItem}
                  renderItem={renderItem}
                  editingItem={editingLesson}
                />
                <Button
                  variant="outline"
                  onClick={() => setEditingLesson(null)}
                  className="bg-transparent text-primary"
                >
                  Add lesson
                  <Plus />
                </Button>
                <div className="mt-auto text-right">
                  <LoadingButton
                    isLoading={isPendingUpsertLesson}
                    onClick={handleSaveLessons}
                    fallback={'Saving...'}
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
              <div className="col-span-9 flex flex-col gap-2 border-l p-4">
                {editingLesson ? (
                  <EditLesson editingLesson={editingLesson} />
                ) : (
                  chapterEditing && <CreateLesson chapter_id={chapterEditing.id} />
                )}
              </div>
            </div>
          </DialogContent>
        </form>
      </div>
    </Dialog>
  )
}

export default EditChapterDialog
