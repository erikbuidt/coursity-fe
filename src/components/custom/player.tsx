'use client'
import { useEffect, useRef } from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export default function Player({
  src,
  height,
  onEnded,
}: { src: string; onEnded?: () => void; height?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const plyrInstance = useRef<Plyr | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!src || !containerRef.current) return

    // Clean up previous video
    containerRef.current.innerHTML = ''

    // Create video element
    const video = document.createElement('video')
    video.setAttribute('playsinline', '')
    video.style.width = '100%' // full width
    video.style.height = '100%' // full height
    containerRef.current.appendChild(video)

    const plyr = new Plyr(video, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen', 'settings'],
      autoplay: true,
    })
    plyrInstance.current = plyr

    plyr.source = {
      type: 'video',
      sources: [{ src, type: 'video/mp4' }],
    }

    // After Plyr initialized, set height on container div
    const plyrContainer = containerRef.current.querySelector('.plyr') as HTMLElement
    if (plyrContainer && height) {
      plyrContainer.style.height = `${height}px` // <-- adjust height here or via prop!
      // Optionally also set width if needed
      // plyrContainer.style.width = '640px'
    }

    plyr.on('ended', () => {
      onEnded?.()
    })

    return () => {
      // Stop video and clear audio before destroying
      if (plyr) {
        plyr.pause()
        plyr.currentTime = 0
        plyr.volume = 0
        plyr.destroy()
      }
      plyrInstance.current = null
    }
  }, [src, onEnded])

  return <div ref={containerRef} />
}
