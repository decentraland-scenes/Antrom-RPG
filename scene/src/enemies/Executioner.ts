import {
  Transform,
  GltfContainer,
  AudioSource,
  Animator,
  engine,
  MeshRenderer,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'
import { BannerType } from '../ui/banner/bannerConstants'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { entityController } from '../realms/entityController'
import MonsterMobAuto from './monsterMobAuto'
import { ROAMING_CONFIGS, MonsterRoaming } from './monsterRoaming'
import { MonsterAttack } from './monsterAttack'
import { MonsterAttackRanged } from './monsterAttackRanged'
import * as utils from '@dcl-sdk/utils'

function getRandomIntRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class Executioner extends MonsterMobAuto {
  shapeFile = 'assets/models/ExecutionerAxe.glb'
  hoverText: string
  private roamingSystem: MonsterRoaming | null = null
  private isEngaged: boolean = false
  constructor() {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 2
    super(level + 20, level + 60, level - 10, level * 100, 0.01, 7, 2.5)
    this.minLuck = 10
    this.hoverText = `Attack LVL ${level} Executioner!`

    // Set initial position first
    this.loadTransformation()

    // Then initialize monster with correct position
    this.initMonster()

    // this.setTopOffset(2.55)
    this.dropRate = -1
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

    // TODO
    // DailyQuestHUD.getInstance().listenAndUpdateForAnyActiveQuest(
    //     LEVEL_TYPES.ENEMY
    // )
  }

  initMonster(): void {
    console.log('init executioner')
    if (!this.shape && this.shapeFile) {
      this.shape = this.shapeFile
      GltfContainer.createOrReplace(this.entity, { src: this.shape })
    }
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/attack.mp3',
      loop: false
    })
    if (this.audioFile) {
      // const clip = new AudioClip(this.audioFile)
      // this.sound = new AudioSource(clip)
      // this.addComponentOrReplace(this.sound)
    }
    GltfContainer.createOrReplace(this.entity, { src: this.shape })

    // Create animator with explicit settings
    const animator = Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: this.idleClip,
          playing: true,
          loop: true,
          speed: 1
        },
        {
          clip: this.attackClip,
          playing: false,
          loop: false,
          speed: 1
        },
        {
          clip: this.walkClip,
          playing: false,
          loop: true,
          speed: 1
        },
        {
          clip: this.impactClip,
          playing: false,
          loop: false,
          speed: 1
        },
        {
          clip: this.dieClip,
          playing: false,
          loop: false,
          speed: 1
        }
      ]
    })

    console.log(
      'Animator created with states:',
      animator.states.map((state) => state.clip)
    )

    this.setupEngageTriggerBox()
    this.setupAttackTriggerBox()
    this.setupRangedAttackTriggerBox()

    // Use aggressive roaming configuration for executioners
    this.attackSystem = new MonsterAttack(this, {
      moveSpeed: 2.5,
      engageDistance: this.engageDistance,
      roaming: {
        ...ROAMING_CONFIGS.aggressive,
        roamRadius: 15,
        roamSpeed: 1.2,
        idleTime: 2,
        maxRoamDistance: 20
      }
    })

    this.attackSystemRanged = new MonsterAttackRanged(this, {
      moveSpeed: 2.5,
      engageDistance: this.engageDistance
    })

    this.setupAttackHandler()
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
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })

    // Store the initial position for roaming system
    this.initialPosition = initialPosition

    // Initialize dedicated roaming system
    this.roamingSystem = new MonsterRoaming(
      this.entity,
      initialPosition,
      {
        ...ROAMING_CONFIGS.aggressive,
        roamRadius: 15,
        roamSpeed: 1.2,
        idleTime: 2,
        maxRoamDistance: 20
      },
      this.walkClip, // Use the actual walk clip
      this.idleClip
    )

    // Add roaming system to engine
    engine.addSystem(this.roamingUpdateSystem.bind(this))
  }

  private roamingUpdateSystem(dt: number): void {
    // Only roam when not engaged with player
    if (!this.isEngaged && this.roamingSystem && !this.isDeadAnimation) {
      // console.log(
      //   'Executioner roaming update - engaged:',
      //   this.isEngaged,
      //   'dead:',
      //   this.isDeadAnimation
      // )
      this.roamingSystem.update(dt)
    }
  }

  // Override the engage trigger to track engagement state
  setupEngageTriggerBox(): void {
    this.engageAttackTrigger = entityController.addEntity()
    Transform.create(this.engageAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.engageAttackTrigger)
    VisibilityComponent.create(this.engageAttackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.engageAttackTrigger,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(15, 2, 15) }],
      () => {
        if (this.isDeadAnimation) return
        this.isEngaged = true
        this.createHealthBar()
        // Start attack system immediately
        engine.addSystem(this.attackSystem.attackSystem.bind(this.attackSystem))
        // Start first attack
        this.handleAttack()
      },
      () => {
        if (this.isDeadAnimation) return
        this.isEngaged = false
        this.cleanup()
        engine.removeSystem(
          this.attackSystem.attackSystem.bind(this.attackSystem)
        )
        Animator.stopAllAnimations(this.entity)
        Animator.playSingleAnimation(this.entity, this.idleClip)
      }
    )
  }

  removeEntity(): void {
    // Remove roaming system from engine
    engine.removeSystem(this.roamingUpdateSystem.bind(this))

    super.cleanup()
    entityController.removeEntity(this.rangeAttackTrigger)
    entityController.removeEntity(this.engageAttackTrigger)
    entityController.removeEntity(this.entity)
  }

  create(): void {
    // TODO: this is not being added to the entities list
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newChar = new Executioner()
  }
}
