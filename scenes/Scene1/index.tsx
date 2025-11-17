'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3, AdditiveBlending, Points, BufferAttribute, CanvasTexture, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three'
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

  // Track mouse position (normalized device coordinates)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Handle mouse/touch movement
  const handleMouseMove = (event: any) => {
    // R3F provides pointer position - works for both mouse and touch
    // Use clientX/clientY for compatibility, converting to NDC
    const clientX = event.clientX ?? (event.touches?.[0]?.clientX || 0)
    const clientY = event.clientY ?? (event.touches?.[0]?.clientY || 0)
    const x = (clientX / size.width) * 2 - 1
    const y = -(clientY / size.height) * 2 + 1
    setMousePos({ x, y })
  }

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

    // Calculate throw direction based on mouse position
    // Use mouse position to determine horizontal and vertical direction
    const throwDirection = new Vector3(
      mousePos.x * 1.5, // Horizontal based on mouse X
      mousePos.y * 1.5 + 0.3, // Vertical based on mouse Y, plus base upward angle
      -1 // Always throw forward
    )
    throwDirection.applyQuaternion(camera.quaternion)
    throwDirection.normalize()

    // Set velocity (speed: 18 units/sec)
    const throwSpeed = 18
    const velocity = throwDirection.multiplyScalar(throwSpeed)

    // Stone-like throw: minimal rotation (just a slight tumble)
    const rotationVelocity = new Vector3(
      Math.random() * 2 - 1, // minimal spin on x
      Math.random() * 2 - 1, // minimal spin on y
      Math.random() * 2 - 1  // minimal spin on z
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
      <pointLight position={[0, 0, -12]} intensity={6} color="#ff4400" distance={20} decay={2} />
      <pointLight position={[0, 2, -12]} intensity={4} color="#ff8800" distance={18} decay={2} />

      {/* Fire in the distance - adaptive rendering based on device */}
      {/* Core flame - deep red/orange */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -12]}
        scale={20.0}
        color="#ff3300"
        magnitude={0.15}
        lacunarity={0.3}
        gain={0.15}
      />

      {/* Mid flame - bright orange */}
      <Fire
        texture="/images/fire.png"
        position={[0, -1, -12]}
        scale={21.0}
        color="#ff6600"
        magnitude={0.12}
        lacunarity={0.3}
        gain={0.15}
      />

      {/* Outer flame - yellow tips (skip on mobile for performance) */}
      {!isMobile && (
        <Fire
          texture="/images/fire.png"
          position={[0, -1, -12]}
          scale={22.0}
          color="#ffaa00"
          magnitude={0.1}
          lacunarity={0.25}
          gain={0.15}
        />
      )}

      {/* Smoke effect - single optimized instance */}
      <SmokeParticles isActive={isActive} isMobile={isMobile} />

      {/* Mouse tracking group */}
      <group onPointerMove={handleMouseMove}>
        {/* Invisible plane to capture mouse events and clicks */}
        <mesh
          position={[0, 0, 0]}
          visible={false}
          onClick={(e) => {
            e.stopPropagation()
            // Find first inactive disc and throw it
            const inactiveDiscIndex = discs.findIndex(d => !d.active)
            if (inactiveDiscIndex !== -1) {
              handleDiscClick(inactiveDiscIndex)
            }
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
          }}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* Logo discs */}
      {discs.map((disc, index) => (
        <Disc
          key={`disc-${index}`}
          position={disc.position}
          rotation={disc.rotation}
          opacity={disc.opacity}
          onClick={() => handleDiscClick(index)}
          isThrown={disc.active}
          camera={camera}
          mousePos={mousePos}
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

    const geometry = new PlaneGeometry(2.5, 2.5)
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
      const initialSize = 0.15 + Math.random() * 0.75
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
  mousePos,
}: {
  position: Vector3
  rotation: Vector3
  opacity: number
  onClick: () => void
  isThrown: boolean
  camera: any
  mousePos: { x: number; y: number }
}) {
  const meshRef = useRef<Mesh>(null)

  // Load the GM logo texture
  const logoTexture = useTexture('/images/GM_LOGO.png')

  useFrame(() => {
    if (meshRef.current && !isThrown) {
      // Make logo slightly follow mouse cursor to indicate throw angle
      const followAmount = 0.3 // How much to follow the cursor (0 = none, 1 = full)
      const targetX = position.x + mousePos.x * followAmount
      const targetY = position.y + mousePos.y * followAmount

      meshRef.current.position.x = targetX
      meshRef.current.position.y = targetY

      // Make disc face camera when not thrown
      meshRef.current.lookAt(camera.position)

      // Add stronger tilt based on mouse position for visual feedback
      meshRef.current.rotation.z = -mousePos.x * 0.5
      meshRef.current.rotation.x += mousePos.y * 0.3
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
      {/* Plane shape to display the logo image - larger size for better visibility */}
      <planeGeometry args={[12, 12]} />
      <meshBasicMaterial
        map={logoTexture}
        transparent
        opacity={opacity}
        side={DoubleSide}
        toneMapped={false}
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
      fov: 90,
    },
    lighting: 'studio',
    performance: {
      shadows: false,
      antialias: typeof window !== 'undefined' && !isMobileDevice(), // Disable AA on mobile
    },
  },
}

export default FrisbeeDiscThrowComponent
