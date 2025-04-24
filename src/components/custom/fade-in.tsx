'use client'

import { useEffect, useRef, useState } from 'react'

export default function FadeInStaggered({
  children,
}: {
  children: React.ReactNode[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<boolean[]>([])

  useEffect(() => {
    const items = containerRef.current?.children
    if (!items) return
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleItems((prev) => {
          const updates = [...prev]
          let changed = false
          console.log({ entries })
          // biome-ignore lint/complexity/noForEach: <explanation>
          entries.forEach((entry) => {
            const index = Array.from(items).indexOf(entry.target)
            if (entry.isIntersecting && !updates[index]) {
              updates[index] = true
              changed = true
            }
          })

          return changed ? updates : prev
        })
      },
      { threshold: 0.2 },
    )

    // biome-ignore lint/complexity/noForEach: <explanation>
    Array.from(items).forEach((item) => observer.observe(item))

    return () => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      Array.from(items).forEach((item) => observer.unobserve(item))
    }
  }, []) // <- empty dependency array: runs only once

  return (
    <div ref={containerRef} className="grid grid-cols-4 gap-4 mt-8">
      {children.map((child, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={i}
          className={`transition-opacity transform duration-700 ease-out ${
            visibleItems[i]
              ? `opacity-100 translate-y-0 delay-[${i * 100}ms] animate-fadeInUp`
              : 'opacity-0 translate-y-4'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
