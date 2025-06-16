'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit3, Check, X, Plus } from 'lucide-react'
import type { ControllerRenderProps } from 'react-hook-form'
import { cn } from '@/lib/utils'

export interface Task {
  id: string
  text: string
  isNew?: boolean
}

export default function TodoInput(field?: ControllerRenderProps & { error?: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const addNewTask = () => {
    const newObj: Task = {
      id: Date.now().toString(),
      text: '',
      isNew: true,
    }
    const newTasks = [...tasks, newObj]
    setTasks(newTasks)
    setEditingId(newObj.id)
    setEditingText('')
    if (field) field.onChange(newTasks)
  }

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((obj) => obj.id !== id)
    setTasks(newTasks)
    if (field) field.onChange(newTasks)
    if (editingId === id) {
      setEditingId(null)
      setEditingText('')
    }
  }

  const startEditing = (id: string, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = () => {
    if (editingText.trim() && editingId) {
      const newTask = tasks.map((obj) =>
        obj.id === editingId ? { ...obj, text: editingText.trim(), isNew: false } : obj,
      )
      setTasks(newTask)
      setEditingId(null)
      setEditingText('')
      if (field) field.onChange(newTask)
    }
  }

  const cancelEdit = () => {
    if (editingId) {
      // If it's a new objective that hasn't been saved, remove it
      const editingTask = tasks.find((obj) => obj.id === editingId)
      let newTasks = tasks
      if (editingTask?.isNew && !editingTask.text) {
        newTasks = tasks.filter((obj) => obj.id !== editingId)
        setTasks(newTasks)
        if (field) field.onChange(newTasks)
      }
    }
    setEditingId(null)
    setEditingText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }
  useEffect(() => {
    if (Array.isArray(field?.value)) {
      setTasks(field.value)
    }
  }, [field?.value])
  return (
    <Card className={cn('w-full max-w-2xl py-4', field?.error && 'border-red-500')}>
      <CardContent className="space-y-2">
        {/* Learning tasks list */}
        <div className="space-y-2">
          {tasks.map((objective, index) => {
            // Only show saved tasks in numbering
            const displayIndex =
              tasks.slice(0, index).filter((obj) => !obj.isNew || obj.text).length + 1

            return (
              <div
                key={objective.id}
                className="flex items-center gap-2 px-4 py-1 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {(!objective.isNew || objective.text) && (
                  <span className="text-sm text-muted-foreground font-medium min-w-[24px]">
                    {displayIndex}.
                  </span>
                )}

                {editingId === objective.id ? (
                  <>
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                      placeholder="Enter learning objective..."
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                      onClick={(e: any) => {
                        e.preventDefault()
                        saveEdit()
                      }}
                      disabled={!editingText.trim()}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{objective.text}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={(e: any) => {
                        e.preventDefault()
                        startEditing(objective.id, objective.text)
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={(e: any) => {
                        e.preventDefault()
                        deleteTask(objective.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Add button below the list */}
        <div className="">
          <Button
            onClick={addNewTask}
            variant="outline"
            className="w-full"
            disabled={editingId !== null}
          >
            <Plus className="h-4 w-4 mr-2" />
          </Button>
        </div>

        {/* Summary */}
      </CardContent>
    </Card>
  )
}
