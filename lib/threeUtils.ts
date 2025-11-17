import * as THREE from 'three'

/**
 * Dispose of Three.js object and all its children
 */
export function disposeObject(object: THREE.Object3D) {
  if (!object) return

  // Traverse all children
  object.traverse((child) => {
    // Dispose geometry
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose()
      }

      // Dispose materials
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material))
        } else {
          disposeMaterial(child.material)
        }
      }
    }
  })

  // Remove from parent
  if (object.parent) {
    object.parent.remove(object)
  }
}

/**
 * Dispose of Three.js material
 */
export function disposeMaterial(material: THREE.Material) {
  if (!material) return

  // Dispose textures
  Object.keys(material).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (material as any)[key]
    if (value && value instanceof THREE.Texture) {
      value.dispose()
    }
  })

  material.dispose()
}

/**
 * Dispose of Three.js geometry
 */
export function disposeGeometry(geometry: THREE.BufferGeometry) {
  if (geometry) {
    geometry.dispose()
  }
}

/**
 * Dispose of Three.js texture
 */
export function disposeTexture(texture: THREE.Texture) {
  if (texture) {
    texture.dispose()
  }
}

/**
 * Cleanup entire scene
 */
export function cleanupScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      disposeObject(object)
    }
  })

  scene.clear()
}
