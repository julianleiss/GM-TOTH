'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { OrbitControls } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'

function WireframeKnotComponent({ isActive }: SceneProps) {
  const knotRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (knotRef.current && isActive) {
      knotRef.current.rotation.x += delta * 0.3
      knotRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ec4899" />

      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
        <meshStandardMaterial
          color="#10b981"
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Solid version behind */}
      <mesh ref={knotRef} scale={0.98}>
        <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
        <meshStandardMaterial
          color="#064e3b"
          opacity={0.3}
          transparent={true}
        />
      </mesh>
    </>
  )
}

// Scene definition
export const wireframeKnotScene: Scene = {
  metadata: {
    id: 'wireframe-knot',
    name: '04',
    description: 'An elegant wireframe torus knot',
    tags: ['wireframe', '3d', 'geometric'],
  },
  component: WireframeKnotComponent,
  config: {
    camera: {
      position: [0, 0, 6],
      fov: 75,
    },
    lighting: 'dramatic',
    performance: {
      shadows: false,
      antialias: true,
    },
  },
}

export default WireframeKnotComponent
