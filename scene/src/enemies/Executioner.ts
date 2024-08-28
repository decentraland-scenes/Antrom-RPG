import { Animator, engine, Entity, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'
import { BannerType } from '../ui/banner/bannerConstants'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { entityController } from '../realms/entityController'
import MonsterMobAuto from './monsterMobAuto'
import { syncEntity } from '@dcl/sdk/network'
import EntityManager from '../entity-manager/EntityManager'

function getRandomIntRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class Executioner extends MonsterMobAuto {
  shapeFile = 'assets/models/ExecutionerAxe.glb'
  hoverText: string
  private entityEnumId: number

  constructor(entityEnumId: number) {
    console.log(`Creating Executioner with ID: ${entityEnumId}`) // Log ID here

    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 2
    super(level + 20, level + 60, level - 10, level * 100)
    this.minLuck = 10
    this.hoverText = `Attack LVL ${entityEnumId} Executioner!`

    this.entityEnumId = entityEnumId
    const entityManager = EntityManager.getInstance()

    // Use the entity manager to create or retrieve the entity
    const entity = entityManager.createOrGetEntity(entityEnumId)
    if (!entity) {
      console.error(
        `Failed to create or retrieve entity with ID: ${entityEnumId}`
      )
      return
    }

    this.entity = entity // Ensure the type matches

    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0)
    })

    Animator.createOrReplace(this.entity, {
      states: [
        { clip: this.idleClip, playing: true, loop: true },
        { clip: this.attackClip, playing: false, loop: false },
        { clip: this.walkClip, playing: false, loop: true },
        { clip: this.impactClip, playing: false, loop: false },
        { clip: this.dieClip, playing: false, loop: false }
      ]
    })

    this.initMonster()
    this.loadTransformation()
    this.dropRate = -1

    syncEntity(
      this.entity,
      [Transform.componentId, Animator.componentId],
      this.entityEnumId
    )
  }

  onDropXp(): void {
    const player = Player.getInstance()
    const xp = getRandomIntRange(this.xp, this.xp + 10)
    const randomNumber = Math.random()
    if (randomNumber <= 0.1) {
      player.gameController.uiController.displayAnnouncement(
        '+1 POTIONS',
        Color4.Yellow(),
        3000
      )
      player.inventory.incrementItem(ITEM_TYPES.POTION, 1)
    }

    const exp = [
      {
        type: LEVEL_TYPES.ENEMY,
        value: 1
      },
      {
        type: LEVEL_TYPES.PLAYER,
        value: xp
      }
    ]
    const loot = [
      {
        type: ITEM_TYPES.BONE,
        value: 1
      }
    ]

    player.gameController.uiController.displayBanner(BannerType.B_BONES)
    player.addRewards(exp, loot)

    // Ensure removeEntity uses entity object
    if (this.entity) {
      EntityManager.getInstance().removeEntity(this.entity)
    }
  }

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(
      getRandomIntRange(-24, -4),
      0,
      getRandomIntRange(10, -12)
    )
    const initialRotation = Quaternion.fromEulerDegrees(
      0,
      getRandomIntRange(0, 180),
      0
    )
    if (this.entity) {
      Transform.createOrReplace(this.entity, {
        position: initialPosition,
        rotation: initialRotation
      })

      // Sync the updated transformation and animations
      syncEntity(
        this.entity,
        [Transform.componentId, Animator.componentId],
        this.entityEnumId
      )
    }
  }

  removeEntity(): void {
    super.cleanup()
    if (this.entity) {
      entityController.removeEntity(this.rangeAttackTrigger)
      entityController.removeEntity(this.engageAttackTrigger)
      entityController.removeEntity(this.entity)
    }
  }

  create(): void {
    // Create a new Executioner and sync it
    // Unique ID should be assigned to new instances
    const newChar = new Executioner(this.entityEnumId + 1) // Avoid side effects of incrementing
    const entityManager = EntityManager.getInstance()
    entityManager.logEntities()
    syncEntity(
      newChar.entity,
      [Transform.componentId, Animator.componentId],
      newChar.entityEnumId
    )
  }

  static createExecutioners(count: number): Executioner[] {
    const entityManager = EntityManager.getInstance()
    const executioners: Executioner[] = []

    for (let i = 0; i < count; i++) {
      const id = i + 10 // Example ID generation; adjust as necessary

      const executioner = new Executioner(id)

      if (executioner.entity) {
        executioners.push(executioner)
      }
    }

    entityManager.logEntities()

    return executioners
  }
}
