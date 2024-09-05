import {
  engine,
  GltfContainer,
  Transform,
  AudioSource,
  Animator,
  PointerEvents,
  PointerEventType,
  InputAction,
  inputSystem,
  pointerEventsSystem,
  type Entity
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { getRandomInt, getRandomIntRange } from './utils/getRandomInt'
import { type GameController } from './controllers/game.controller'
import { entityController } from './realms/entityController'
import { setRefreshTimer } from './utils/refresherTimer'
import { Player } from './player/player'
import { setTimeout } from './utils/lib'
import { ITEM_TYPES } from './inventory/playerInventoryMap'
import { LEVEL_TYPES } from './player/LevelManager'
import { getUserData } from '~system/UserIdentity'
import { BannerType } from './ui/banner/bannerConstants'

export enum Items {
  tree = 'assets/models/Pine.glb',
  rock = 'assets/models/mining.glb',
  berryTree = 'assets/models/Berries.glb',
  fishing = 'assets/models/Fishing.glb',
  tree2 = 'assets/models/Pine.glb',
  pot = 'assets/models/pot.glb',
  gem = 'assets/models/gem.glb'
}
export class Rock {
  public rock = entityController.addEntity()
  gameController: GameController
  private isDead: boolean = false

  constructor(
    gameController: GameController,
    rockShape: string,
    x: number,
    y: number,
    z: number
  ) {
    this.gameController = gameController
    GltfContainer.create(this.rock, { src: rockShape })
    const y2 = y - 1
    Transform.create(this.rock, {
      position: Vector3.create(x, y2, z),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      )
    })
    AudioSource.create(this.rock, {
      audioClipUrl: 'assets/sounds/rock.mp3'
    })
    Animator.create(this.rock, {
      states: [
        {
          clip: 'idle',
          playing: true
        },
        {
          clip: 'mine',
          playing: false,
          loop: false
        }
      ]
    })
    this.battle()
  }

  battle(): void {
    PointerEvents.createOrReplace(this.rock, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Mine rock!',
            maxDistance: 7
          }
        }
      ]
    })
    engine.addSystem(() => {
      // const player = Player.getInstance()
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.rock
        )
      ) {
        // if (refreshtimer <= 0 && !player.isMining) {
        //     player.isMining = true
        //     setRefreshTimer(1.5)
        //     // callDyingAnimation()
        //     setTimeout(() => {
        //         this.isDeadOnce()
        //         player.isMining = false
        //     }, 9 * 1000)
        // }
      }
    })
  }

  isDeadOnce(): void {
    if (!this.isDead) this.killChar()
}

  removeRock(): void {
    entityController.removeEntity(this.rock)
  }

  killChar(): void {
    entityController.removeEntity(this.rock)
    this.rock = entityController.addEntity()
    Transform.createOrReplace(this.rock, {
      position: Vector3.create(
        getRandomInt(12) + 24,
        3.06,
        getRandomInt(14) + 38
      ),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      ),
      scale: Vector3.create(0.04, 0.04, 0.04)
    })
    this.isDead = true
  }

}

