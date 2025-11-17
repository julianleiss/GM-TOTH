'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { sceneRegistry } from '@/lib/sceneRegistry'
import { SceneRegistryEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SceneSelectorProps {
  /** Currently active scene ID */
  currentSceneId: string
  /** Callback when a scene is selected */
  onSelectScene: (sceneId: string) => void
  /** Whether the selector is open */
  isOpen: boolean
  /** Callback to close the selector */
  onClose: () => void
  /** Position of the selector */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  /** Custom className */
  className?: string
}

export default function SceneSelector({
  currentSceneId,
  onSelectScene,
  isOpen,
  onClose,
  position = 'bottom-right',
  className = '',
}: SceneSelectorProps) {
  const [scenes, setScenes] = useState<SceneRegistryEntry[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const selectorRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load scenes from registry
  useEffect(() => {
    const loadScenes = () => {
      setScenes(sceneRegistry.getAll())
    }

    loadScenes()

    // Subscribe to registry changes
    const unsubscribe = sceneRegistry.subscribe(loadScenes)
    return unsubscribe
  }, [])

  // Find current scene index
  useEffect(() => {
    const index = scenes.findIndex((s) => s.metadata.id === currentSceneId)
    if (index !== -1) {
      setSelectedIndex(index)
    }
  }, [currentSceneId, scenes])

  // Filter scenes by search query
  const filteredScenes = scenes.filter((scene) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      scene.metadata.name.toLowerCase().includes(query) ||
      scene.metadata.description?.toLowerCase().includes(query) ||
      scene.metadata.tags?.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  // Handle scene selection
  const handleSelectScene = useCallback((sceneId: string) => {
    onSelectScene(sceneId)
    onClose()
  }, [onSelectScene, onClose])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredScenes.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredScenes[selectedIndex]) {
            handleSelectScene(filteredScenes[selectedIndex].metadata.id)
          }
          break
        case '/':
          e.preventDefault()
          searchInputRef.current?.focus()
          break
      }
    },
    [isOpen, onClose, filteredScenes, selectedIndex, handleSelectScene]
  )

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus()
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Selector Panel */}
      <div
        ref={selectorRef}
        className={cn(
          'fixed z-50',
          'bg-gray-900/95 backdrop-blur-md',
          'rounded-xl shadow-2xl',
          'border border-gray-700/50',
          'overflow-hidden',
          'w-[90vw] max-w-md',
          'max-h-[70vh]',
          'animate-in slide-in-from-bottom-4 duration-300',
          positionClasses[position],
          className
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Select Scene</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scenes... (press /)"
              className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Scene count */}
          <div className="mt-2 text-xs text-gray-400">
            {filteredScenes.length} {filteredScenes.length === 1 ? 'scene' : 'scenes'}
          </div>
        </div>

        {/* Scene list */}
        <div className="overflow-y-auto max-h-[calc(70vh-140px)] p-2">
          {filteredScenes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No scenes found</p>
              {searchQuery && (
                <p className="text-sm mt-2">Try a different search term</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredScenes.map((scene, index) => {
                const isActive = scene.metadata.id === currentSceneId
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={scene.metadata.id}
                    onClick={() => handleSelectScene(scene.metadata.id)}
                    className={cn(
                      'w-full text-left rounded-lg p-3 transition-all duration-200',
                      'hover:bg-indigo-600/30',
                      isActive &&
                        'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20',
                      !isActive && isSelected && 'bg-gray-800/50',
                      !isActive && !isSelected && 'text-gray-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {scene.metadata.name}
                          </span>
                          {isActive && (
                            <span className="shrink-0 text-xs bg-white/20 px-2 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        {scene.metadata.description && (
                          <p className="text-sm opacity-70 mt-1 line-clamp-2">
                            {scene.metadata.description}
                          </p>
                        )}
                        {scene.metadata.tags && scene.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {scene.metadata.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-700/50 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer with keyboard shortcuts */}
        <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 p-3">
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Enter</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Esc</kbd>
              <span>Close</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">/</kbd>
              <span>Search</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
