'use client'

import { GripVertical } from 'lucide-react'
import { AnimatePresence, LayoutGroup, Reorder, useDragControls } from 'motion/react'
// npx shadcn-ui@latest add checkbox
// npm  i react-use-measure
import { type Dispatch, type ReactNode, type SetStateAction, useState } from 'react'
import useMeasure from 'react-use-measure'

import { cn } from '@/lib/utils'
import type { Lesson } from '@/types/course.type'

export type LessonItem = Lesson & {
  checked: boolean
  isNew: boolean
}

interface SortableListItemProps {
  item: LessonItem
  order: number
  selected: boolean
  onSelectItem?: (id: number) => void
  className?: string
}

function SortableLessonListItem({
  item,
  order,
  selected,
  onSelectItem,
}: SortableListItemProps) {
  const [ref, bounds] = useMeasure()
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()

  const handleDragStart = (event: React.PointerEvent) => {
    setIsDragging(true)
    dragControls.start(event)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="flex w-full items-center cursor-pointer"
      onClick={() => {
        if (onSelectItem) onSelectItem(item.id)
      }}
    >
      <Reorder.Item
        value={item}
        className={cn(
          'relative z-auto grow',
          'h-full rounded-lg bg-white',
          'border',
          selected && 'bg-primary/10',
          item.checked ? 'cursor-not-allowed' : '',
          item.checked && !isDragging ? 'w-7/10' : 'w-full',
        )}
        key={item.id}
        dragListener={false}
        dragControls={dragControls}
        onDragEnd={handleDragEnd}
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
        whileDrag={{ zIndex: 9999 }}
      >
        <div ref={ref} className={cn('z-20 ')}>
          <div className="flex items-center justify-between ">
            <h3
              className={cn(
                'tracking-tighter text-left text-md pl-3',
                item.checked ? 'text-red-400' : 'text-black',
              )}
            >
              <span className="text-md">{order + 1}. </span>
              {item.title}
            </h3>
            <div
              className="cursor-grab p-2"
              onPointerDown={(e) => {
                e.preventDefault()
                handleDragStart(e)
              }}
              style={{ touchAction: 'none' }}
            >
              <GripVertical />
            </div>
            {/* {renderExtra && renderExtra(item)} */}
          </div>
        </div>
      </Reorder.Item>
      {/* ...existing code for delete animation... */}
    </div>
  )
}

SortableLessonListItem.displayName = 'SortableLessonListItem'

interface SortableListProps {
  items: LessonItem[]
  onReorder: (newItems: LessonItem[]) => void
  editingItem: LessonItem | null
  setItems: Dispatch<SetStateAction<LessonItem[]>>
  onSelectItem: (id: number) => void
  renderItem: (
    item: LessonItem,
    editingItem: LessonItem | null,
    order: number,
    onSelectItem: (id: number) => void,
  ) => ReactNode
}

function SortableLessonList({
  items,
  onReorder,
  editingItem,
  setItems,
  onSelectItem,
  renderItem,
}: SortableListProps) {
  const handleReorder = (newItems: LessonItem[]) => {
    setItems(newItems)
    if (onReorder) {
      onReorder(newItems)
    }
  }
  if (items) {
    return (
      <>
        <LayoutGroup>
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={handleReorder}
            className="flex flex-col gap-2"
          >
            <AnimatePresence>
              {items?.map((item, index) =>
                renderItem(
                  item,
                  editingItem,
                  index,
                  onSelectItem,
                ),
              )}
            </AnimatePresence>
          </Reorder.Group>
        </LayoutGroup>
      </>
    )
  }
  return null
}

SortableLessonList.displayName = 'SortableLessonList'

export { SortableLessonList, SortableLessonListItem }
