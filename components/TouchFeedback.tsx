'use client'

import { useState, useRef } from 'react'

interface TouchFeedbackProps {
  children: React.ReactNode
  onTap?: () => void
  disabled?: boolean
}

/**
 * Component that provides visual feedback on touch/click
 */
export default function TouchFeedback({
  children,
  onTap,
  disabled = false,
}: TouchFeedbackProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  const createRipple = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    let x: number, y: number

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    const ripple = { x, y, id: nextId.current++ }
    setRipples((prev) => [...prev, ripple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
    }, 600)

    onTap?.()
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-pointer"
      onMouseDown={createRipple}
      onTouchStart={createRipple}
      style={{ touchAction: 'none' }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}
