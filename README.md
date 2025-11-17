# GM - Generative Micro-scenes

An interactive 3D experience powered by Next.js 14, Three.js, and React Three Fiber.

## Features

- ⚡ **Next.js 14** with App Router
- 📘 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🎭 **Three.js** for 3D graphics
- 🔮 **React Three Fiber** for declarative 3D
- 🛠️ **React Three Drei** for useful helpers
- 🎬 **Scene Management System** with transitions and keyboard navigation
- 📱 **Responsive Design** with mobile-first approach
- 🚀 **Optimized for Vercel** deployment

## Project Structure

```
GM-TOTH/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles with Tailwind
├── components/                   # Reusable React components
│   ├── SceneManager/            # Scene management system
│   │   ├── SceneManager.tsx    # Main scene manager component
│   │   ├── SceneSelector.tsx   # Scene selector UI
│   │   ├── useSceneManager.ts  # Scene manager hook
│   │   └── index.ts            # Exports
│   ├── Scene.tsx                # 3D Canvas wrapper (legacy)
│   ├── Container.tsx            # Responsive container
│   └── ResponsiveGrid.tsx       # Responsive grid layout
├── scenes/                       # 3D scene definitions
│   ├── RotatingCube.tsx         # Rotating cube scene
│   ├── FloatingSpheres.tsx      # Floating spheres scene
│   ├── WireframeKnot.tsx        # Wireframe torus knot scene
│   ├── ParticleField.tsx        # Particle field scene
│   └── index.ts                 # Scene exports
├── lib/                          # Utilities and core systems
│   ├── types/                   # TypeScript type definitions
│   │   ├── scene.ts            # Scene interfaces
│   │   └── index.ts            # Type exports
│   ├── sceneRegistry.ts         # Scene registry singleton
│   ├── registerScenes.ts        # Scene registration helper
│   └── utils.ts                 # Helper utilities
└── public/                       # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Scene Management System

The project includes a powerful scene management system that handles scene registration, transitions, and user interaction.

### Creating a New Scene

1. **Create the scene component** in `scenes/`:

```tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'

// Scene component
function MySceneComponent({ isActive }: SceneProps) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (isActive) {
      // Animation logic here
      meshRef.current.rotation.x += delta
    }
  })

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <mesh ref={meshRef}>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}

// Scene definition
export const myScene: Scene = {
  metadata: {
    id: 'my-scene',
    name: 'My Scene',
    description: 'A custom 3D scene',
    tags: ['3d', 'interactive'],
  },
  component: MySceneComponent,
  config: {
    camera: {
      position: [0, 0, 5],
      fov: 75,
    },
    lighting: 'default',
  },
}

export default MySceneComponent
```

2. **Register the scene** in `lib/registerScenes.ts`:

```tsx
import { myScene } from '@/scenes/MyScene'

export function registerAllScenes() {
  sceneRegistry.registerMany([
    rotatingCubeScene,
    floatingSpheresScene,
    wireframeKnotScene,
    particleFieldScene,
    myScene, // Add your scene here
  ])
}
```

3. **Export from scenes/index.ts**:

```tsx
export { myScene } from './MyScene'
export { default as MyScene } from './MyScene'
```

### Scene Selector Features

- **Keyboard Navigation**: Use arrow keys to navigate, Enter to select, Esc to close
- **Search**: Press `/` to search scenes by name, description, or tags
- **Smooth Transitions**: Configurable fade transitions between scenes
- **Mobile-Friendly**: Touch-optimized responsive design

### Using the Scene Manager Hook

```tsx
import { useSceneManager } from '@/components/SceneManager'

function MyComponent() {
  const {
    scenes,
    currentScene,
    switchScene,
    nextScene,
    previousScene,
  } = useSceneManager()

  return (
    <div>
      <button onClick={nextScene}>Next Scene</button>
      <p>Current: {currentScene?.metadata.name}</p>
    </div>
  )
}
```

## Deployment

### Deploy to Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Three.js](https://threejs.org/) - 3D library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for R3F

## License

MIT
