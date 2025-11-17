'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3, AdditiveBlending, Points, BufferAttribute, CanvasTexture, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three'
import { OrbitControls, useTexture } from '@react-three/drei'
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
}

function FrisbeeDiscThrowComponent({ isActive }: SceneProps) {
  const { camera, size, gl } = useThree()
  const [isMobile, setIsMobile] = useState(false)
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

      {/* Smoke effect - single optimized instance */}
      <SmokeParticles isActive={isActive} isMobile={isMobile} />

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

// Generate procedural smoke texture
function generateSmokeTexture(): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256

  const ctx = canvas.getContext('2d')!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  // Create radial gradient for smoke
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2)
  gradient.addColorStop(0, 'rgba(200, 200, 200, 0.5)')
  gradient.addColorStop(0.2, 'rgba(150, 150, 150, 0.4)')
  gradient.addColorStop(0.4, 'rgba(100, 100, 100, 0.2)')
  gradient.addColorStop(0.7, 'rgba(50, 50, 50, 0.1)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add noise for texture
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 40 - 20
    data[i] = Math.max(0, Math.min(255, data[i] + noise))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new CanvasTexture(canvas)
  return texture
}

// Smoke Particles Component - Mesh-based with rotation (like sbrl example)
function SmokeParticles({ isActive, isMobile }: { isActive?: boolean; isMobile?: boolean }) {
  const groupRef = useRef<any>(null)
  const smokeTexture = useMemo(() => generateSmokeTexture(), [])

  // Create smoke mesh particles
  const smokeParticles = useMemo(() => {
    const particles: {
      mesh: Mesh
      velocity: Vector3
      rotationSpeed: number
    }[] = []

    const geometry = new PlaneGeometry(10, 10)
    const particleCount = isMobile ? 10 : 15 // Further reduced on mobile

    for (let i = 0; i < particleCount; i++) {
      const material = new MeshBasicMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0.35, // Slightly reduced for better performance
        depthWrite: false,
        side: DoubleSide,
      })

      const mesh = new Mesh(geometry, material)

      // Start position at fire top
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 1.0
      mesh.position.set(
        Math.cos(angle) * radius,
        0.5 + Math.random() * 0.5,
        Math.sin(angle) * radius
      )

      // Random initial rotation
      mesh.rotation.z = Math.random() * Math.PI * 2
      const initialSize = 0.5 + Math.random() * 3.5
      mesh.scale.set(initialSize, initialSize, 1)

      particles.push({
        mesh,
        velocity: new Vector3(
          (Math.random() - 0.5) * 0.3,
          0.4 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.3
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.3,
      })
    }

    return particles
  }, [smokeTexture, isMobile])

  // Add meshes to group
  useMemo(() => {
    if (groupRef.current) {
      smokeParticles.forEach(p => groupRef.current.add(p.mesh))
    }
  }, [smokeParticles])

  // Animate smoke - evolveSmoke pattern
  useFrame((state, delta) => {
    if (!isActive) return

    smokeParticles.forEach((particle) => {
      // Update position
      particle.mesh.position.x += particle.velocity.x * delta
      particle.mesh.position.y += particle.velocity.y * delta
      particle.mesh.position.z += particle.velocity.z * delta

      // Rotate smoke (key feature from sbrl example)
      particle.mesh.rotation.z += delta * particle.rotationSpeed

      // Add turbulence
      particle.mesh.position.x += Math.sin(state.clock.elapsedTime * 0.3 + particle.mesh.position.y) * delta * 0.2
      particle.mesh.position.z += Math.cos(state.clock.elapsedTime * 0.3 + particle.mesh.position.y) * delta * 0.2

      // Fade out as it rises
      const opacity = Math.max(0, 0.4 - (particle.mesh.position.y / 15) * 0.4)
      ;(particle.mesh.material as MeshBasicMaterial).opacity = opacity

      // Reset particle when too high or faded
      if (particle.mesh.position.y > 10 || opacity <= 0) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 1.0
        particle.mesh.position.set(
          Math.cos(angle) * radius,
          0.5 + Math.random() * 0.5,
          Math.sin(angle) * radius
        )
        particle.velocity.set(
          (Math.random() - 0.5) * 0.3,
          0.4 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.3
        )
        particle.mesh.rotation.z = Math.random() * Math.PI * 2
        ;(particle.mesh.material as MeshBasicMaterial).opacity = 0.4
      }

      // Slow down
      particle.velocity.multiplyScalar(0.99)
    })
  })

  return <group ref={groupRef} position={[0, 0, -2]} />
}

// Disc component - now displays GM logo
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

  // Load the GM logo texture
  const logoTexture = useTexture('/images/GM_LOGO.png')

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
      {/* Plane shape to display the logo image */}
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        map={logoTexture}
        transparent
        opacity={opacity}
        side={DoubleSide}
      />
    </mesh>
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