export class Tree {
  public tree = entityController.addEntity()
  public gameController: GameController
  private isDead: boolean = false
  private isDeadAnimation: boolean = false
  private readonly haveAnAxe: boolean = false
  constructor(
    gameController: GameController,
    treeShape: string,
    x: number,
    y: number,
    z: number
  ) {
    this.gameController = gameController
    GltfContainer.create(this.tree, { src: treeShape })
    Transform.create(this.tree, {
      position: Vector3.create(x, y, z),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      )
    })
    AudioSource.create(this.tree, {
      audioClipUrl: 'assets/sounds/tree.mp3'
    })
    Animator.create(this.tree, {
      states: [
        {
          clip: 'idle',
          playing: true
        },
        {
          clip: 'chop',
          playing: false,
          loop: false
        }
      ]
    })
    this.battle()
  }

  battle(): void {
    PointerEvents.createOrReplace(this.tree, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Chop tree!',
            maxDistance: 5
          }
        }
      ]
    })
    engine.addSystem(() => {

      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.tree
        )
      ) {

        // player.isChoppingTree = true
        setRefreshTimer(1.5)
        PointerEvents.deleteFrom(this.tree)
        setTimeout(() => {
          void this.dyingAnimation()
          this.isDeadOnce()
          // player.isChoppingTree = false
        }, 3 * 1000)
      }
    })
  }

  killChar(): void {
    entityController.removeEntity(this.tree)
    this.tree = entityController.addEntity()
    Transform.createOrReplace(this.tree, {
      position: Vector3.create(
        getRandomInt(12) + 24,
        3.06,
        getRandomInt(14) + 38
      ),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      ),
      scale: Vector3.create(0.04, 0.04, 0.04)
    })
    this.isDead = true
  }

  isDeadOnce(): void {
    if (!this.isDead) this.killChar()
  }

  // TODO
  async dyingAnimation(): Promise<void> {
    const userData = await getUserData({})

    let result = false
    if (userData.data?.avatar !== undefined) {
      for (const wearable of userData.data?.avatar?.wearables) {
        if (
            wearable ===
            "urn:decentraland:matic:collections-v2:0x844a933934fba88434dfade0b04b1d211e92d7c4:1"
        ) {
            result = true
        }
    }
    }

    const player = Player.getInstance()
    Animator.playSingleAnimation(this.tree, 'chop')
    AudioSource.playSound(this.tree, 'assets/sounds/tree.mp3')
    if (result) {
      player.inventory.incrementItem(ITEM_TYPES.TREE, 8)
      this.gameController.uiController.displayBanner(BannerType.B_WOOD_PLUS)
    } else {
      player.inventory.incrementItem(ITEM_TYPES.TREE, 5)
      this.gameController.uiController.displayBanner(BannerType.B_WOOD)

    }
      player.levels.addXp(LEVEL_TYPES.TREE, 5)
      this.isDeadAnimation = true
      // player.writeDataToServer()
    }

    callDyingAnimation(): void {
      if(!this.isDeadAnimation) void this.dyingAnimation()
    }

    removeTree(): void {
      entityController.removeEntity(this.tree)
    }
  }


export class BerryTree {
  public berryTree = entityController.addEntity()
  public gameController: GameController
  constructor(gameController: GameController, treeShape: string) {
    this.gameController = gameController
    const randomScale = getRandomIntRange(1, 2)
    GltfContainer.create(this.berryTree, { src: treeShape })
    Transform.create(this.berryTree, {
      position: Vector3.create(
        getRandomIntRange(-40, 8),
        2,
        getRandomIntRange(49, 93)
      ),
      scale: Vector3.create(randomScale, randomScale, randomScale),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      )
    })
    AudioSource.create(this.berryTree, {
      audioClipUrl: 'assets/sounds/berryPicking.mp3'
    })
    Animator.create(this.berryTree, {
      states: [
        {
          clip: 'idle',
          playing: true
        },
        {
          clip: 'gather',
          playing: false,
          loop: false
        }
      ]
    })
    this.battle()
  }

  battle(): void {
    PointerEvents.createOrReplace(this.berryTree, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Shake tree!',
            maxDistance: 7
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.berryTree
        )
      ) {
        // if (refreshtimer <= 0 && !player.isShakingTree) {
        //     player.isShakingTree = true
        //     setRefreshTimer(1.5)
        //     callDyingAnimation()
        //     setTimeout(3 * 1000, () => {
        //         isDeadOnce()
        //         player.isShakingTree = false
        //     })
        // }
      }
    })
  }

  removeBerryTree(): void {
    entityController.removeEntity(this.berryTree)
  }
}

