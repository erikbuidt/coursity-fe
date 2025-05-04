'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils' // if you have a `cn` (className combiner), use it

export function StickyCardWrapper({ children }: { children: React.ReactNode }) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const sentinel = document.getElementById('card-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="col-span-4 relative">
      <div id="card-sentinel" className="h-1"></div>

      <div
        className={cn(
          "transition-all duration-300",
          isSticky ? "fixed top-10" : "absolute",
        )}
      >
        {children}
      </div>
    </div>
  )
}
