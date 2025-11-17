'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { OrbitControls } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'

function RotatingCubeComponent({ isActive }: SceneProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      <gridHelper args={[10, 10]} />
    </>
  )
}

// Scene definition
export const rotatingCubeScene: Scene = {
  metadata: {
    id: 'rotating-cube',
    name: 'Rotating Cube',
    description: 'A simple rotating cube with orbit controls',
    tags: ['basic', '3d', 'interactive'],
  },
  component: RotatingCubeComponent,
  config: {
    camera: {
      position: [0, 0, 5],
      fov: 75,
    },
    lighting: 'default',
    performance: {
      shadows: false,
      antialias: true,
    },
  },
}

// Default export for backward compatibility
export default RotatingCubeComponent
