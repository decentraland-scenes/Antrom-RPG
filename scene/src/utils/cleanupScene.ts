import { Transform, engine } from '@dcl/sdk/ecs'
import { entityController } from '../realms/entityController'

export function cleanupScene(): void {
  // Cleanup all entities
  for (const [entity] of engine.getEntitiesWith(Transform)) {
    console.log('entidades + ' + entity)
    entityController.removeEntity(entity)
  }
}
