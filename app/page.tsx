'use client'

import { useEffect, useState } from 'react'
import { SceneManager } from '@/components/SceneManager'
import { registerAllScenes } from '@/lib/registerScenes'

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
    <main className="w-screen h-screen bg-black overflow-hidden">
      {/* Scene selector hidden - only one scene available */}

      {/* 3D Scene - full screen */}
      <div className="w-full h-full bg-black">
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
