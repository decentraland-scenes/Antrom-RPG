import {
  Animator,
  AudioSource,
  engine,
  GltfContainer,
  InputAction,
  inputSystem,
  PointerEvents,
  PointerEventType,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { getUserData } from '~system/UserIdentity'
import { type GameController } from './controllers/game.controller'
import { ITEM_TYPES } from './inventory/playerInventoryMap'
import { INVENTORY_ACTION_REASONS } from './inventory/reducer'
import { LEVEL_TYPES } from './player/LevelManager'
import { Player } from './player/player'
import { entityController } from './realms/entityController'
import { BannerType } from './ui/banner/bannerConstants'
import { CharacterClasses } from './ui/creation-player/creationPlayerData'
import { getRandomInt, getRandomIntRange } from './utils/getRandomInt'
import { setTimeout } from './utils/lib'
import { refreshtimer, setRefreshTimer } from './utils/refresherTimer'

export type MineableType = {
  shape: string
  audioClipUrl: string
  hoverText: string
  maxDistance: number
  timeout: number
  action: string
}

export const mineables: Record<string, MineableType> = {
  tree: {
    shape: 'assets/models/Pine.glb',
    audioClipUrl: 'assets/sounds/tree.mp3',
    hoverText: 'Chop Tree!',
    maxDistance: 5,
    timeout: 3.2,
    action: 'chop'
  },
  rock: {
    shape: 'assets/models/mining.glb',
    audioClipUrl: 'assets/sounds/rock.mp3',
    hoverText: 'Mine Rock!',
    maxDistance: 7,
    timeout: 6.2,
    action: 'mine'
  },
  berryTree: {
    shape: 'assets/models/Berries.glb',
    audioClipUrl: 'assets/sounds/berryPicking.mp3',
    hoverText: 'Shake Tree!',
    maxDistance: 7,
    timeout: 2,
    action: 'gather'
  },
  tree2: {
    shape: 'assets/models/Pine.glb',
    audioClipUrl: 'assets/sounds/tree.mp3',
    hoverText: 'Chop Tree!',
    maxDistance: 5,
    timeout: 3.2,
    action: 'chop'
  },
  pot: {
    shape: 'assets/models/pot.glb',
    audioClipUrl: 'assets/sounds/pot.mp3',
    hoverText: 'Smash Pot!',
    maxDistance: 5,
    timeout: 2,
    action: 'action'
  },
  gem: {
    shape: 'assets/models/gem.glb',
    audioClipUrl: 'assets/sounds/mining.mp3',
    hoverText: 'Mine Crystal!',
    maxDistance: 7,
    timeout: 2,
    action: 'action'
  }
}

export class MineableItem {
  public mineable = entityController.addEntity()
  private isDead: boolean = false
  private isDeadAnimation: boolean = false
  gameController: GameController
  mineableType: MineableType

  constructor(
    mineableType: MineableType,
    gameController: GameController,
    x?: number,
    y?: number,
    z?: number
  ) {
    this.mineableType = mineableType
    this.gameController = gameController
    GltfContainer.create(this.mineable, { src: mineableType.shape })

    if (x === undefined) x = 0
    if (y === undefined) y = 0
    if (z === undefined) z = 0

    let position: Vector3 = Vector3.create(x, y, z)
    let scale: Vector3 = Vector3.One()
    const rotation: Quaternion = Quaternion.create(
      0,
      getRandomInt(10) / 10 + getRandomInt(4),
      0,
      1
    )

    if (mineableType === mineables.berryTree) {
      position = Vector3.create(
        getRandomIntRange(-40, 8),
        2,
        getRandomIntRange(49, 93)
      )
      const randomScale = getRandomIntRange(1, 2)
      scale = Vector3.create(randomScale, randomScale, randomScale)
    }

    if (mineableType === mineables.gem) {
      position = Vector3.create(
        getRandomInt(12) + 24,
        3.06,
        getRandomInt(14) + 38
      )
      scale = Vector3.create(0.04, 0.04, 0.04)
    }

    if (mineableType === mineables.rock) {
      position = Vector3.create(x, y - 1, z)
    }

    Transform.create(this.mineable, {
      position,
      scale,
      rotation
    })
    AudioSource.create(this.mineable, {
      audioClipUrl: mineableType.audioClipUrl
    })
    Animator.create(this.mineable, {
      states: [
        {
          clip: 'idle',
          playing: true
        },
        {
          clip: 'mine',
          playing: false,
          loop: false
        },
        {
          clip: 'chop',
          playing: false,
          loop: true
        },
        {
          clip: 'action',
          playing: false,
          loop: false
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

  isDeadOnce(): void {
    if (!this.isDead) this.killChar()
  }

  removeMineable(): void {
    entityController.removeEntity(this.mineable)
  }

  killChar(): void {
    entityController.removeEntity(this.mineable)
    if (this.mineableType === mineables.rock) {
      this.mineable = entityController.addEntity()
      Transform.createOrReplace(this.mineable, {
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
    }
    if (this.mineableType === mineables.tree) {
      this.mineable = entityController.addEntity()
      Transform.createOrReplace(this.mineable, {
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
    }
    if (this.mineableType === mineables.gem) {
      this.mineable = entityController.addEntity()
      Transform.createOrReplace(this.mineable, {
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
    }
    this.isDead = true
  }

  battle(): void {
    PointerEvents.createOrReplace(this.mineable, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: this.mineableType.hoverText,
            maxDistance: this.mineableType.maxDistance
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.mineable
        )
      ) {
        if (refreshtimer <= 0 && !this.checkIfIsWorking()) {
          if (
            this.mineableType === mineables.rock ||
            this.mineableType === mineables.tree
          ) {
            Animator.playSingleAnimation(
              this.mineable,
              this.mineableType.action
            )
            AudioSource.playSound(this.mineable, this.mineableType.audioClipUrl)
            this.setWorking(true)
            setRefreshTimer(1.5)
            setTimeout(() => {
              void this.dyingAnimation()
              this.isDeadOnce()
              this.setWorking(false)
            }, this.mineableType.timeout * 1000)
          }
          if (
            this.mineableType === mineables.pot ||
            this.mineableType === mineables.gem
          ) {
            Animator.playSingleAnimation(
              this.mineable,
              this.mineableType.action
            )
            AudioSource.playSound(this.mineable, this.mineableType.audioClipUrl)
            this.setWorking(true)
            setRefreshTimer(1.5)
            void this.dyingAnimation()
            setTimeout(() => {
              this.isDeadOnce()
              this.setWorking(false)
            }, this.mineableType.timeout * 1000)
          }
        }
      }
    })
  }

  callDyingAnimation(): void {
    if (!this.isDeadAnimation) void this.dyingAnimation()
  }

  async dyingAnimation(): Promise<void> {
    const userData = await getUserData({})
    const player = Player.getInstance()

    if (this.mineableType === mineables.gem) {
      let result1 = false
      if (userData.data?.avatar !== undefined) {
        for (const wearable of userData.data?.avatar?.wearables) {
          if (
            wearable ===
            'urn:decentraland:matic:collections-v2:0x0e9663c4b53ed79b343739b5bafab89666ee8ba3:0'
          ) {
            result1 = true
          }
        }
      }
      let result2 = false
      if (userData.data?.avatar !== undefined) {
        for (const wearable of userData.data?.avatar?.wearables) {
          if (
            wearable ===
            'urn:decentraland:matic:collections-v2:0x0e9663c4b53ed79b343739b5bafab89666ee8ba3:1'
          ) {
            result2 = true
          }
        }
      }

      if (result1 && result2) {
        this.gameController.uiController.displayAnnouncement(
          '+4 CRYSTAL',
          Color4.Yellow(),
          3000
        )
        player.inventory.incrementItem(
          ITEM_TYPES.CRYSTAL,
          4,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
      } else {
        this.gameController.uiController.displayAnnouncement(
          '+2 CRYSTAL',
          Color4.Yellow(),
          3000
        )
        player.inventory.incrementItem(
          ITEM_TYPES.CRYSTAL,
          2,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
      }
      player.levels.addXp(LEVEL_TYPES.ROCK, 10)
    }

    if (this.mineableType === mineables.pot) {
      if (player.class === CharacterClasses.CC_THIEF) {
        player.inventory.incrementItem(
          ITEM_TYPES.COIN,
          20,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayAnnouncement(
          '+20 COINS',
          Color4.Yellow(),
          3000
        )
      } else {
        player.inventory.incrementItem(
          ITEM_TYPES.COIN,
          10,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayAnnouncement(
          '+10 COINS',
          Color4.Yellow(),
          3000
        )
      }
    }

    if (
      this.mineableType === mineables.tree ||
      this.mineableType === mineables.tree2
    ) {
      let result = false
      if (userData.data?.avatar !== undefined) {
        for (const wearable of userData.data?.avatar?.wearables) {
          if (
            wearable ===
            'urn:decentraland:matic:collections-v2:0x844a933934fba88434dfade0b04b1d211e92d7c4:1'
          ) {
            result = true
          }
        }
      }

      if (result) {
        player.inventory.incrementItem(
          ITEM_TYPES.TREE,
          8,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayBanner(BannerType.B_WOOD_PLUS)
      } else {
        player.inventory.incrementItem(
          ITEM_TYPES.TREE,
          5,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayBanner(BannerType.B_WOOD)
      }
      player.levels.addXp(LEVEL_TYPES.TREE, 5)
    }

    if (this.mineableType === mineables.rock) {
      let result1 = false
      if (userData.data?.avatar !== undefined) {
        for (const wearable of userData.data?.avatar?.wearables) {
          if (
            wearable ===
            'urn:decentraland:matic:collections-v2:0x874f0520102f4980c23dec3ea7c309a4031a6286:0'
          ) {
            result1 = true
          }
        }
      }

      let result2 = false
      if (userData.data?.avatar !== undefined) {
        for (const wearable of userData.data?.avatar?.wearables) {
          if (
            wearable ===
            'urn:decentraland:matic:collections-v2:0xb2bebd43a93e4b9cddb2d2e47202f335029d8d32:0'
          ) {
            result2 = true
          }
        }
      }

      let result3 = false
      if (userData.data?.avatar !== undefined) {
        for (const wearable of userData.data?.avatar?.wearables) {
          if (
            wearable ===
            'urn:decentraland:matic:collections-v2:0xf0b49e0f1b6ac8d06808d9e7c5b5ef91700b1f7d:0'
          ) {
            result3 = true
          }
        }
      }

      if (result1) {
        player.inventory.incrementItem(
          ITEM_TYPES.ROCK,
          5 + 1,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayBanner(BannerType.B_IRON_PLUS)
      } else {
        player.inventory.incrementItem(
          ITEM_TYPES.ROCK,
          5,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayBanner(BannerType.B_IRON)
      }
      if (result2) {
        player.inventory.incrementItem(
          ITEM_TYPES.ROCK,
          5 + 1,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayBanner(BannerType.B_IRON_PLUS)
      }
      if (result3) {
        player.inventory.incrementItem(
          ITEM_TYPES.ROCK,
          5 + 1,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
        this.gameController.uiController.displayBanner(BannerType.B_IRON_PLUS)
      }
      if (getRandomInt(5) === 1) {
        player.inventory.incrementItem(
          ITEM_TYPES.CRYSTAL,
          1,
          INVENTORY_ACTION_REASONS.MINED_RESOURCE
        )
      }

      player.levels.addXp(LEVEL_TYPES.ROCK, 5)
    }

    this.isDeadAnimation = true
    // player.writeDataToServer()
  }

  checkIfIsWorking(): boolean {
    const player = Player.getInstance()
    switch (this.mineableType) {
      case mineables.rock:
        return player.isMining
      case mineables.tree:
        return player.isChoppingTree
      case mineables.tree2:
        return player.isChoppingTree
      case mineables.berryTree:
        return player.isShakingTree
      case mineables.gem:
        return player.isMining
    }
    return false
  }

  setWorking(bool: boolean): void {
    const player = Player.getInstance()
    switch (this.mineableType) {
      case mineables.rock:
        player.isMining = bool
        break
      case mineables.tree:
        player.isChoppingTree = bool
        break
      case mineables.tree2:
        player.isChoppingTree = bool
        break
      case mineables.berryTree:
        player.isShakingTree = bool
        break
      case mineables.gem:
        player.isMining = bool
        break
    }
  }
}
