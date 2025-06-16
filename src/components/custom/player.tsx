'use client'
import { useEffect, useRef } from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export default function Player({ src, onEnded }: { src: string; onEnded?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const plyrInstance = useRef<Plyr | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!src || !containerRef.current) return

    // Create video element manually
    const video = document.createElement('video')
    video.className = 'w-[640px] h-[360px]'
    containerRef.current.innerHTML = '' // Clear previous video
    containerRef.current.appendChild(video)
    videoRef.current = video // Store reference for cleanup

    // Initialize Plyr
    plyrInstance.current = new Plyr(video, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen', 'settings'],
      autoplay: true,
    })

    // Set source
    plyrInstance.current.source = {
      type: 'video',
      sources: [{ src, type: 'video/mp4' }],
    }

    plyrInstance.current.on('ended', () => {
      if (onEnded) {
        onEnded()
      }
    })
    return () => {
      if (plyrInstance.current) {
        plyrInstance.current.destroy()
        plyrInstance.current = null
      }
    }
  }, [src])

  return <div ref={containerRef} />
}
