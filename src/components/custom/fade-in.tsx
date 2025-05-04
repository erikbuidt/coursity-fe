'use client'

import { useEffect, useRef, useState } from 'react'
// TailwindCSS only generates styles for class names it can see at build time
//`animate-${direction}` // ❌ Doesn't work dynamically in Tailwind
const animationMap = {
  'fade-up': 'animate-fade-up',
  'fade-down': 'animate-fade-down',
  'fade-left': 'animate-fade-left',
  'fade-right': 'animate-fade-right',
} as const
export default function FadeInStaggered({
  className = '',
  duration = 1000,
  delay = 100,
  children,
  direction = 'fade-up',
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode[] | React.ReactNode
  duration?: number
  delay?: number
  direction?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationClass = animationMap[direction]
  const [visibleItems, setVisibleItems] = useState<boolean[]>([])
  // Normalize children to always be an array
  const childrenArray = Array.isArray(children) ? children : [children]
  useEffect(() => {
    // Get the child elements of the container referenced by containerRef
    const items = containerRef.current?.children
    if (!items) return // Exit if there are no child elements

    // Create an IntersectionObserver to monitor visibility of child elements
    const observer = new IntersectionObserver(
      (entries) => {
        // Update the visibility state of child elements
        setVisibleItems((prev) => {
          const updates = [...prev] // Create a copy of the current visibility state
          let changed = false // Flag to track if any visibility state has changed

          // Iterate over each observed entry
          // biome-ignore lint/complexity/noForEach: <explanation>
          entries.forEach((entry) => {
            // Find the index of the observed element in the container's children
            const index = Array.from(items).indexOf(entry.target)
            // If the element is visible and its state hasn't been updated yet
            if (entry.isIntersecting && !updates[index]) {
              updates[index] = true // Mark the element as visible
              changed = true // Indicate that a change occurred
            }
          })

          // Return the updated state only if there was a change
          return changed ? updates : prev
        })
      },
      { threshold: 0.2 }, // Trigger the observer when 20% of the element is visible
    )

    // Start observing each child element
    // biome-ignore lint/complexity/noForEach: <explanation>
    Array.from(items).forEach((item) => observer.observe(item))

    // Cleanup function to unobserve all elements when the component unmounts
    return () => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      Array.from(items).forEach((item) => observer.unobserve(item))
    }
  }, []) // Empty dependency array ensures this effect runs only once

  return (
    <div ref={containerRef} className={className}>
      {childrenArray.map((child, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={i}
          style={{
            animationDelay: `${i * delay}ms`,
          }}
          className={`transition-opacity transform duration-700 ease-out ${
            visibleItems[i]
              ? `opacity-100 animate-once animate-duration-[${duration}ms] ${animationClass}`
              : 'opacity-0 '
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
