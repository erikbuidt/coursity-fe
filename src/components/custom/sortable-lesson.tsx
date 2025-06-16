'use client'

import { ChevronDown, GripVertical, Pen, Pencil } from 'lucide-react'
import { AnimatePresence, LayoutGroup, Reorder, motion, useDragControls } from 'motion/react'
// npx shadcn-ui@latest add checkbox
// npm  i react-use-measure
import { type Dispatch, type ReactNode, type SetStateAction, useState } from 'react'
import useMeasure from 'react-use-measure'

import { cn } from '@/lib/utils'
import type { Lesson } from '@/types/course.type'
import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { Button } from '../ui/button'

export type LessonItem = Lesson & {
  checked: boolean
  isNew: boolean
}

interface SortableListItemProps {
  item: LessonItem
  order: number
  selected: boolean
  onCompleteItem: (id: number) => void
  onRemoveItem: (id: number) => void
  onSelectItem?: (id: number) => void
  renderExtra?: (item: LessonItem) => React.ReactNode
  className?: string
  handleDrag: () => void
}

function SortableLessonListItem({
  item,
  order,
  selected,
  onCompleteItem,
  onRemoveItem,
  renderExtra,
  handleDrag,
  onSelectItem,
  className,
}: SortableListItemProps) {
  const [ref, bounds] = useMeasure()
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()

  const handleDragStart = (event: React.PointerEvent) => {
    setIsDragging(true)
    dragControls.start(event)
    handleDrag()
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
          'h-full rounded-xl bg-white',
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
          <div className="flex items-center py-1 ">
            <div
              className="cursor-grab p-2"
              onPointerDown={handleDragStart}
              style={{ touchAction: 'none' }}
            >
              <GripVertical />
            </div>
            <h3
              className={cn(
                'tracking-tighter text-left text-md',
                item.checked ? 'text-red-400' : 'text-black',
              )}
            >
              <span className="text-md">{order + 1}.</span>
              {item.checked ? 'Delete' : ` ${item.title}`}
            </h3>

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
  editingItem: LessonItem | null
  setItems: Dispatch<SetStateAction<LessonItem[]>>
  onCompleteItem: (id: number) => void
  onSelectItem: (id: number) => void
  renderItem: (
    item: LessonItem,
    editingItem: LessonItem | null,
    order: number,
    onCompleteItem: (id: number) => void,
    onRemoveItem: (id: number) => void,
    onSelectItem: (id: number) => void,
  ) => ReactNode
}

function SortableLessonList({
  items,
  editingItem,
  setItems,
  onCompleteItem,
  onSelectItem,
  renderItem,
}: SortableListProps) {
  if (items) {
    return (
      <>
        <LayoutGroup>
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={setItems}
            className="flex flex-col gap-2"
          >
            <AnimatePresence>
              {items?.map((item, index) =>
                renderItem(
                  item,
                  editingItem,
                  index,
                  onCompleteItem,
                  (id: number) => setItems((items) => items.filter((item) => item.id !== id)),
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
