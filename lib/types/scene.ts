/**
 * Scene metadata and configuration
 */
export interface SceneMetadata {
  /** Unique identifier for the scene */
  id: string
  /** Display name of the scene */
  name: string
  /** Brief description of the scene */
  description?: string
  /** Author of the scene */
  author?: string
  /** Tags for categorization */
  tags?: string[]
  /** Thumbnail URL or path */
  thumbnail?: string
}

/**
 * Scene component props
 */
export interface SceneProps {
  /** Whether the scene is currently active */
  isActive?: boolean
  /** Callback when scene is ready */
  onReady?: () => void
  /** Callback when scene encounters an error */
  onError?: (error: Error) => void
}

/**
 * Scene configuration
 */
export interface SceneConfig {
  /** Camera configuration */
  camera?: {
    position?: [number, number, number]
    fov?: number
    near?: number
    far?: number
  }
  /** Lighting presets */
  lighting?: 'default' | 'studio' | 'dramatic' | 'minimal' | 'none'
  /** Performance hints */
  performance?: {
    /** Enable shadows */
    shadows?: boolean
    /** Anti-aliasing */
    antialias?: boolean
    /** Pixel ratio limit */
    maxPixelRatio?: number
  }
}

/**
 * Main scene interface that all scenes must implement
 */
export interface Scene {
  /** Scene metadata */
  metadata: SceneMetadata
  /** Scene component */
  component: React.ComponentType<SceneProps>
  /** Scene configuration */
  config?: SceneConfig
  /** Cleanup function called when scene is unmounted */
  cleanup?: () => void
  /** Initialization function called when scene is mounted */
  init?: () => void | Promise<void>
}

/**
 * Scene registry entry
 */
export interface SceneRegistryEntry extends Scene {
  /** Whether the scene is currently loaded */
  isLoaded?: boolean
  /** Loading error if any */
  error?: Error
}

/**
 * Scene transition configuration
 */
export interface SceneTransition {
  /** Transition type */
  type: 'fade' | 'slide' | 'zoom' | 'none'
  /** Transition duration in milliseconds */
  duration?: number
  /** Easing function */
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}
