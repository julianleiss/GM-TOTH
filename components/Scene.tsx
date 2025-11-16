'use client'

import { Canvas } from '@react-three/fiber'
import { ReactNode } from 'react'

interface SceneProps {
  children: ReactNode
  className?: string
}

export default function Scene({ children, className = '' }: SceneProps) {
  return (
    <div className={`canvas-container ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="w-full h-full"
      >
        {children}
      </Canvas>
    </div>
  )
}
