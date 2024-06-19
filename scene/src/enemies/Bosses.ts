import { movePlayerTo } from '~system/RestrictedActions'
import { MonsterOligar } from './monster'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Transform } from '@dcl/sdk/ecs'

const DEFAULT_ATTACK = 0
const DEFAULT_XP = 1500
const DEFAULT_LEVEL = 0 // player.levels.getLevel(LEVEL_TYPES.PLAYER)
const DEFAULT_HP = 0

// const MODEL_NAMES = [
//     "assets/models/SkeletonSword.glb",
//     "assets/models/SkeletonSword.glb",
//     "assets/models/SkeletonwBow.glb",
//     "assets/models/Executioner.glb",
//     "assets/models/ExecutionerAxe.glb",
//     "assets/models/DarkKnight.glb",
//     "assets/models/Chicken.glb",
//     "assets/models/Ghost.glb",
//     "assets/models/KnightSword.glb",
//     "assets/models/RockMonster.glb",
//     "assets/models/Sceleton.glb",
//     "assets/models/TreeMonster.glb",
//     "assets/models/Turkey.glb",
//     "assets/models/zombie.glb",
//     "assets/models/Undeadking.glb",
// ]
const MODEL_NAMES = [
  'assets/models/ExecutionerAxe.glb',
  'assets/models/ExecutionerAxe.glb',
  'assets/models/ExecutionerAxe.glb',
  'assets/models/ExecutionerAxe.glb',
  'assets/models/ExecutionerAxe.glb',
  'assets/models/ExecutionerAxe.glb'
]

function getRandomIntRange(min: number, max: number):number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class Bosses extends MonsterOligar {
  shapeFile = 'assets/models/Oligar.glb'
  hoverText = `Attack LVL 99999 Oligar!`
  minLuck = 50
  static currentModelIndex: number = 0
  static currentStage: number = 1
  static canCreate(): boolean {
    return Bosses.currentModelIndex < MODEL_NAMES.length
  }

  static currentInstance: Bosses

  constructor() {
    if (!Bosses.canCreate()) {
      throw new Error(
        `No more models available for Oligar! ${Bosses.currentModelIndex}`
      )
    }
    const stage = Bosses.currentStage
    super(
      Math.round(DEFAULT_ATTACK + stage * 1.75),
      Math.round(DEFAULT_XP + stage * 4),
      Math.round(DEFAULT_LEVEL + stage * 0.25),
      Math.round(DEFAULT_HP + stage * 60)
    )
    this.shapeFile = MODEL_NAMES[Bosses.currentModelIndex]
    Bosses.currentModelIndex++
    this.initMonster()
    this.topOffSet = 2.55
    this.dropRate = 0
    // ui.displayAnnouncement(
    //     `total: ${Bosses.currentModelIndex} max: ${MODEL_NAMES.length}`
    // )
    Bosses.currentInstance = this
    this.loadTransformation()
    // Billboard.create(this.entity, {})
  }

  onDropXp():void {
    void movePlayerTo({ newRelativePosition: Vector3.create(77.12, 6.61, 27.78) })
    // Oligar.currentStage++
    if (!Bosses.canCreate()) {
      // ui.displayAnnouncement("You WIN")
      /// /player.inventory.incrementItem(ITEM_TYPES.OLIGAR_HEAD, 1)

      Bosses.currentStage = 1
      // engine.removeEntity(Bosses.currentInstance)
      // Bosses.currentInstance = null // Reset the reference
    }
  }

  onDropLoot(): void {}

  create(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mons = new Bosses()
    // engine.addEntity(mons)
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(getRandomIntRange(1, 28), 0.88, 14)
    const initialRotation = Quaternion.fromEulerDegrees(0, 80, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }
}
