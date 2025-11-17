'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, OrbitControls } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'
import * as THREE from 'three'

function ParticleFieldComponent({ isActive }: SceneProps) {
  const pointsRef = useRef<any>(null)

  // Generate particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      const i3 = i * 3
      // Create a sphere distribution
      const radius = Math.random() * 8 + 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (pointsRef.current && isActive) {
      pointsRef.current.rotation.y += delta * 0.1
      pointsRef.current.rotation.x += delta * 0.05
    }
  })

  return (
    <>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

      <ambientLight intensity={0.2} />

      <Points
        ref={pointsRef}
        positions={particlePositions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Add some ambient glow */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#8b5cf6" distance={15} />
    </>
  )
}

// Scene definition
export const particleFieldScene: Scene = {
  metadata: {
    id: 'particle-field',
    name: '05',
    description: 'A mesmerizing field of glowing particles',
    tags: ['particles', '3d', 'abstract'],
  },
  component: ParticleFieldComponent,
  config: {
    camera: {
      position: [0, 0, 12],
      fov: 75,
    },
    lighting: 'minimal',
    performance: {
      shadows: false,
      antialias: true,
      maxPixelRatio: 2,
    },
  },
}

export default ParticleFieldComponent
