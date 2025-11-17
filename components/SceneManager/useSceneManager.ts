'use client'

import { useState, useEffect, useCallback } from 'react'
import { sceneRegistry } from '@/lib/sceneRegistry'
import { SceneRegistryEntry } from '@/lib/types'

/**
 * Hook for managing scenes
 * Provides scene list, current scene, and switching functionality
 */
export function useSceneManager(initialSceneId?: string) {
  const [scenes, setScenes] = useState<SceneRegistryEntry[]>([])
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load scenes from registry
  useEffect(() => {
    const loadScenes = () => {
      const allScenes = sceneRegistry.getAll()
      setScenes(allScenes)

      // Set initial scene if not already set
      if (!currentSceneId && allScenes.length > 0) {
        const initialScene = initialSceneId
          ? sceneRegistry.get(initialSceneId)
          : allScenes[0]

        if (initialScene) {
          setCurrentSceneId(initialScene.metadata.id)
        }
      }
    }

    loadScenes()

    // Subscribe to registry changes
    const unsubscribe = sceneRegistry.subscribe(loadScenes)
    return unsubscribe
  }, [initialSceneId, currentSceneId])

  // Get current scene
  const currentScene = currentSceneId
    ? sceneRegistry.get(currentSceneId)
    : null

  // Switch to a different scene
  const switchScene = useCallback(async (sceneId: string) => {
    if (sceneId === currentSceneId || isLoading) return

    const scene = sceneRegistry.get(sceneId)
    if (!scene) {
      console.warn(`Scene "${sceneId}" not found`)
      return
    }

    setIsLoading(true)

    try {
      // Run initialization if needed
      if (scene.init) {
        await scene.init()
      }

      setCurrentSceneId(sceneId)
      sceneRegistry.markAsLoaded(sceneId)
    } catch (error) {
      console.error(`Error switching to scene "${sceneId}":`, error)
      sceneRegistry.markAsError(sceneId, error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [currentSceneId, isLoading])

  // Navigate to next scene
  const nextScene = useCallback(() => {
    if (scenes.length <= 1 || !currentSceneId) return

    const currentIndex = scenes.findIndex(s => s.metadata.id === currentSceneId)
    const nextIndex = (currentIndex + 1) % scenes.length
    switchScene(scenes[nextIndex].metadata.id)
  }, [scenes, currentSceneId, switchScene])

  // Navigate to previous scene
  const previousScene = useCallback(() => {
    if (scenes.length <= 1 || !currentSceneId) return

    const currentIndex = scenes.findIndex(s => s.metadata.id === currentSceneId)
    const prevIndex = (currentIndex - 1 + scenes.length) % scenes.length
    switchScene(scenes[prevIndex].metadata.id)
  }, [scenes, currentSceneId, switchScene])

  return {
    scenes,
    currentScene,
    currentSceneId,
    isLoading,
    switchScene,
    nextScene,
    previousScene,
  }
}
