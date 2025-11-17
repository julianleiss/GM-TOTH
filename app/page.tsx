'use client'

import { useEffect, useState } from 'react'
import { SceneManager, SceneSelector } from '@/components/SceneManager'
import { registerAllScenes } from '@/lib/registerScenes'

export default function Home() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [currentSceneId, setCurrentSceneId] = useState<string>('frisbee-disc-throw')

  // Register all scenes on mount
  useEffect(() => {
    registerAllScenes()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen flex flex-col">
        {/* Header - responsive */}
        <header className="w-full p-3 md:p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">GM</h1>
              <p className="text-xs md:text-sm opacity-90">Generative Micro-scenes</p>
            </div>
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm no-select"
            >
              <span className="hidden sm:inline">Browse Scenes</span>
              <span className="sm:hidden">Browse</span>
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

          {/* Quick scene switcher button - responsive */}
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-full p-3 md:p-4 shadow-xl transition-all hover:scale-110 active:scale-95 z-30 no-select"
            aria-label="Open scene selector"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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

        {/* Footer - responsive */}
        <footer className="w-full p-3 md:p-4 bg-gray-800 text-white text-center text-xs md:text-sm relative z-10">
          <p className="hidden sm:block">Interactive 3D experience powered by Three.js & Next.js</p>
          <p className="sm:hidden">3D experience • Three.js & Next.js</p>
          <p className="text-xs mt-1 opacity-70">
            <span className="hidden md:inline">Use mouse to rotate • Scroll to zoom • Click Browse to switch scenes</span>
            <span className="md:hidden">Drag to rotate • Pinch to zoom</span>
          </p>
        </footer>
      </div>
    </main>
  )
}
