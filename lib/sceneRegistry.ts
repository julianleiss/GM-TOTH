import { Scene, SceneRegistryEntry } from './types'

/**
 * Scene Registry - Central management for all available scenes
 */
class SceneRegistry {
  private scenes: Map<string, SceneRegistryEntry> = new Map()
  private listeners: Set<() => void> = new Set()

  /**
   * Register a new scene
   */
  register(scene: Scene): void {
    if (this.scenes.has(scene.metadata.id)) {
      console.warn(`Scene with id "${scene.metadata.id}" is already registered. Overwriting.`)
    }

    this.scenes.set(scene.metadata.id, {
      ...scene,
      isLoaded: false,
    })

    this.notifyListeners()
  }

  /**
   * Register multiple scenes at once
   */
  registerMany(scenes: Scene[]): void {
    scenes.forEach(scene => this.register(scene))
  }

  /**
   * Unregister a scene
   */
  unregister(sceneId: string): boolean {
    const result = this.scenes.delete(sceneId)
    if (result) {
      this.notifyListeners()
    }
    return result
  }

  /**
   * Get a scene by ID
   */
  get(sceneId: string): SceneRegistryEntry | undefined {
    return this.scenes.get(sceneId)
  }

  /**
   * Get all registered scenes
   */
  getAll(): SceneRegistryEntry[] {
    return Array.from(this.scenes.values())
  }

  /**
   * Get scenes by tag
   */
  getByTag(tag: string): SceneRegistryEntry[] {
    return this.getAll().filter(scene =>
      scene.metadata.tags?.includes(tag)
    )
  }

  /**
   * Check if a scene is registered
   */
  has(sceneId: string): boolean {
    return this.scenes.has(sceneId)
  }

  /**
   * Mark a scene as loaded
   */
  markAsLoaded(sceneId: string): void {
    const scene = this.scenes.get(sceneId)
    if (scene) {
      scene.isLoaded = true
      this.notifyListeners()
    }
  }

  /**
   * Mark a scene as having an error
   */
  markAsError(sceneId: string, error: Error): void {
    const scene = this.scenes.get(sceneId)
    if (scene) {
      scene.error = error
      this.notifyListeners()
    }
  }

  /**
   * Subscribe to registry changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }

  /**
   * Clear all registered scenes
   */
  clear(): void {
    this.scenes.clear()
    this.notifyListeners()
  }
}

// Export singleton instance
export const sceneRegistry = new SceneRegistry()

// Export type for testing/mocking
export type { SceneRegistry }
