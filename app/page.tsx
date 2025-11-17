'use client'

import { useEffect, useState } from 'react'
import { SceneManager } from '@/components/SceneManager'
import { registerAllScenes } from '@/lib/registerScenes'
import { sceneRegistry } from '@/lib/sceneRegistry'

export default function Home() {
  const [currentSceneId, setCurrentSceneId] = useState<string>('frisbee-disc-throw')
  const [scenes, setScenes] = useState<Array<{ id: string; name: string }>>([])

  // Register all scenes on mount
  useEffect(() => {
    registerAllScenes()

    // Get all scenes for dropdown
    const allScenes = sceneRegistry.getAll().map(scene => ({
      id: scene.metadata.id,
      name: scene.metadata.name,
    }))
    setScenes(allScenes)
  }, [])

  return (
    <main className="w-screen h-screen bg-black overflow-hidden">
      {/* Minimal scene dropdown - top left */}
      <div className="absolute top-4 left-4 z-50">
        <select
          value={currentSceneId}
          onChange={(e) => setCurrentSceneId(e.target.value)}
          className="bg-black/50 text-white border border-white/20 rounded px-3 py-2 text-sm backdrop-blur-sm focus:outline-none focus:border-white/40 cursor-pointer"
        >
          {scenes.map((scene) => (
            <option key={scene.id} value={scene.id} className="bg-black">
              {scene.name}
            </option>
          ))}
        </select>
      </div>

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
