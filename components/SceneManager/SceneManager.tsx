'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { sceneRegistry } from '@/lib/sceneRegistry'
import { SceneTransition } from '@/lib/types'
import { useViewport, useTouchOptimized, getResponsiveFOV, getResponsiveCameraPosition } from '@/lib/hooks'
import { LoadingOverlay } from '@/components/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'

interface SceneManagerProps {
  /** Initial scene ID to load */
  initialSceneId?: string
  /** Scene transition configuration */
  transition?: SceneTransition
  /** Canvas class name */
  className?: string
  /** Callback when scene changes */
  onSceneChange?: (sceneId: string) => void
}

export default function SceneManager({
  initialSceneId,
  className = '',
}: SceneManagerProps) {
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Responsive viewport
  const viewport = useViewport()

  // Touch optimization
  useTouchOptimized()

  // Initialize with first scene or specified initial scene
  useEffect(() => {
    const scenes = sceneRegistry.getAll()
    if (scenes.length === 0) {
      setIsLoading(false)
      return
    }

    const initialScene = initialSceneId
      ? sceneRegistry.get(initialSceneId)
      : scenes[0]

    if (initialScene) {
      setCurrentSceneId(initialScene.metadata.id)
      setIsLoading(false)
    }
  }, [initialSceneId])

  // Handle scene initialization and cleanup
  useEffect(() => {
    if (!currentSceneId) return

    const scene = sceneRegistry.get(currentSceneId)
    if (!scene) return

    // Run initialization
    const runInit = async () => {
      try {
        if (scene.init) {
          await scene.init()
        }
        sceneRegistry.markAsLoaded(currentSceneId)
      } catch (error) {
        console.error(`Error initializing scene ${currentSceneId}:`, error)
        sceneRegistry.markAsError(currentSceneId, error as Error)
      }
    }

    runInit()

    // Store cleanup function
    cleanupRef.current = scene.cleanup || null

    // Cleanup on unmount or scene change
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [currentSceneId])

  // Get current scene
  const currentScene = currentSceneId
    ? sceneRegistry.get(currentSceneId)
    : null

  if (!currentScene) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p>No scenes available. Please register scenes first.</p>
      </div>
    )
  }

  const SceneComponent = currentScene.component
  const config = currentScene.config || {}

  // Get responsive camera settings
  const responsiveFOV = config.camera?.fov || getResponsiveFOV(viewport)
  const responsiveCameraPosition = getResponsiveCameraPosition(
    viewport,
    config.camera?.position || [0, 0, 5]
  )

  // Calculate responsive pixel ratio
  const pixelRatio = config.performance?.maxPixelRatio
    ? Math.min(window.devicePixelRatio, config.performance.maxPixelRatio)
    : viewport.isMobile
    ? Math.min(window.devicePixelRatio, 2)
    : window.devicePixelRatio

  return (
    <div ref={canvasRef} className={`relative w-full h-full ${className}`}>
      {/* Loading overlay */}
      {isLoading && <LoadingOverlay message="Loading scene..." />}

      <div className="w-full h-full">
        <ErrorBoundary>
          <Canvas
            camera={{
              position: responsiveCameraPosition,
              fov: responsiveFOV,
              near: config.camera?.near || 0.1,
              far: config.camera?.far || 1000,
            }}
            shadows={config.performance?.shadows}
            dpr={pixelRatio}
            gl={{
              alpha: true,
              antialias: config.performance?.antialias ?? true,
              powerPreference: viewport.isMobile ? 'low-power' : 'high-performance',
            }}
            className="w-full h-full"
            style={{ touchAction: 'none', background: 'transparent' }}
          >
            <SceneComponent
              isActive={true}
              onReady={() => sceneRegistry.markAsLoaded(currentScene.metadata.id)}
              onError={(error) => sceneRegistry.markAsError(currentScene.metadata.id, error)}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

    </div>
  )
}
