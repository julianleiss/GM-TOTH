'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { sceneRegistry } from '@/lib/sceneRegistry'
import { SceneTransition } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SceneManagerProps {
  /** Initial scene ID to load */
  initialSceneId?: string
  /** Scene transition configuration */
  transition?: SceneTransition
  /** Canvas class name */
  className?: string
  /** Show scene selector UI */
  showSelector?: boolean
  /** Callback when scene changes */
  onSceneChange?: (sceneId: string) => void
}

export default function SceneManager({
  initialSceneId,
  transition = { type: 'fade', duration: 300, easing: 'ease-in-out' },
  className = '',
  showSelector = true,
  onSceneChange,
}: SceneManagerProps) {
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Initialize with first scene or specified initial scene
  useEffect(() => {
    const scenes = sceneRegistry.getAll()
    if (scenes.length === 0) return

    const initialScene = initialSceneId
      ? sceneRegistry.get(initialSceneId)
      : scenes[0]

    if (initialScene) {
      setCurrentSceneId(initialScene.metadata.id)
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

  // Handle scene switching with transitions
  const switchScene = useCallback(
    async (sceneId: string) => {
      if (sceneId === currentSceneId || isTransitioning) return

      const scene = sceneRegistry.get(sceneId)
      if (!scene) {
        console.warn(`Scene "${sceneId}" not found in registry`)
        return
      }

      setIsTransitioning(true)

      // Transition out
      if (transition.type === 'fade') {
        setOpacity(0)
        await new Promise(resolve =>
          setTimeout(resolve, transition.duration || 300)
        )
      }

      // Run cleanup of old scene
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }

      // Switch scene
      setCurrentSceneId(sceneId)
      onSceneChange?.(sceneId)

      // Transition in
      if (transition.type === 'fade') {
        setOpacity(1)
        await new Promise(resolve =>
          setTimeout(resolve, transition.duration || 300)
        )
      }

      setIsTransitioning(false)
    },
    [currentSceneId, isTransitioning, transition, onSceneChange]
  )

  // Get current scene
  const currentScene = currentSceneId
    ? sceneRegistry.get(currentSceneId)
    : null

  if (!currentScene) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <p>No scenes available. Please register scenes first.</p>
      </div>
    )
  }

  const SceneComponent = currentScene.component
  const config = currentScene.config || {}

  return (
    <div ref={canvasRef} className={cn('relative w-full h-full', className)}>
      <div
        className="w-full h-full transition-opacity"
        style={{
          opacity,
          transitionDuration: `${transition.duration || 300}ms`,
          transitionTimingFunction: transition.easing || 'ease-in-out',
        }}
      >
        <Canvas
          camera={{
            position: config.camera?.position || [0, 0, 5],
            fov: config.camera?.fov || 75,
            near: config.camera?.near || 0.1,
            far: config.camera?.far || 1000,
          }}
          shadows={config.performance?.shadows}
          dpr={
            config.performance?.maxPixelRatio
              ? Math.min(window.devicePixelRatio, config.performance.maxPixelRatio)
              : undefined
          }
          gl={{
            antialias: config.performance?.antialias ?? true,
          }}
          className="w-full h-full"
        >
          <SceneComponent
            isActive={!isTransitioning}
            onReady={() => sceneRegistry.markAsLoaded(currentScene.metadata.id)}
            onError={(error) => sceneRegistry.markAsError(currentScene.metadata.id, error)}
          />
        </Canvas>
      </div>

      {/* Scene info overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <h2 className="text-lg font-semibold">{currentScene.metadata.name}</h2>
          {currentScene.metadata.description && (
            <p className="text-sm opacity-80">{currentScene.metadata.description}</p>
          )}
        </div>
      </div>

      {/* Export scene switcher for parent components */}
      {showSelector && (
        <div className="absolute bottom-4 right-4">
          <SceneSwitcherButton onSwitch={switchScene} currentSceneId={currentScene.metadata.id} />
        </div>
      )}
    </div>
  )
}

// Internal scene switcher button component
function SceneSwitcherButton({
  onSwitch,
  currentSceneId,
}: {
  onSwitch: (sceneId: string) => void
  currentSceneId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const scenes = sceneRegistry.getAll()

  if (scenes.length <= 1) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-colors"
        aria-label="Switch scene"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden min-w-[200px]">
          {scenes.map((scene) => (
            <button
              key={scene.metadata.id}
              onClick={() => {
                onSwitch(scene.metadata.id)
                setIsOpen(false)
              }}
              className={cn(
                'w-full text-left px-4 py-3 hover:bg-indigo-600/50 transition-colors',
                currentSceneId === scene.metadata.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-200'
              )}
            >
              <div className="font-medium">{scene.metadata.name}</div>
              {scene.metadata.description && (
                <div className="text-xs opacity-70 mt-1">
                  {scene.metadata.description}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
