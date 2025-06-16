'use client'

import { Check, ChevronDown, Edit3, GripVertical, Pen, Trash, X } from 'lucide-react'
import { AnimatePresence, LayoutGroup, Reorder, motion, useDragControls } from 'motion/react'
// npx shadcn-ui@latest add checkbox
// npm  i react-use-measure
import { type Dispatch, type ReactNode, type SetStateAction, useState } from 'react'
import useMeasure from 'react-use-measure'

import { cn } from '@/lib/utils'
import type { Chapter } from '@/types/course.type'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'

export type ChapterItem = Chapter & {
  isNew: boolean
  checked: boolean
}

interface SortableListItemProps {
  item: ChapterItem
  order: number
  onCompleteItem: (id: number) => void
  onUpdateItem: (id: number, text: string) => void
  onCreateItem: (item: ChapterItem) => void
  onCancelUpdateItem: (id: number, text: string) => void
  onRemoveItem: (id: number) => void
  onEdit: (item: ChapterItem) => void
  renderExtra?: (item: ChapterItem) => React.ReactNode
  isExpanded?: boolean
  className?: string
  handleDrag: () => void
}

function SortableChapterListItem({
  item,
  order,
  onCompleteItem,
  onUpdateItem,
  onCreateItem,
  onCancelUpdateItem,
  onRemoveItem,
  renderExtra,
  onEdit,
  handleDrag,
  isExpanded,
  className,
}: SortableListItemProps) {
  const [ref, bounds] = useMeasure()
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')

  const handleDragStart = (event: React.PointerEvent) => {
    setIsDragging(true)
    dragControls.start(event)
    handleDrag()
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }
  const cancelEdit = () => {
    if ((editingId || item.isNew) && onCancelUpdateItem) {
      onCancelUpdateItem(editingId || item.id, inputValue)
    }
    setEditingId(null)
    setInputValue('')
  }
  return (
    <motion.div className={cn('', className)} key={item.id}>
      <div className="flex w-full items-center">
        <Reorder.Item
          value={item}
          className={cn(
            'relative z-auto grow',
            'h-full rounded-xl bg-white',
            'border',
            item.checked ? 'cursor-not-allowed' : '',
            item.checked && !isDragging ? 'w-7/10' : 'w-full',
          )}
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            height: bounds.height > 0 ? bounds.height : undefined,
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.4,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.05,
              type: 'spring',
              bounce: 0.1,
            },
          }}
          layout
          layoutId={`item-${item.id}`}
          dragListener={false}
          dragControls={dragControls}
          onDragEnd={handleDragEnd}
          style={
            isExpanded
              ? {
                  zIndex: 9999,
                  marginTop: 10,
                  marginBottom: 10,
                  position: 'relative',
                  overflow: 'hidden',
                }
              : {
                  position: 'relative',
                  overflow: 'hidden',
                }
          }
          whileDrag={{ zIndex: 9999 }}
        >
          <div ref={ref} className={cn(isExpanded ? '' : '', 'z-20 ')}>
            <Collapsible className="group/collapsible items-center px-2 py-2">
              <div className="flex items-center ">
                {editingId || item.isNew ? (
                  <></>
                ) : (
                  <>
                    <div
                      className="cursor-grab p-2"
                      onPointerDown={handleDragStart}
                      style={{ touchAction: 'none' }}
                    >
                      <GripVertical />
                    </div>
                  </>
                )}
                <CollapsibleTrigger className="w-full">
                  <motion.div layout="position" className="flex items-center justify-start w-full">
                    <AnimatePresence>
                      {!isExpanded ? (
                        <motion.div
                          initial={{ opacity: 0, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, filter: 'blur(4px)' }}
                          transition={{ duration: 0.001 }}
                          className="flex items-center space-x-2  w-full"
                        >
                          <motion.div
                            key={`${item.checked}`}
                            className=" px-1 w-full"
                            initial={{
                              opacity: 0,
                              filter: 'blur(4px)',
                            }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            transition={{
                              bounce: 0.2,
                              delay: item.checked ? 0.2 : 0,
                              type: 'spring',
                            }}
                          >
                            {editingId || item.isNew ? (
                              <div>
                                <div className="flex items-center justify-start gap-1">
                                  {item.isNew && (
                                    <Label className="text-xs min-w-20">New chapter</Label>
                                  )}
                                  {}
                                  <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                  />
                                </div>

                                <div className="flex justify-end gap-2 mt-2">
                                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                  <Button onClick={cancelEdit} variant="outline">
                                    Cancel
                                  </Button>
                                  <Button
                                    className="cursor-pointer"
                                    onClick={(e: any) => {
                                      e.preventDefault()
                                      if (onUpdateItem && !item.isNew && editingId) {
                                        onUpdateItem(editingId, inputValue)
                                        setEditingId(null)
                                      }
                                      if (onCreateItem && item.isNew) onCreateItem(item)
                                      setInputValue('')
                                    }}
                                    // disabled={!editingText.trim()}
                                  >
                                    {item.isNew && 'Create'}
                                    {editingId && 'Save'}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4
                                  className={cn(
                                    'tracking-tighter text-left md:text-lg flex items-center gap-2 ',
                                    item.checked ? 'text-red-400' : 'text-black',
                                  )}
                                >
                                  <span className="text-md">{order + 1}.</span>
                                  {item.checked ? 'Delete' : ` ${item.title}`}
                                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                  <div
                                    className="cursor-pointer"
                                    onClick={(e: any) => {
                                      e.preventDefault()
                                      setEditingId(item.id)
                                      setInputValue(item.title)
                                    }}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </div>
                                </h4>
                                <div className="text-gray-500 text-left">
                                  {item.lessons?.length} lessons
                                </div>
                              </>
                            )}
                          </motion.div>
                          {/* <div
                            onPointerDown={handleDragStart}
                            style={{ touchAction: 'none' }}
                            className="ml-auto"
                          >
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </div> */}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    {/* {renderExtra && renderExtra(item)} */}
                  </motion.div>
                </CollapsibleTrigger>
                {!item.isNew && !editingId && (
                  <Button
                    size="icon"
                    className="ml-2"
                    onClick={() => {
                      if (onEdit) onEdit(item)
                    }}
                  >
                    <Pen />
                  </Button>
                )}
              </div>

              <CollapsibleContent>
                <ul className="ml-16">
                  {item.lessons
                    ?.sort((a, b) => a.position - b.position)
                    .map((lesson, index) => (
                      <li className="py-2 hover:bg-accent cursor-pointer" key={lesson.id}>
                        <span>{`${order + 1}.${index + 1}. `}</span>
                        {lesson.title}
                      </li>
                    ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Reorder.Item>
        {/* ...existing code for delete animation... */}
      </div>
    </motion.div>
  )
}

SortableChapterListItem.displayName = 'SortableChapterListItem'

interface SortableListProps {
  items: ChapterItem[]
  setItems: Dispatch<SetStateAction<ChapterItem[]>>
  onReorder: (newItems: ChapterItem[]) => void
  onCompleteItem: (id: number) => void
  onUpdateItem: (id: number, text: string) => void
  onCreateItem: (item: ChapterItem) => void
  onCancelUpdateItem: (id: number, text: string) => void
  renderItem: (
    item: ChapterItem,
    order: number,
    onCompleteItem: (id: number) => void,
    onUpdateItem: (id: number, text: string) => void,
    onCreateItem: (item: ChapterItem) => void,
    onCancelUpdateItem: (id: number, text: string) => void,
    onRemoveItem: (id: number) => void,
  ) => ReactNode
}

function SortableChapterList({
  items,
  onReorder,
  onUpdateItem,
  onCreateItem,
  onCancelUpdateItem,
  setItems,
  onCompleteItem,
  renderItem,
}: SortableListProps) {
  const handleReorder = (newItems: ChapterItem[]) => {
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
              {items?.map((item, index) => {
                return renderItem(
                  item,
                  index,
                  onCompleteItem,
                  onUpdateItem,
                  onCreateItem,
                  onCancelUpdateItem,
                  (id: number) => setItems((items) => items.filter((item) => item.id !== id)),
                )
              })}
            </AnimatePresence>
          </Reorder.Group>
        </LayoutGroup>
      </>
    )
  }
  return null
}

SortableChapterList.displayName = 'SortableChapterList'

export { SortableChapterList, SortableChapterListItem }
