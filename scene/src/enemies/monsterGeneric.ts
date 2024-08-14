import * as utils from '@dcl-sdk/utils'
import {
  Billboard,
  Material,
  MeshRenderer,
  TextShape,
  Transform,
  type Entity
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { entityController } from '../realms/entityController'
import { currentlyAttackingMontserList } from './splashAttack'
import { Character } from './character'

export abstract class GenericMonster extends Character {
  private attackTrigger: Entity | null = null
  private healthBar: Entity | null = null
  private label: Entity | null = null
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

  setupAttackTriggerBox(scale: Vector3 = Vector3.create(8, 2, 8)): void {
    this.cleanup()
    this.attackTrigger = entityController.addEntity()
    Transform.create(this.attackTrigger, { parent: this.entity })
    utils.triggers.addTrigger(
      this.attackTrigger,
      1,
      1,
      [{ type: 'box', scale }],
      () => {
        this.createHealthBar()
        this.handleAttack()
        currentlyAttackingMontserList.push(this)
      },
      () => {
        if (this.healthBar != null) {
          entityController.removeEntity(this.healthBar)
          this.healthBar = null
        }
        if (this.label != null) {
          entityController.removeEntity(this.label)
          this.label = null
        }
        const index = currentlyAttackingMontserList.indexOf(this)
        if (index > -1) {
          currentlyAttackingMontserList.splice(index, 1)
        }
      }
    )
  }

  updateHealthBar(): void {
    if (this.healthBar !== null) {
      Transform.getMutable(this.healthBar).scale.x = 1 * this.getHealthScaled()
    }

    if (this.label !== null) {
      TextShape.getMutable(this.label).text = `${this.health}`
    }
  }

  createHealthBar(): void {
    if (this.healthBar != null) entityController.removeEntity(this.healthBar)
    if (this.label != null) entityController.removeEntity(this.label)

    this.healthBar = entityController.addEntity()
    this.label = entityController.addEntity()

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
    Billboard.create(this.label)
    Billboard.create(this.healthBar)
  }

  handleAttack(): void {}
  abstract performAttack(damage: number, isCriticalAttack: boolean): void

  cleanup(): void {
    if (this.attackTrigger !== null) {
      entityController.removeEntity(this.attackTrigger)
      this.attackTrigger = null
    }
    if (this.healthBar !== null) {
      entityController.removeEntity(this.healthBar)
      this.healthBar = null
    }
    if (this.label !== null) {
      entityController.removeEntity(this.label)
      this.label = null
    }
  }

  setTopOffset(offset: number): void {
    this.topOffSet = offset
  }
}
