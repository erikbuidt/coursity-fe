'use client'
import { useEffect, useRef } from 'react'
import Artplayer from 'artplayer'

interface PlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  option: Artplayer['Option']
  getInstance?: (art: Artplayer) => void
}

export default function Player({ option, getInstance, ...rest }: PlayerProps) {
  const artRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!artRef.current) return
    const art = new Artplayer({
      ...option,
      container: artRef.current,
    })

    if (getInstance && typeof getInstance === 'function') {
      getInstance(art)
    }

    return () => {
      if (art?.destroy) {
        art.destroy(false)
      }
    }
  }, [option, getInstance])

  return <div ref={artRef} {...rest}></div>
}
