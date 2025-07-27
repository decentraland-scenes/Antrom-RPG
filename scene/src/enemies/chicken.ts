import { GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'
import { entityController } from '../realms/entityController'
import { BannerType } from '../ui/banner/bannerConstants'
import { getRandomInt, getRandomIntRange } from './../utils/getRandomInt'
import MonsterMeat from './monsterMeat'

const DEFAULT_ATTACK = 0
const DEFAULT_XP = 9
const DEFAULT_LEVEL = 0
const DEFAULT_HP = 1

export default class Chicken extends MonsterMeat {
  shapeFile = 'assets/models/chicken.glb'

  // audioFile = "assets/sounds/chicken.mp3"
  hoverText = 'Attack Chicken!'

  constructor() {
    super(DEFAULT_ATTACK, DEFAULT_XP, DEFAULT_LEVEL, DEFAULT_HP, 1, 4, 1)
    this.initMonster()
    this.loadTransformation()
    this.shape = this.shapeFile
    GltfContainer.createOrReplace(this.entity, { src: this.shape })
    this.isPrey = true
    this.minLuck = -1000
  }

  onDropXp(): void {
    const player = Player.getInstance()
    player.gameController.uiController.displayBanner(BannerType.B_MEAT)

    console.log('onDropXp - Chicken')
    if (player.levels.getLevel(LEVEL_TYPES.PLAYER) <= 5) {
      player.levels.addXp(LEVEL_TYPES.PLAYER, 20)
    } else {
      player.levels.addXp(LEVEL_TYPES.PLAYER, this.xp)
    }

    player.levels.addXp(LEVEL_TYPES.MEAT, 1)
    player.gameController.uiController.displayBanner(BannerType.B_XP)

    console.log('onDrop - Chicken')

    if (
      player.hasWearableEquipped('0x855ec57cc60c28187a021a3757a80ac4758e0b06:0')
    ) {
      player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 2)
      player.gameController.uiController.displayBanner(BannerType.B_MEAT_PLUS)

      // TODO
      // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
      //     ITEM_TYPES.CHICKEN,
      //     2
      // )
    } else {
      player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 2)
      player.gameController.uiController.displayBanner(BannerType.B_MEAT)

      // TODO
      // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
      //     ITEM_TYPES.CHICKEN,
      //     1
      // )
    }

    if (getRandomInt(10) === 1) {
      player.inventory.incrementItem(ITEM_TYPES.EGG)
    }
  }

  async onDropLoot(): Promise<void> {}

  setupAttackTriggerBox(): void {
    super.setupEngageTriggerBox()
  }

  loadTransformation(): void {
    // Randomly choose between three spawn areas
    const spawnArea =
      Math.random() < 0.33 ? 'forest' : Math.random() < 0.5 ? 'new' : 'forest2'

    let initialPosition: Vector3

    if (spawnArea === 'forest') {
      // Forest area: around (7.26, 2.76, 67.18) with 50 radius
      initialPosition = Vector3.create(
        getRandomIntRange(-5, 20), // X: -5 to 20
        2.76, // Y: Forest height
        getRandomIntRange(55, 80) // Z: 55 to 80
      )
    } else if (spawnArea === 'new') {
      // New area: around (-36.86, 0.91, 25.42) and (-47.29, 0.91, 12.26) with 30 radius
      const centerX =
        (getRandomIntRange(-47, -37) + getRandomIntRange(-47, -37)) / 2 // Average of the two X positions
      const centerZ =
        (getRandomIntRange(12, 26) + getRandomIntRange(12, 26)) / 2 // Average of the two Z positions

      initialPosition = Vector3.create(
        getRandomIntRange(centerX - 15, centerX + 15), // X: ±15 from center (30 radius)
        -0.09, // Y: Lowered from 0.91 to ground level
        getRandomIntRange(centerZ - 15, centerZ + 15) // Z: ±15 from center (30 radius)
      )
    } else {
      // Forest2 area: around (-29.49, 1.64, 75.31) with 30 radius
      initialPosition = Vector3.create(
        getRandomIntRange(-44, -15), // X: -44 to -15 (30 radius)
        1.64, // Y: Forest2 height
        getRandomIntRange(60, 90) // Z: 60 to 90 (30 radius)
      )
    }
    const initialRotation = Quaternion.fromEulerDegrees(0, 80, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }

  removeEntity(): void {
    super.cleanup()
    entityController.removeEntity(this.rangeAttackTrigger)
    entityController.removeEntity(this.engageAttackTrigger)
    entityController.removeEntity(this.entity)
  }

  create(): void {
    // Respawn the chicken at a new random position
    console.log('Chicken respawning at new position')
    this.loadTransformation() // This will set a new random position
    this.health = DEFAULT_HP // Reset health
    this.isDead = false
    this.isDeadAnimation = false
    console.log(
      'Chicken respawned with health:',
      this.health,
      'isDead:',
      this.isDead
    )
  }
}
