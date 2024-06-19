import { Transform, engine } from '@dcl/sdk/ecs'

export function cleanupScene():void {
  // Cleanup all entities
  for (const [entity] of engine.getEntitiesWith(Transform)) {
    console.log('entidades + ' + entity)
    engine.removeEntity(entity)
  }
}
