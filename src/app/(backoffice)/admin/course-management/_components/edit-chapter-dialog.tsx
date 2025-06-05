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

export function EditChapterDialog({
  open = false,
  onChange,
  chapterEditing,
}: {
  open: boolean
  onChange: (status: boolean) => void
  chapterEditing?: Chapter | null | undefined
}) {
  const [items, setItems] = useState<LessonItem[]>([])
  const [lessonEditing, setLessonEditing] = useState<Lesson | null>(null)

  const handleAddItem = useCallback(() => {
    const newItem: ChapterItem = {
      title: `Chapter ${items.length + 1}`,
      checked: false,
      position: items.length + 1,
    }
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

  const handleSelectItem = (id: number) => {
    if (chapterEditing) setLessonEditing(chapterEditing.lessons.find((l) => l.id === id) || null)
  }
  const renderItem = useCallback(
    (
      item: LessonItem,
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
      />
    ),
    [],
  )

  useEffect(() => {
    if (chapterEditing) {
      setItems(
        chapterEditing.lessons
          .sort((a, b) => a.position - b.position)
          .map((c) => ({
            ...c,
            checked: false,
          })),
      )
    }
  }, [chapterEditing])

  return (
    <Dialog open={open} onOpenChange={(status) => onChange(status)}>
      <div className="col-span-3">
        <form>
          <DialogContent className="sm:max-w-[1225px]">
            <DialogHeader className="p-4">
              <DialogTitle>Edit chapter</DialogTitle>
            </DialogHeader>
            <Separator />

            <div className="grid gap-2 grid-cols-12">
              <div className="col-span-3 flex flex-col gap-2 p-4 flex-end">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={chapterEditing?.title}
                  value={chapterEditing?.title}
                />
                <SortableLessonList
                  items={items}
                  setItems={setItems}
                  onCompleteItem={handleCompleteItem}
                  onSelectItem={handleSelectItem}
                  renderItem={renderItem}
                />
                <Button
                  variant="outline"
                  onClick={() => setLessonEditing(null)}
                  className="bg-transparent text-primary"
                >
                  Add lesson
                  <Plus />
                </Button>
                <div className="mt-auto text-right">
                  <Button className="">Save</Button>
                </div>
              </div>
              <div className="col-span-9 flex flex-col gap-2 border-l p-4">
                {lessonEditing ? <EditLesson /> : <CreateLesson />}
              </div>
            </div>
          </DialogContent>
        </form>
      </div>
    </Dialog>
  )
}

export default EditChapterDialog
