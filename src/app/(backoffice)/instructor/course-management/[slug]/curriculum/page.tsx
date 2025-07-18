'use client'
import OverlayLoading from '@/components/custom/overlay-loading'
import {
  type ChapterItem,
  SortableChapterList,
  SortableChapterListItem,
} from '@/components/custom/sortable-chapter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { chapterApi } from '@/services/chapterService'
import { courseApi } from '@/services/courseService'
import type { Chapter } from '@/types/course.type'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import EditChapterDialog from '../../_components/edit-chapter-dialog'
import { useCourse } from '@/contexts/course-context'

function Curriculum() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()
  const { slug } = useParams()
  const [items, setItems] = useState<ChapterItem[]>([])
  const [originalChapters, setOriginalChapters] = useState<ChapterItem[]>([])
  const [chapterEditing, setChapterEditing] = useState<ChapterItem | null | undefined>(null)
  const [isChangeOrder, setIsChangeOrder] = useState<boolean>(false)

  const course = useCourse()

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

  const handleAddItem = useCallback(() => {
    const newItem: ChapterItem = {
      id: Date.now(),
      title: '',
      checked: false,
      position: items.length + 1,
      isNew: true,
    }

    // setChapterEditingId(newItem.id)
    setItems((prev) => [...prev, newItem])
  }, [items.length])

  const handleCompleteItem = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    )
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
      ...updatedChapters.map((item) => ({
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
  // Initialize form fields and items from course data
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

  // Initialize form fields and items from course data
  useEffect(() => {
    if (course) {
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
  }, [course])

  return (
    <>
      <Card className="w-full max-w-8xl container">
        <CardHeader>
          <CardTitle className="text-3xl p-3 border-b-1">Curriculum</CardTitle>
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
      <OverlayLoading open={isPendingSaveChapter} />
    </>
  )
}

export default Curriculum
