import { MonsterOligar } from './monster'

const DEFAULT_ATTACK = 4
const DEFAULT_XP = 45
const DEFAULT_LEVEL = 15
const DEFAULT_HP = 16

export default class AntromGuard extends MonsterOligar {
  shapeFile = 'assets/models/KnightSword.glb'
  hoverText = 'Attack Antrom Guard!'
  constructor() {
    super(DEFAULT_ATTACK, DEFAULT_XP, DEFAULT_LEVEL, DEFAULT_HP)

    this.initMonster()
    this.setTopOffset(2.25)
  }

  // onDropXp() {
  //     player.levels.addXp(LEVEL_TYPES.PLAYER, this.xp)
  //     player.levels.addXp(LEVEL_TYPES.ENEMY, 1)
  //     showGetXPIcon()
  //     player.writeDataToServer()
  // }

  // onDropLoot() {
  //     player.inventory.incrementItem(ITEM_TYPES.BONE, 2)
  //     player.writeDataToServer()
  //     log("on drop here")
  // }

  // setupAttackTriggerBox(): void {
  //     super.setupAttackTriggerBox(new utils.TriggerSphereShape(4))
  // }

  // create(): void {
  //     // const mons = new AntromGuard()
  //     // engine.addEntity(mons)
  // }

  // loadTransformation(): void {
  //     let initialTransform = new Transform({
  //         position: new Vector3(
  //             getRandomInt(16) + 12,
  //             6.7,
  //             getRandomInt(14) + 67
  //         ),
  //         rotation: new Quaternion(
  //             0,
  //             getRandomInt(10) / 10 + getRandomInt(4),
  //             0,
  //             1
  //         ),
  //     })
  //     this.initialPosition = initialTransform.position.clone()
  //     this.addComponent(initialTransform)
  // }
}