export class Pot {
  public pot: Entity = entityController.addEntity()
  gameController: GameController
  constructor(
    gameController: GameController,
    potShape: string,
    x: number,
    y: number,
    z: number
  ) {
    this.gameController = gameController
    GltfContainer.create(this.pot, { src: potShape })
    Transform.create(this.pot, {
      // position: Vector3.clone(positions[getRandomInt(positions.length)]),
      position: Vector3.create(x, y, z),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      )
    })
    AudioSource.create(this.pot, {
      audioClipUrl: 'assets/sounds/pot.mp3'
    })
    Animator.create(this.pot, {
      states: [
        {
          clip: 'idle',
          playing: true
        },
        {
          clip: 'action',
          playing: true,
          loop: false
        }
      ]
    })
    pointerEventsSystem.onPointerDown(
      {
        entity: this.pot,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'Mine pot!',
          maxDistance: 7
        }
      },
      () => {
        Animator.playSingleAnimation(this.pot, 'action', false)
        console.log('mined')
      }
    )

    this.battle()
  }

  battle(): void {
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.pot
        )
      ) {
        /* empty */
      }
    })
  }

  removepot(): void {
    entityController.removeEntity(this.pot)
  }
}

export class Gem {
  public gem = entityController.addEntity()
  gameController: GameController
  private readonly isDeadAnimation: boolean = false
  private isDead: boolean = false
  constructor(gameController: GameController, gemShape: string) {
    this.gameController = gameController
    GltfContainer.create(this.gem, { src: gemShape })
    Transform.createOrReplace(this.gem, {
      position: Vector3.create(
        getRandomInt(12) + 24,
        3.06,
        getRandomInt(14) + 38
      ),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      ),
      scale: Vector3.create(0.04, 0.04, 0.04)
    })
    AudioSource.create(this.gem, {
      audioClipUrl: 'assets/sounds/mining.mp3'
    })
    Animator.create(this.gem, {
      states: [
        {
          clip: 'idle',
          playing: true
        },
        {
          clip: 'action',
          playing: false,
          loop: false
        }
      ]
    })
  }

  battle(): void {
    PointerEvents.createOrReplace(this.gem, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Mine crystal!',
            maxDistance: 7
          }
        }
      ]
    })
    engine.addSystem(() => {
      // const player = Player.getInstance()
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gem
        )
      ) {
        //   if (refreshtimer <= 0 && !player.isMining) {
        //     player.isMining = true
        //     setRefreshTimer(1.5)
        //     this.callDyingAnimation()
        //     setTimeout(() => {
        //         this.isDeadOnce()
        //         player.isMining = false
        //     }, 6 * 1000)
        // }
      }
    })
  }

  killChar(): void {
    entityController.removeEntity(this.gem)
    this.gem = entityController.addEntity()
    Transform.createOrReplace(this.gem, {
      position: Vector3.create(
        getRandomInt(12) + 24,
        3.06,
        getRandomInt(14) + 38
      ),
      rotation: Quaternion.create(
        0,
        getRandomInt(10) / 10 + getRandomInt(4),
        0,
        1
      ),
      scale: Vector3.create(0.04, 0.04, 0.04)
    })
    this.isDead = true
  }

  isDeadOnce(): void {
    if (!this.isDead) this.killChar()
  }

  // TODO
  async dyingAnimation(): Promise<void> {
    // Animator.playSingleAnimation(this.gem, 'action')
    // AudioSource.playSound(this.gem, 'assets/sounds/mining.mp3')
    // if (result1 === true && result2 === true) {
    //   this.gameController.uiController.displayAnnouncement(
    //     '+2 CRYSTAL',
    //     Color4.Red(),
    //     3000
    //   )
    //   // player.inventory.incrementItem(ITEM_TYPES.CRYSTAL, 2)
    // }
    // if (player.levels.getLevel(LEVEL_TYPES.ROCK) >= 0) {
    //   player.inventory.incrementItem(ITEM_TYPES.CRYSTAL, 2)
    //   player.levels.addXp(LEVEL_TYPES.ROCK, 10)
    // } else {
    //   ui.displayAnnouncement('Requires level 5 and higher mining level')
    // }
    // this.isDeadAnimation = true
    // player.writeDataToServer()
  }

  callDyingAnimation(): void {
    if (!this.isDeadAnimation) void this.dyingAnimation()
  }

  removeGem(): void {
    entityController.removeEntity(this.gem)
  }
}
