'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3, DoubleSide } from 'three'
import { useTexture } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'
import { Fire } from '@wolffo/three-fire/react'

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
}

interface DiscState {
  position: Vector3
  velocity: Vector3
  rotation: Vector3
  rotationVelocity: Vector3
  opacity: number
  active: boolean
  spawning: boolean
  spawnTime: number
  scale: number
  hitFire: boolean
  hitFireTime: number
}

function FrisbeeDiscThrowComponent({ isActive }: SceneProps) {
  const { camera, size, gl } = useThree()
  const [isMobile, setIsMobile] = useState(false)
  const [discs, setDiscs] = useState<DiscState[]>([
    {
      position: new Vector3(0, 2, 0), // Aligned with camera height for proper visibility
      velocity: new Vector3(0, 0, 0),
      rotation: new Vector3(0, 0, 0),
      rotationVelocity: new Vector3(0, 0, 0),
      opacity: 1,
      active: false,
      spawning: false,
      spawnTime: 0,
      scale: 1,
      hitFire: false,
      hitFireTime: 0,
    },
  ])
  const [lastThrowTime, setLastThrowTime] = useState(0)

  // Detect mobile and optimize renderer
  useEffect(() => {
    setIsMobile(isMobileDevice())

    // Mobile optimizations
    if (isMobileDevice()) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Limit pixel ratio for performance
    }
  }, [gl])


  // Animate discs physics
  useFrame((state, delta) => {
    if (!isActive) return

    const currentTime = state.clock.elapsedTime

    // Update discs physics
    setDiscs((prevDiscs) =>
      prevDiscs.map((disc) => {
        // Handle spawning animation
        if (disc.spawning) {
          const spawnProgress = (currentTime - disc.spawnTime) / 0.4 // 0.4s spawn animation

          if (spawnProgress >= 1) {
            // Spawn animation complete
            return {
              ...disc,
              spawning: false,
              scale: 1,
              opacity: 1,
            }
          }

          // Bounce/jump animation using easing
          const bounce = Math.sin(spawnProgress * Math.PI) * 0.5
          const scaleAnim = Math.min(1, spawnProgress * 2) // Quick scale up

          return {
            ...disc,
            position: new Vector3(0, 2 + bounce, 0),
            scale: scaleAnim,
            opacity: scaleAnim,
          }
        }

        if (!disc.active) return disc

        // Update position with velocity
        const newPosition = disc.position.clone().add(
          disc.velocity.clone().multiplyScalar(delta)
        )

        // Update rotation with spin
        const newRotation = disc.rotation.clone().add(
          disc.rotationVelocity.clone().multiplyScalar(delta)
        )

        // Apply gravity - stronger for heavier feel
        const newVelocity = disc.velocity.clone()
        newVelocity.y -= 9.8 * delta // More realistic gravity (9.8 m/s²)

        // Check collision with fire (fire is at [0, -1, -8])
        const fireCenter = new Vector3(0, 0, -8)
        const distanceToFire = newPosition.distanceTo(fireCenter)
        let hitFire = disc.hitFire
        let hitFireTime = disc.hitFireTime

        // Fire collision zone: radius ~7 units
        if (!hitFire && distanceToFire < 7 && newPosition.z < -4) {
          hitFire = true
          hitFireTime = currentTime
        }

        // Fade out based on distance
        const distance = newPosition.length()
        const fadeStartDistance = 15
        const fadeEndDistance = 25
        let newOpacity = disc.opacity

        if (distance > fadeStartDistance) {
          const fadeProgress = (distance - fadeStartDistance) / (fadeEndDistance - fadeStartDistance)
          newOpacity = Math.max(0, 1 - fadeProgress)
        }

        // Quick fade when hitting fire
        if (hitFire) {
          const timeSinceHit = currentTime - hitFireTime
          newOpacity = Math.max(0, 1 - timeSinceHit * 3) // Fade out in 0.33 seconds
        }

        // Deactivate if too far or fully faded
        const stillActive = distance < fadeEndDistance && newOpacity > 0

        return {
          ...disc,
          position: newPosition,
          velocity: newVelocity,
          rotation: newRotation,
          opacity: newOpacity,
          active: stillActive,
          hitFire,
          hitFireTime,
        }
      })
    )

    // Remove inactive discs and respawn with delay
    setDiscs((prevDiscs) => {
      const activeDiscs = prevDiscs.filter((disc) => disc.active || disc.spawning)
      const centerPosition = new Vector3(0, 2, 0)
      const hasReadyDisc = prevDiscs.some(
        (disc) => !disc.active && !disc.spawning && disc.position.distanceTo(centerPosition) < 0.1
      )

      // Check if enough time has passed since last throw (1 second delay)
      const canSpawn = (currentTime - lastThrowTime) >= 1.0

      if (!hasReadyDisc && canSpawn && activeDiscs.length < 10) { // Limit to 10 logos max
        return [
          ...prevDiscs.filter(d => d.active || d.spawning),
          {
            position: new Vector3(0, 2, 0),
            velocity: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            rotationVelocity: new Vector3(0, 0, 0),
            opacity: 0,
            active: false,
            spawning: true,
            spawnTime: currentTime,
            scale: 0.1,
            hitFire: false,
            hitFireTime: 0,
          },
        ]
      }

      return prevDiscs
    })
  })

  // Handle disc click/tap
  const handleDiscClick = (discIndex: number, currentTime: number) => {
    const disc = discs[discIndex]
    if (disc.active || disc.spawning) return // Already thrown or still spawning

    // Calculate throw direction - straight forward (camera facing direction)
    const throwDirection = new Vector3(0, 0, -1)
    throwDirection.applyQuaternion(camera.quaternion)

    // Add slight upward angle for realistic arc
    throwDirection.y += 0.15
    throwDirection.normalize()

    // Set velocity - heavier/slower for realistic feel (like throwing a heavy disc)
    const throwSpeed = 15 // Increased speed for more satisfying throw
    const velocity = throwDirection.multiplyScalar(throwSpeed)

    // Set rotation velocity (realistic disc spin)
    const rotationVelocity = new Vector3(
      Math.random() * 3 - 1.5, // slight random wobble on x
      10, // strong frisbee spin on y axis
      Math.random() * 3 - 1.5  // slight random wobble on z
    )

    setDiscs((prevDiscs) =>
      prevDiscs.map((d, i) =>
        i === discIndex
          ? {
              ...d,
              velocity,
              rotationVelocity,
              active: true,
              scale: 1,
            }
          : d
      )
    )

    setLastThrowTime(currentTime)
  }

  // Handle scene click - throw the first available disc
  const handleSceneClick = () => {
    const currentTime = performance.now() / 1000 // Convert to seconds
    const readyDiscIndex = discs.findIndex(disc => !disc.active && !disc.spawning)
    if (readyDiscIndex !== -1) {
      handleDiscClick(readyDiscIndex, currentTime)
    }
  }

  return (
    <>
      {/* Invisible click plane covering the entire viewport */}
      <mesh
        position={[0, 0, 0]}
        onClick={handleSceneClick}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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

      {/* Fire glow lights - optimized for mobile */}
      <pointLight position={[0, 0, -8]} intensity={6} color="#ff4400" distance={20} decay={2} />
      <pointLight position={[0, 2, -8]} intensity={4} color="#ff8800" distance={18} decay={2} />

      {/* Fire in the distance - adaptive rendering based on device */}
      {/* Core flame - deep red/orange */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={14.0}
        color="#ff3300"
        magnitude={0.9}
        lacunarity={1.3}
        gain={0.52}
      />

      {/* Mid flame - bright orange */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -8]}
        scale={14.8}
        color="#ff6600"
        magnitude={0.8}
        lacunarity={1.2}
        gain={0.56}
      />

      {/* Outer flame - yellow tips (skip on mobile for performance) */}
      {!isMobile && (
        <Fire
          texture="/images/fire.png"
          position={[0, -1, -8]}
          scale={15.4}
          color="#ffaa00"
          magnitude={0.7}
          lacunarity={1.15}
          gain={0.6}
        />
      )}

      {/* Frisbee discs */}
      {discs.map((disc, index) => (
        <Disc
          key={`disc-${index}`}
          position={disc.position}
          rotation={disc.rotation}
          opacity={disc.opacity}
          isThrown={disc.active}
          camera={camera}
          scale={disc.scale}
          spawning={disc.spawning}
          hitFire={disc.hitFire}
          hitFireTime={disc.hitFireTime}
        />
      ))}

      {/* Fire collision effects */}
      {discs.map((disc, index) =>
        disc.hitFire && (
          <FireCollisionEffect
            key={`fire-effect-${index}`}
            position={disc.position}
            startTime={disc.hitFireTime}
          />
        )
      )}
    </>
  )
}

