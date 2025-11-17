'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { OrbitControls, Sphere } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'
import { randomInRange, randomColor } from '@/lib/utils'

function FloatingSpheresComponent({ isActive }: SceneProps) {
  const groupRef = useRef<any>(null)

  useFrame((state, delta) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  // Generate sphere positions
  const spheres = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const radius = 3
    return {
      id: i,
      position: [
        Math.cos(angle) * radius,
        Math.sin(i * 0.5) * 2,
        Math.sin(angle) * radius,
      ] as [number, number, number],
      scale: randomInRange(0.3, 0.6),
      color: randomColor(),
    }
  })

  return (
    <>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />

      <group ref={groupRef}>
        {spheres.map((sphere) => (
          <Sphere
            key={sphere.id}
            args={[sphere.scale, 32, 32]}
            position={sphere.position}
          >
            <meshStandardMaterial
              color={sphere.color}
              metalness={0.6}
              roughness={0.2}
            />
          </Sphere>
        ))}
      </group>

      <gridHelper args={[20, 20]} />
    </>
  )
}

// Scene definition
export const floatingSpheresScene: Scene = {
  metadata: {
    id: 'floating-spheres',
    name: 'Floating Spheres',
    description: 'Colorful spheres arranged in a circular pattern',
    tags: ['3d', 'colorful', 'interactive'],
  },
  component: FloatingSpheresComponent,
  config: {
    camera: {
      position: [0, 3, 8],
      fov: 75,
    },
    lighting: 'studio',
    performance: {
      shadows: false,
      antialias: true,
    },
  },
}

export default FloatingSpheresComponent
