import { Quaternion, Vector3 } from '@dcl/sdk/math'
import MonsterMeat from './monsterMeat'
import { GltfContainer, Transform } from '@dcl/sdk/ecs'
import { getRandomIntRange } from './../utils/getRandomInt'

const DEFAULT_ATTACK = 2
const DEFAULT_XP = 10
const DEFAULT_LEVEL = 5
const DEFAULT_HP = 10

export default class Pig extends MonsterMeat {
  shapeFile = 'assets/models/pig.glb'

  // audioFile = "assets/sounds/chicken.mp3"
  hoverText = 'Attack Pig!'

  constructor() {
    super(DEFAULT_ATTACK, DEFAULT_XP, DEFAULT_LEVEL, DEFAULT_HP, 1, 4)
    this.initMonster()
    this.shape = this.shapeFile
    GltfContainer.createOrReplace(this.entity, { src: this.shape })
    this.isPrey = true
    this.minLuck = -1000
  }

  create(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mons = new Pig()
  }

  onDropXp(): void {
    // TODO PLAYER
    // log("onDropXp - Chicken")
    // if (player.levels.getLevel(LEVEL_TYPES.PLAYER) <= 5) {
    //     player.levels.addXp(LEVEL_TYPES.PLAYER, 20)
    // } else {
    //     player.levels.addXp(LEVEL_TYPES.PLAYER, this.xp)
    // }
    // player.levels.addXp(LEVEL_TYPES.MEAT, 1)
    // showGetXPIcon()
    // log("onDrop - Chicken")
    // const isWearableFound = checkWearableInUserData(
    //     //Butcher
    //     "0x855ec57cc60c28187a021a3757a80ac4758e0b06:0"
    // )
    // if ((await isWearableFound) === true) {
    //     player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 2)
    //     showGetBonusMeatIcon()
    //     DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
    //         ITEM_TYPES.CHICKEN,
    //         2
    //     )
    // } else {
    //     player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 2)
    //     showGetMeatIcon()
    //     DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
    //         ITEM_TYPES.CHICKEN,
    //         1
    //     )
    // }
    // if (getRandomInt(10) === 1) {
    //     player.inventory.incrementItem(ITEM_TYPES.EGG)
    // }
    // player.writeDataToServer()
  }

  async onDropLoot(): Promise<void> {}

  setupAttackTriggerBox(): void {
    // super.setupAttackTriggerBox(new utils.TriggerSphereShape(4))
  }

  loadTransformation(): void {
    const initialPosition = Vector3.create(
      getRandomIntRange(1, 31),
      0,
      getRandomIntRange(0, 24)
    )
    const initialRotation = Quaternion.fromEulerDegrees(0, 80, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })
  }
}
