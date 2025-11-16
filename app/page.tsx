import Scene from '@/components/Scene'
import RotatingCube from '@/scenes/RotatingCube'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <header className="w-full p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h1 className="text-4xl font-bold">GM</h1>
          <p className="text-sm opacity-90">Generative Micro-scenes</p>
        </header>

        {/* 3D Scene Container */}
        <div className="flex-1 relative bg-gray-900">
          <Scene>
            <RotatingCube />
          </Scene>
        </div>

        {/* Footer */}
        <footer className="w-full p-4 bg-gray-800 text-white text-center text-sm">
          <p>Interactive 3D experience powered by Three.js & Next.js</p>
        </footer>
      </div>
    </main>
  )
}
