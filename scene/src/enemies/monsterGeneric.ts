import * as utils from '@dcl-sdk/utils'
import {
  engine,
  Material,
  MeshRenderer,
  TextShape,
  Transform,
  type Entity
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { Character } from './character'

export class GenericMonster extends Character {
  private attackTrigger?: Entity
  private healthBar?: Entity
  private label?: Entity
  private topOffSet?: number

  constructor(
    attack: number,
    xp: number,
    level: number,
    health: number,
    baseDefense: number,
    topOffSet: number
  ) {
    super(attack, xp, level, health, baseDefense)
    this.setTopOffset(topOffSet)
  }

  setupAttackTriggerBox(scale: Vector3 = Vector3.create(4, 2, 4)): void {
    this.cleanup()

    this.attackTrigger = engine.addEntity()

    Transform.create(this.attackTrigger, { parent: this.entity })
    // MeshRenderer.setBox(this.attackTrigger)
    // VisibilityComponent.create(this.attackTrigger, { visible: true })

    utils.triggers.addTrigger(
      this.attackTrigger,
      1,
      1,
      [{ type: 'box', scale }],
      () => {
        // TODO
        // if (this.isDeadAnimation) return
        this.createHealthBar()
        this.handleAttack()
      },
      () => {
        if (this.healthBar != null) engine.removeEntity(this.healthBar)
        if (this.label != null) engine.removeEntity(this.label)
      }
    )
  }

  updateHealthBar(): void {
    if (this.healthBar !== undefined) {
      Transform.getMutable(this.healthBar).scale.x = 1 * this.getHealthScaled()
    }

    if (this.label !== undefined) {
      TextShape.getMutable(this.label).text = `${this.health}`
    }
  }

  createHealthBar(): void {
    if (this.healthBar != null) engine.removeEntity(this.healthBar)
    if (this.label != null) engine.removeEntity(this.label)

    this.healthBar = engine.addEntity()
    this.label = engine.addEntity()

    Transform.createOrReplace(this.healthBar, {
      scale: Vector3.create(1 * this.getHealthScaled(), 0.1, 0.1),
      position: Vector3.create(0, this.topOffSet, 0),
      parent: this.entity
    })
    MeshRenderer.setBox(this.healthBar)
    Material.setPbrMaterial(this.healthBar, {
      albedoColor: Color4.create(1, 0, 0, 0.5),
      metallic: 0,
      roughness: 1,
      specularIntensity: 0,
      emissiveIntensity: 0.4
    })
    TextShape.create(this.label, {
      text: `${this.health}`,
      textColor: Color4.White(),
      fontSize: 2
    })
    Transform.createOrReplace(this.label, {
      position: Vector3.create(0, this.topOffSet, -0.1),
      rotation: Quaternion.fromEulerDegrees(0, 180, 0),
      parent: this.entity
    })
  }

  handleAttack(): void {}

  cleanup(): void {
    if (this.attackTrigger !== undefined) {
      utils.triggers.removeTrigger(this.attackTrigger)
      engine.removeEntity(this.attackTrigger)
    }
    if (this.healthBar !== undefined) {
      engine.removeEntity(this.healthBar)
    }
    if (this.label !== undefined) {
      engine.removeEntity(this.label)
    }
  }

  setTopOffset(offset: number): void {
    this.topOffSet = offset
  }
}