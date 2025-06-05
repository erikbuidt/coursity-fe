'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
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
import type { Chapter } from '@/types/course.type'

function EditCourse() {
  const { getToken } = useAuth()
  const { slug } = useParams()
  const [items, setItems] = useState<ChapterItem[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [chapterEditing, setChapterEditing] = useState<Chapter | null | undefined>(null)

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
    staleTime: 10 * 60 * 1000,
  })

  // Initialize form fields and items from course data
  useEffect(() => {
    if (!isLoading && course) {
      setTitle(course.title || '')
      setDescription(course.description || '')
      setItems(
        course.chapters
          .sort((a, b) => a.position - b.position)
          .map((c) => ({
            ...c,
            checked: false,
          })),
      )
    }
  }, [isLoading, course])

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
  console.log({ chapterEditing })
  const renderItem = useCallback(
    (
      item: ChapterItem,
      index: number,
      onCompleteItem: (id: number) => void,
      onRemoveItem: (id: number) => void,
    ) => (
      <SortableChapterListItem
        key={item.id}
        item={item}
        onCompleteItem={onCompleteItem}
        onRemoveItem={onRemoveItem}
        handleDrag={() => {}}
        order={index}
        onEdit={(chapter) => setChapterEditing(chapter)}
      />
    ),
    [],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement save logic (API call)
    // You can use title, description, and items state here
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load course. Please try again later.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="mt-4">
              <Button type="submit">Save</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableChapterList
            items={items}
            setItems={setItems}
            onCompleteItem={handleCompleteItem}
            renderItem={renderItem}
          />
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="button" onClick={handleAddItem}>
            Add Chapter
          </Button>
          <Button type="button" variant="secondary" onClick={handleResetItems}>
            Reset
          </Button>
          <Button type="submit">Save</Button>
        </CardFooter>
      </Card>
      <EditChapterDialog
        open={!!chapterEditing}
        onChange={(status) => {
          if (!status) setChapterEditing(null)
        }}
        chapterEditing={chapterEditing}
      />
    </div>
  )
}

export default EditCourse
