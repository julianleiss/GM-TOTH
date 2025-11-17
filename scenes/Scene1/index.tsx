'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { OrbitControls } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'
import { Fire } from '@wolffo/three-fire/react'

interface DiscState {
  position: Vector3
  velocity: Vector3
  rotation: Vector3
  rotationVelocity: Vector3
  opacity: number
  active: boolean
}

function FrisbeeDiscThrowComponent({ isActive }: SceneProps) {
  const { camera, size } = useThree()
  const [discs, setDiscs] = useState<DiscState[]>([
    {
      position: new Vector3(0, 0, 0),
      velocity: new Vector3(0, 0, 0),
      rotation: new Vector3(0, 0, 0),
      rotationVelocity: new Vector3(0, 0, 0),
      opacity: 1,
      active: false,
    },
  ])


  // Animate discs physics
  useFrame((state, delta) => {
    if (!isActive) return

    // Update discs physics
    setDiscs((prevDiscs) =>
      prevDiscs.map((disc) => {
        if (!disc.active) return disc

        // Update position with velocity
        const newPosition = disc.position.clone().add(
          disc.velocity.clone().multiplyScalar(delta)
        )

        // Update rotation with spin
        const newRotation = disc.rotation.clone().add(
          disc.rotationVelocity.clone().multiplyScalar(delta)
        )

        // Apply gravity
        const newVelocity = disc.velocity.clone()
        newVelocity.y -= 3 * delta // gravity

        // Fade out based on distance
        const distance = newPosition.length()
        const fadeStartDistance = 15
        const fadeEndDistance = 25
        let newOpacity = disc.opacity

        if (distance > fadeStartDistance) {
          const fadeProgress = (distance - fadeStartDistance) / (fadeEndDistance - fadeStartDistance)
          newOpacity = Math.max(0, 1 - fadeProgress)
        }

        // Deactivate if too far or fully faded
        const stillActive = distance < fadeEndDistance && newOpacity > 0

        return {
          position: newPosition,
          velocity: newVelocity,
          rotation: newRotation,
          rotationVelocity: disc.rotationVelocity,
          opacity: newOpacity,
          active: stillActive,
        }
      })
    )

    // Remove inactive discs and respawn if needed
    setDiscs((prevDiscs) => {
      const activeDiscs = prevDiscs.filter((disc) => disc.active)
      const hasInactiveCenter = !prevDiscs.some(
        (disc) => !disc.active && disc.position.length() < 0.1
      )

      if (activeDiscs.length === 0 || (prevDiscs.some((disc) => !disc.active) && hasInactiveCenter)) {
        return [
          ...activeDiscs,
          {
            position: new Vector3(0, 0, 0),
            velocity: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            rotationVelocity: new Vector3(0, 0, 0),
            opacity: 1,
            active: false,
          },
        ]
      }

      return prevDiscs
    })
  })

  // Handle disc click/tap
  const handleDiscClick = (discIndex: number) => {
    const disc = discs[discIndex]
    if (disc.active) return // Already thrown

    // Calculate throw direction
    const throwDirection = new Vector3(0, 0, -1)
    throwDirection.applyQuaternion(camera.quaternion)

    // Add some upward angle
    throwDirection.y += 0.2
    throwDirection.normalize()

    // Set velocity (speed: 12 units/sec)
    const throwSpeed = 12
    const velocity = throwDirection.multiplyScalar(throwSpeed)

    // Set rotation velocity (spin)
    const rotationVelocity = new Vector3(
      Math.random() * 4 - 2, // random spin on x
      8, // strong spin on y axis
      Math.random() * 4 - 2  // random spin on z
    )

    setDiscs((prevDiscs) =>
      prevDiscs.map((d, i) =>
        i === discIndex
          ? {
              ...d,
              velocity,
              rotationVelocity,
              active: true,
            }
          : d
      )
    )
  }

  return (
    <>
      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        maxDistance={20}
        minDistance={3}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 6}
      />

      {/* Black ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.05} />
      <directionalLight position={[5, 8, 5]} intensity={0.1} />

      {/* Fire glow lights - positioned at fire location */}
      <pointLight position={[0, 0, -8]} intensity={8} color="#ff3300" distance={25} decay={2} />
      <pointLight position={[0, 2, -8]} intensity={6} color="#ff6600" distance={22} decay={2} />
      <pointLight position={[0, -1, -8]} intensity={5} color="#cc1100" distance={18} decay={2} />
      <pointLight position={[0, 4, -8]} intensity={4} color="#ffaa00" distance={20} decay={2} />
      <pointLight position={[0, 1, -8]} intensity={3} color="#ff8800" distance={18} decay={2} />

      {/* Fire in the distance - multiple small flames */}
      {/* Core flames layer 1 - deep red */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={3.5}
        color="#cc1100"
        magnitude={1.9}
        lacunarity={1.4}
        gain={0.5}
      />

      {/* Core flames layer 2 - red */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={3.5}
        color="#ff2200"
        magnitude={1.8}
        lacunarity={1.3}
        gain={0.52}
      />

      {/* Mid flames layer 1 - orange-red */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={3.6}
        color="#ff4400"
        magnitude={1.7}
        lacunarity={1.3}
        gain={0.54}
      />

      {/* Mid flames layer 2 - orange */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={3.7}
        color="#ff6600"
        magnitude={1.6}
        lacunarity={1.2}
        gain={0.56}
      />

      {/* Outer flames layer 1 - bright orange */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={3.8}
        color="#ff8800"
        magnitude={1.5}
        lacunarity={1.2}
        gain={0.58}
      />

      {/* Outer flames layer 2 - yellow-orange */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={3.9}
        color="#ffaa00"
        magnitude={1.4}
        lacunarity={1.1}
        gain={0.6}
      />

      {/* Yellow tips */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={4}
        color="#ffcc00"
        magnitude={1.3}
        lacunarity={1.1}
        gain={0.62}
      />

      {/* Smoke layers - dark gray */}
      <Fire
        texture="/images/fire.png"
        position={[0, 0.5, -8]}
        scale={3.5}
        color="#222222"
        magnitude={0.8}
        lacunarity={0.9}
        gain={0.35}
      />

      <Fire
        texture="/images/fire.png"
        position={[0, 1.5, -8]}
        scale={4}
        color="#333333"
        magnitude={0.7}
        lacunarity={0.8}
        gain={0.3}
      />

      <Fire
        texture="/images/fire.png"
        position={[0, 2.5, -8]}
        scale={4.5}
        color="#444444"
        magnitude={0.6}
        lacunarity={0.7}
        gain={0.25}
      />

      {/* Light smoke - rising high */}
      <Fire
        texture="/images/fire.png"
        position={[0, 3.5, -8]}
        scale={5}
        color="#555555"
        magnitude={0.5}
        lacunarity={0.6}
        gain={0.2}
      />

      {/* Frisbee discs */}
      {discs.map((disc, index) => (
        <Disc
          key={`disc-${index}`}
          position={disc.position}
          rotation={disc.rotation}
          opacity={disc.opacity}
          onClick={() => handleDiscClick(index)}
          isThrown={disc.active}
          camera={camera}
        />
      ))}
    </>
  )
}

// Disc component
function Disc({
  position,
  rotation,
  opacity,
  onClick,
  isThrown,
  camera,
}: {
  position: Vector3
  rotation: Vector3
  opacity: number
  onClick: () => void
  isThrown: boolean
  camera: any
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current && !isThrown) {
      // Make disc face camera when not thrown
      meshRef.current.lookAt(camera.position)
    } else if (meshRef.current && isThrown) {
      // Apply rotation when thrown
      meshRef.current.rotation.x = rotation.x
      meshRef.current.rotation.y = rotation.y
      meshRef.current.rotation.z = rotation.z
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
      }}
    >
      {/* Disc shape - cylinder with small height */}
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <meshStandardMaterial
        color="#ff3333"
        roughness={0.3}
        metalness={0.6}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

// Scene definition
export const frisbeeDiscThrowScene: Scene = {
  metadata: {
    id: 'frisbee-disc-throw',
    name: '01',
    description: 'Throw the red disc toward the distant fire burning in the void',
    tags: ['interactive', 'physics', 'game'],
  },
  component: FrisbeeDiscThrowComponent,
  config: {
    camera: {
      position: [0, 2, 8],
      fov: 60,
    },
    lighting: 'studio',
    performance: {
      shadows: false,
      antialias: true,
    },
  },
}

export default FrisbeeDiscThrowComponent
