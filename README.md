# GM - Generative Micro-scenes

An interactive 3D experience powered by Next.js 14, Three.js, and React Three Fiber.

## Features

- ⚡ **Next.js 14** with App Router
- 📘 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🎭 **Three.js** for 3D graphics
- 🔮 **React Three Fiber** for declarative 3D
- 🛠️ **React Three Drei** for useful helpers
- 📱 **Responsive Design** with mobile-first approach
- 🚀 **Optimized for Vercel** deployment

## Project Structure

```
GM-TOTH/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/            # Reusable React components
│   ├── Scene.tsx          # 3D Canvas wrapper
│   ├── Container.tsx      # Responsive container
│   └── ResponsiveGrid.tsx # Responsive grid layout
├── scenes/                # 3D scene components
│   └── RotatingCube.tsx   # Example 3D scene
├── lib/                   # Utility functions
│   └── utils.ts           # Helper utilities
└── public/                # Static assets
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

## Building 3D Scenes

Create new 3D scenes in the `scenes/` directory:

```tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function MyScene() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    // Animation logic here
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
```

Then use it in a page:

```tsx
import Scene from '@/components/Scene'
import MyScene from '@/scenes/MyScene'

export default function Page() {
  return (
    <Scene>
      <MyScene />
    </Scene>
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
