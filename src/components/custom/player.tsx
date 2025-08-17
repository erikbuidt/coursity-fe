'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import 'plyr/dist/plyr.css'
import type Plyr from 'plyr'

export default function Player({
  src,
  height,
  onEnded,
}: { src: string; onEnded?: () => void; height?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const plyrInstance = useRef<Plyr | null>(null)

  const cleanupPlyr = useCallback((instance: Plyr) => {
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
    if (!src || !containerRef.current || typeof document === 'undefined') return

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
        cleanupPlyr(plyrInstance.current)
        plyrInstance.current = null
      }
    }
  }, [src, onEnded, height, cleanupPlyr])

  return <div ref={containerRef} />
}
