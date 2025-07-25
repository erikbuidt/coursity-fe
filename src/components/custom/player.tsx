'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import 'plyr/dist/plyr.css'

export default function Player({
  src,
  height,
  onEnded,
}: { src: string; onEnded?: () => void; height?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const plyrInstance = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])
  const cleanupPlyr = useCallback((instance: any) => {
    try {
      instance.pause()
      instance.volume = 0
      instance.muted = true
      instance.currentTime = 0
      instance.source = {
        type: 'video',
        sources: [],
      }
      instance.destroy()
    } catch (error) {
      console.error('Error cleaning up Plyr instance:', error)
    }
  }, [])
  useEffect(() => {
    if (!isClient || !src || !containerRef.current || typeof document === 'undefined') return

    // Dynamically import Plyr to avoid SSR issues
    const initializePlayer = async () => {
      try {
        const Plyr = (await import('plyr')).default

        // Clean up previous Plyr instance and audio before creating new one
        if (plyrInstance.current) {
          cleanupPlyr(plyrInstance.current)
          plyrInstance.current = null
        }

        // Clean up previous video container
        if (containerRef.current) {
          containerRef.current.innerHTML = ''

          // Create video element
          const video = document.createElement('video')
          video.setAttribute('playsinline', '')
          video.style.width = '100%'
          video.style.height = '100%'
          containerRef.current.appendChild(video)

          const plyr = new Plyr(video, {
            controls: [
              'play',
              'progress',
              'current-time',
              'mute',
              'volume',
              'fullscreen',
              'settings',
            ],
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
            plyrContainer.style.height = `${height}px`
          }

          plyr.on('ended', () => {
            onEnded?.()
          })
        }
      } catch (error) {
        console.error('Failed to load Plyr:', error)
      }
    }

    initializePlayer()

    return () => {
      // Stop video and clear audio before destroying
      if (plyrInstance.current) {
        console.log('destroy')
        console.log(plyrInstance.current)

        cleanupPlyr(plyrInstance.current)
        plyrInstance.current = null
      }
    }
  }, [src, onEnded, isClient, height, cleanupPlyr])

  // Show loading state during SSR or while client is initializing
  if (!isClient) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ height: height ? `${height}px` : '400px' }}
      >
        <span className="text-gray-500">Loading player...</span>
      </div>
    )
  }

  return <div ref={containerRef} />
}
