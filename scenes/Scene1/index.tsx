'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3, Color, AdditiveBlending, Points, BufferGeometry, PointsMaterial, BufferAttribute, CanvasTexture, Sprite, SpriteMaterial, NormalBlending } from 'three'
import { OrbitControls } from '@react-three/drei'
import { Scene, SceneProps } from '@/lib/types'

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

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#4080ff" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

      {/* Fire effect */}
      <Fire isActive={isActive} />

      {/* Smoke effect */}
      <SmokeParticles isActive={isActive} />

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

// Fire component - Realistic fire effect using particles
function Fire({ isActive }: { isActive?: boolean }) {
  const particlesRef = useRef<Points>(null)
  const particlesRef2 = useRef<Points>(null)
  const particlesRef3 = useRef<Points>(null)

  // Create particle systems with different characteristics
  const { positions, velocities, lifetimes, sizes, colors } = useMemo(() => {
    const particleCount = 1500
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const lifetimes = new Float32Array(particleCount)
    const sizes = new Float32Array(particleCount)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Start particles at base of fire with some spread
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 1.5

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * -2 // Start below center
      positions[i * 3 + 2] = Math.sin(angle) * radius

      // Upward velocity with some turbulence
      velocities[i * 3] = (Math.random() - 0.5) * 1.5
      velocities[i * 3 + 1] = Math.random() * 3 + 2 // Strong upward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.5

      lifetimes[i] = Math.random()
      sizes[i] = Math.random() * 0.8 + 0.2

      // Color variation - red to orange to yellow
      const colorMix = Math.random()
      if (colorMix < 0.3) {
        // Deep red/orange
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.0
      } else if (colorMix < 0.7) {
        // Orange
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.4
        colors[i * 3 + 2] = 0.0
      } else {
        // Yellow
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.2
      }
    }

    return { positions, velocities, lifetimes, sizes, colors }
  }, [])

  // Animate particles
  useFrame((state, delta) => {
    if (!isActive) return

    const animateParticles = (particlesRef: React.RefObject<Points>, speedMult: number = 1) => {
      if (!particlesRef.current) return

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const particleCount = positions.length / 3

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Update lifetime
        lifetimes[i] += delta * 0.3 * speedMult

        if (lifetimes[i] > 1.0) {
          // Reset particle
          lifetimes[i] = 0
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * 1.5

          positions[i3] = Math.cos(angle) * radius
          positions[i3 + 1] = -2
          positions[i3 + 2] = Math.sin(angle) * radius

          velocities[i3] = (Math.random() - 0.5) * 1.5
          velocities[i3 + 1] = Math.random() * 3 + 2
          velocities[i3 + 2] = (Math.random() - 0.5) * 1.5
        } else {
          // Update position based on velocity
          positions[i3] += velocities[i3] * delta * speedMult
          positions[i3 + 1] += velocities[i3 + 1] * delta * speedMult
          positions[i3 + 2] += velocities[i3 + 2] * delta * speedMult

          // Add turbulence
          positions[i3] += Math.sin(state.clock.elapsedTime * 2 + i) * delta * 0.5
          positions[i3 + 2] += Math.cos(state.clock.elapsedTime * 2 + i) * delta * 0.5

          // Velocity decay and curl
          velocities[i3] *= 0.99
          velocities[i3 + 2] *= 0.99
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    animateParticles(particlesRef, 1.0)
    animateParticles(particlesRef2, 0.8)
    animateParticles(particlesRef3, 1.2)
  })

  return (
    <group position={[0, 0, -2]}>
      {/* Main fire particles - Orange/Red */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          vertexColors
          transparent
          opacity={0.8}
          blending={AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>

      {/* Secondary layer - brighter core */}
      <points ref={particlesRef2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color="#ffaa00"
          transparent
          opacity={0.6}
          blending={AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>

      {/* Third layer - yellow highlights */}
      <points ref={particlesRef3}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#ffff66"
          transparent
          opacity={0.4}
          blending={AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>

      {/* Point lights for fire glow */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#ff4400" distance={10} />
      <pointLight position={[0, 1, 0]} intensity={2} color="#ff8800" distance={8} />
      <pointLight position={[0, -1, 0]} intensity={1.5} color="#ff2200" distance={6} />
    </group>
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

  // Create radial gradient for smoke puff
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.4, 'rgba(200, 200, 200, 0.4)')
  gradient.addColorStop(0.7, 'rgba(128, 128, 128, 0.1)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add some noise/texture
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 30 - 15
    data[i] = Math.max(0, Math.min(255, data[i] + noise))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new CanvasTexture(canvas)
  return texture
}

// Realistic Smoke Particles Component
function SmokeParticles({ isActive }: { isActive?: boolean }) {
  const groupRef = useRef<any>(null)
  const smokeTexture = useMemo(() => generateSmokeTexture(), [])

  // Particle data
  const particleData = useMemo(() => {
    const count = 50 // Fewer but larger smoke sprites
    const particles: {
      sprite: Sprite
      velocity: Vector3
      rotation: number
      rotationSpeed: number
      lifetime: number
      maxLifetime: number
      initialSize: number
    }[] = []

    for (let i = 0; i < count; i++) {
      const material = new SpriteMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0,
        blending: NormalBlending,
        depthWrite: false,
        color: 0x888888,
      })

      const sprite = new Sprite(material)

      // Start at fire base with some spread
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.8
      sprite.position.set(
        Math.cos(angle) * radius,
        -1.5,
        Math.sin(angle) * radius
      )

      const initialSize = 1.5 + Math.random() * 1.5
      sprite.scale.set(initialSize, initialSize, 1)

      particles.push({
        sprite,
        velocity: new Vector3(
          (Math.random() - 0.5) * 0.3, // Gentle horizontal drift
          0.5 + Math.random() * 0.5,    // Slow upward movement
          (Math.random() - 0.5) * 0.3
        ),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.5, // Slow rotation
        lifetime: Math.random() * 5, // Stagger start times
        maxLifetime: 5 + Math.random() * 3,
        initialSize,
      })
    }

    return particles
  }, [smokeTexture])

  // Add sprites to group
  useEffect(() => {
    if (groupRef.current) {
      particleData.forEach(p => groupRef.current.add(p.sprite))
    }

    return () => {
      // Cleanup sprites on unmount
      if (groupRef.current) {
        particleData.forEach(p => {
          groupRef.current.remove(p.sprite)
          p.sprite.material.dispose()
        })
      }
    }
  }, [particleData])

  // Animate smoke particles
  useFrame((state, delta) => {
    if (!isActive) return

    particleData.forEach((particle) => {
      // Update lifetime
      particle.lifetime += delta

      if (particle.lifetime > particle.maxLifetime) {
        // Reset particle
        particle.lifetime = 0
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 0.8
        particle.sprite.position.set(
          Math.cos(angle) * radius,
          -1.5,
          Math.sin(angle) * radius
        )
        particle.velocity.set(
          (Math.random() - 0.5) * 0.3,
          0.5 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.3
        )
        particle.rotationSpeed = (Math.random() - 0.5) * 0.5
      } else {
        // Update position
        particle.sprite.position.x += particle.velocity.x * delta
        particle.sprite.position.y += particle.velocity.y * delta
        particle.sprite.position.z += particle.velocity.z * delta

        // Add turbulence
        const turbulence = Math.sin(state.clock.elapsedTime * 0.5 + particle.sprite.position.y) * 0.3
        particle.sprite.position.x += turbulence * delta
        particle.sprite.position.z += Math.cos(state.clock.elapsedTime * 0.5 + particle.sprite.position.y) * 0.3 * delta

        // Update rotation
        particle.rotation += particle.rotationSpeed * delta
        particle.sprite.material.rotation = particle.rotation

        // Size expansion - smoke expands as it rises
        const lifetimeRatio = particle.lifetime / particle.maxLifetime
        const scale = particle.initialSize * (1 + lifetimeRatio * 2) // Grows to 3x initial size
        particle.sprite.scale.set(scale, scale, 1)

        // Opacity fade - fade in quickly, fade out slowly
        let opacity = 0
        if (lifetimeRatio < 0.1) {
          // Fade in
          opacity = lifetimeRatio / 0.1 * 0.4
        } else if (lifetimeRatio < 0.7) {
          // Stay visible
          opacity = 0.4
        } else {
          // Fade out
          opacity = 0.4 * (1 - (lifetimeRatio - 0.7) / 0.3)
        }

        ;(particle.sprite.material as SpriteMaterial).opacity = opacity

        // Slow down as it rises
        particle.velocity.multiplyScalar(0.98)
      }
    })
  })

  return <group ref={groupRef} position={[0, 0, -2]} />
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
    description: 'Click or tap the red disc to throw it through the blazing fire',
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
