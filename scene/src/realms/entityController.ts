import type { Entity } from '@dcl/sdk/ecs'
import { engine } from '@dcl/sdk/ecs'

function createAddEntityFunction(): {
  addEntity: () => Entity
  clean: () => void
  isEmpty: () => boolean
  entities: () => Entity[]
  removeEntity: (entity: Entity) => void
} {
  let arr: Entity[] = []

  return {
    addEntity() {
      const newEntity = engine.addEntity()
      arr.push(newEntity)
      return newEntity
    },
    clean() {
      for (const entity of arr) {
        engine.removeEntity(entity)
      }
      arr = []
    },
    isEmpty() {
      return arr.length === 0
    },
    entities() {
      return arr
    },
    removeEntity(entity: Entity) {
      engine.removeEntity(entity)
      arr = arr.filter((e) => e !== entity)
    }
  }
}

export const entityController = createAddEntityFunction()
