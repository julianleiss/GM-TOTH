import { sceneRegistry } from './sceneRegistry'
import {
  frisbeeDiscThrowScene,
} from '@/scenes'

/**
 * Register all available scenes with the scene registry
 * This should be called once when the app initializes
 */
export function registerAllScenes() {
  sceneRegistry.registerMany([
    frisbeeDiscThrowScene,
  ])
}