// Fire collision effect - explosion when logo hits fire
function FireCollisionEffect({
  position,
  startTime,
}: {
  position: Vector3
  startTime: number
}) {
  const explosionLightRef = useRef<any>(null)

  useFrame((state) => {
    if (!explosionLightRef.current) return

    const elapsed = state.clock.elapsedTime - startTime

    if (elapsed < 0.5) {
      // Explosion flash - quick bright burst
      const intensity = Math.max(0, 20 * (1 - elapsed / 0.5))
      explosionLightRef.current.intensity = intensity
    } else {
      explosionLightRef.current.intensity = 0
    }
  })

  return (
    <>
      {/* Bright explosion flash */}
      <pointLight
        ref={explosionLightRef}
        position={[position.x, position.y, position.z]}
        color="#ffaa00"
        intensity={20}
        distance={15}
        decay={2}
      />
    </>
  )
}

// Disc component - now displays GM logo
function Disc({
  position,
  rotation,
  opacity,
  isThrown,
  camera,
  scale,
  spawning,
  hitFire,
  hitFireTime,
}: {
  position: Vector3
  rotation: Vector3
  opacity: number
  isThrown: boolean
  camera: any
  scale: number
  spawning: boolean
  hitFire: boolean
  hitFireTime: number
}) {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef<any>(null)
  const glowRef = useRef<any>(null)
  const idleGlowRef = useRef<any>(null)

  // Load the GM logo texture
  const logoTexture = useTexture('/images/GM_LOGO.png')

  useFrame((state) => {
    if (meshRef.current && !isThrown && !spawning) {
      // Constant rotation when idle
      meshRef.current.rotation.z += 0.01

      // Make disc face camera
      meshRef.current.lookAt(camera.position)
      meshRef.current.scale.set(scale, scale, scale)

      // Idle floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
      const floatX = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
      if (groupRef.current) {
        groupRef.current.position.set(
          position.x + floatX,
          position.y + floatY,
          position.z
        )
      }
    } else if (meshRef.current && isThrown) {
      // Apply rotation when thrown
      meshRef.current.rotation.x = rotation.x
      meshRef.current.rotation.y = rotation.y
      meshRef.current.rotation.z = rotation.z

      if (groupRef.current) {
        groupRef.current.position.set(position.x, position.y, position.z)
      }
    } else if (groupRef.current && spawning) {
      groupRef.current.position.set(position.x, position.y, position.z)
    }

    // Pulse glow effect during spawn
    if (glowRef.current && spawning) {
      const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7
      glowRef.current.intensity = 8 * pulse * scale
    }

    // Soft glow when idle
    if (idleGlowRef.current && !isThrown && !spawning) {
      const idlePulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7
      idleGlowRef.current.intensity = 2 * idlePulse
    }
  })

  return (
    <group ref={groupRef}>
      {/* Spawn glow effect - bright flash like a video game */}
      {spawning && (
        <pointLight
          ref={glowRef}
          position={[0, 0, 0]}
          color="#ffffff"
          intensity={8}
          distance={8}
          decay={2}
        />
      )}

      {/* Idle glow effect - soft permanent glow */}
      {!isThrown && !spawning && (
        <pointLight
          ref={idleGlowRef}
          position={[0, 0, 0]}
          color="#ffffff"
          intensity={2}
          distance={5}
          decay={2}
        />
      )}

      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
      >
        {/* Plane shape to display the logo image - 3x bigger */}
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          opacity={opacity}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}

// Scene definition
export const frisbeeDiscThrowScene: Scene = {
  metadata: {
    id: 'frisbee-disc-throw',
    name: '01',
    description: 'Throw the red disc toward the massive fire burning in the void',
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
      antialias: typeof window !== 'undefined' && !isMobileDevice(), // Disable AA on mobile
    },
  },
}

export default FrisbeeDiscThrowComponent
