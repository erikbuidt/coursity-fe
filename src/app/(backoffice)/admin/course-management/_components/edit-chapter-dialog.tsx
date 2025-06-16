'use client'
import {
  type LessonItem,
  SortableLessonList,
  SortableLessonListItem,
} from '@/components/custom/sortable-lesson'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Chapter, Lesson } from '@/types/course.type'

import LoadingButton from '@/components/ui/loading-button'
import { lessonApi } from '@/services/lessonService'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import CreateLesson from './create-lesson'
import EditLesson from './edit-lesson'

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
  const [isChangeOrder, setIsChangeOrder] = useState<boolean>(false)
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

  const handleSelectItem = (id: number) => {
    if (chapterEditing) setEditingLesson(items.find((l) => l.id === id) || null)
  }
  const handleSaveLessons = () => {
    if (!chapterEditing) return
    // Find updated lessons (title or position changed)
    const updatedLessons = items.filter((item, idx) => {
      const orig = originalLessons.find((o) => o.id === item.id)
      return orig && orig.position !== idx + 1
    })

    // Prepare payload
    const changedLessons = [
      ...updatedLessons.map((item, _) => ({
        ...item,
        id: item.id,
        position: items.findIndex((i) => i.id === item.id) + 1,
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

  const handleReorder = (newItems: LessonItem[]) => {
    const updatedLessons = newItems.filter((item, idx) => {
      const orig = originalLessons.find((o) => o.id === item.id)
      return orig && orig.position !== idx + 1
    })
    if (updatedLessons.length > 0) setIsChangeOrder(true)
    else setIsChangeOrder(false)
  }
  const handleDeleteLessonId = (lessonId: number) => {
    let newItems = items.filter((item) => item.id !== lessonId)
    newItems = newItems.map((item, index) => ({
      ...item,
      position: index + 1, // Update position based on new index
    }))
    console.log({ newItems, originalLessons })
    const updatedLessons = newItems.filter((item, idx) => {
      const orig = originalLessons.find((o) => o.id === item.id)
      return orig && orig.position !== idx + 1
    })
    if (updatedLessons.length > 0)
      updateLessonPositions({
        payload: {
          lessons: updatedLessons,
        },
      })
  }
  const renderItem = useCallback(
    (
      item: LessonItem,
      editingItem: LessonItem | null,
      index: number,
      onSelectItem: (id: number) => void,
    ) => (
      <SortableLessonListItem
        key={item.id}
        item={item}
        onSelectItem={onSelectItem}
        order={index}
        selected={item.id === editingItem?.id}
      />
    ),
    [],
  )

  useEffect(() => {
    if (chapterEditing) {
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
                  onReorder={handleReorder}
                  setItems={setItems}
                  onCompleteItem={handleCompleteItem}
                  onSelectItem={handleSelectItem}
                  renderItem={renderItem}
                  editingItem={editingLesson}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingLesson(null)}
                  className="text-primary border-primary hover:text-primary cursor-pointer"
                >
                  Add lesson
                  <Plus />
                </Button>
                {isChangeOrder && (
                  <div className="mt-auto text-right">
                    <LoadingButton
                      isLoading={isPendingUpsertLesson}
                      onClick={handleSaveLessons}
                      fallback={'Saving...'}
                    >
                      Save
                    </LoadingButton>
                  </div>
                )}
              </div>
              <div className="col-span-9 flex flex-col gap-2 border-l p-4">
                {editingLesson ? (
                  <EditLesson
                    editingLesson={editingLesson}
                    setEditingLesson={setEditingLesson}
                    onDeleteLesson={handleDeleteLessonId}
                  />
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
