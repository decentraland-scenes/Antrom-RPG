// src/EntityManager.ts

import { Animator, engine, Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { syncEntity } from '@dcl/sdk/network'

export default class EntityManager {
  private static instance: EntityManager
  private entityMap: Map<number, Entity> = new Map()
  private maxEntities: number = 5 // Set to exactly 5 for the desired number of executioners
  private initialized: boolean = false

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
    // If entity exists, return it
    if (this.entityMap.has(id)) {
      return this.entityMap.get(id) || null
    }

    // Create new entity if under limit
    if (this.entityMap.size < this.maxEntities) {
      const entity = engine.addEntity()
      this.entityMap.set(id, entity)

      // Initialize required components
      Transform.createOrReplace(entity, {
        position: Vector3.create(0, 0, 0)
      })

      // Sync the entity immediately after creation
      try {
        syncEntity(entity, [Transform.componentId, Animator.componentId], id)
      } catch (error) {
        console.error(`Failed to sync entity ${id}:`, error)
      }

      return entity
    }

    console.log(`Maximum number of entities (${this.maxEntities}) reached.`)
    return null
  }

  public getEntities(): Map<number, Entity> {
    return this.entityMap
  }

  public removeEntity(id: number): void {
    const entity = this.entityMap.get(id)
    if (entity) {
      // Remove components first
      Transform.deleteFrom(entity)
      Animator.deleteFrom(entity)

      // Then remove the entity
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

  public isInitialized(): boolean {
    return this.initialized
  }

  public setInitialized(value: boolean): void {
    this.initialized = value
  }

  public cleanup(): void {
    // Clean up all entities
    this.entityMap.forEach((entity, id) => {
      this.removeEntity(id)
    })
    this.entityMap.clear()
    this.initialized = false
  }
}
