// src/EntityManager.ts

import { Animator, engine, Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export default class EntityManager {
  private static instance: EntityManager
  private entityMap: Map<number, Entity> = new Map()
  private maxEntities: number = 6 // Adjust the maximum number as needed

  private constructor() {}

  public static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager()
    }
    return EntityManager.instance
  }

  public static getMaxEntities(): number {
    return EntityManager.getInstance().maxEntities
  }

  public createOrGetEntity(id: number): Entity | null {
    if (this.entityMap.has(id)) {
      return this.entityMap.get(id) || null
    } else if (this.entityMap.size < this.maxEntities) {
      const entity = engine.addEntity()
      this.entityMap.set(id, entity)
      return entity
    } else {
      console.log(`Maximum number of entities (${this.maxEntities}) reached.`)
      return null
    }
  }

  public getEntities(): Map<number, Entity> {
    return this.entityMap
  }

  public removeEntity(id: number): void {
    const entity = this.entityMap.get(id)
    if (entity) {
      engine.removeEntity(entity)
      this.entityMap.delete(id)
    }
  }

  public logEntities(): void {
    console.log('Current Entities:')
    this.entityMap.forEach((entity, id) => {
      console.log(`ID: ${id}, Entity: ${entity}`)
    })
  }
}
