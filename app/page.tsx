'use client'

import { useEffect, useState } from 'react'
import { SceneManager, SceneSelector } from '@/components/SceneManager'
import { registerAllScenes } from '@/lib/registerScenes'

export default function Home() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [currentSceneId, setCurrentSceneId] = useState<string>('rotating-cube')

  // Register all scenes on mount
  useEffect(() => {
    registerAllScenes()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <header className="w-full p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">GM</h1>
              <p className="text-sm opacity-90">Generative Micro-scenes</p>
            </div>
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              Browse Scenes
            </button>
          </div>
        </header>

        {/* 3D Scene Container */}
        <div className="flex-1 relative bg-gray-900">
          <SceneManager
            initialSceneId={currentSceneId}
            showSelector={false}
            onSceneChange={setCurrentSceneId}
            transition={{
              type: 'fade',
              duration: 500,
              easing: 'ease-in-out',
            }}
          />

          {/* Scene Selector Overlay */}
          <SceneSelector
            currentSceneId={currentSceneId}
            onSelectScene={(sceneId) => {
              setCurrentSceneId(sceneId)
            }}
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            position="center"
          />

          {/* Quick scene switcher button */}
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-xl transition-all hover:scale-110 z-30"
            aria-label="Open scene selector"
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
        </div>

        {/* Footer */}
        <footer className="w-full p-4 bg-gray-800 text-white text-center text-sm relative z-10">
          <p>Interactive 3D experience powered by Three.js & Next.js</p>
          <p className="text-xs mt-1 opacity-70">
            Use mouse to rotate • Scroll to zoom • Click Browse to switch scenes
          </p>
        </footer>
      </div>
    </main>
  )
}
