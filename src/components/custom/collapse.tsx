'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapseProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  element?: React.ReactNode
}

export default function Collapse({
  title,
  children,
  className = '',
  element,
  defaultOpen = true,
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState<string | number>('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setHeight('0px')
    }
  }, [isOpen])

  return (
    <div className={cn('w-full border bg-white shadow-sm', className)}>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDown
          className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
      {element && element}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500"
        style={{ height }}
      >
        <div className="border-t">{children}</div>
      </div>
    </div>
  )
}
