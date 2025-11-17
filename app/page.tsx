'use client'

import { useEffect, useState } from 'react'
import { SceneManager } from '@/components/SceneManager'
import { registerAllScenes } from '@/lib/registerScenes'
import Navigation from '@/components/Navigation'

export default function Home() {
  const [currentSceneId, setCurrentSceneId] = useState<string>('frisbee-disc-throw')
  const [isReady, setIsReady] = useState(false)

  // Register all scenes on mount
  useEffect(() => {
    registerAllScenes()
    setIsReady(true)
  }, [])

  // Wait for scenes to be registered
  if (!isReady) {
    return (
      <main className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Navigation */}
      <Navigation />

      {/* Background GIFs - Full Viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Desktop & Tablet Background */}
        <img
          src="/images/BG-DESK-001.gif"
          alt="Background"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* Mobile Background */}
        <img
          src="/images/BG-MOBILE-001.gif"
          alt="Background"
          className="block md:hidden w-full h-full object-cover"
        />
      </div>

      {/* Scene selector hidden - only one scene available */}

      {/* 3D Scene - full screen */}
      <div className="relative z-10 w-full h-full">
        <SceneManager
          initialSceneId={currentSceneId}
          onSceneChange={setCurrentSceneId}
          transition={{
            type: 'fade',
            duration: 500,
            easing: 'ease-in-out',
          }}
        />
      </div>
    </main>
  )
}
