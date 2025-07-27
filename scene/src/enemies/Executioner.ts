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
  private isConfrontedByFighter: boolean = false
  private lastFighterCheck: number = 0
  private fighterCheckInterval: number = 1000 // Check for fighters every 1 second
  private attackingFighter: any = null // Track which fighter is attacking
  private lastAttackedBy: any = null // Track which fighter last attacked
  private lastAttackTime: number = 0 // Track when last attacked
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

  reduceHealth(attack: number): void {
    console.log('Executioner.reduceHealth called with attack:', attack)
    console.log('Executioner health before damage:', this.health)
    console.log('Executioner isEngaged:', this.isEngaged)
    console.log('Executioner isDead:', this.isDead)
    console.log('Executioner isDeadAnimation:', this.isDeadAnimation)

    // Track which fighter attacked us
    this.lastAttackedBy = this.attackingFighter
    this.lastAttackTime = Date.now()

    // Face the attacking fighter if we know which one it is
    if (this.attackingFighter && !this.isDeadAnimation) {
      try {
        const executionerTransform = Transform.get(this.entity)
        const direction = Vector3.subtract(
          this.attackingFighter.position,
          executionerTransform.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)
        console.log('Executioner facing attacking fighter')
      } catch (error) {
        console.log('Error facing fighter during damage:', error)
      }
    }

    // Play impact animation when taking damage from fighter (unless dying)
    if (!this.isDeadAnimation && this.health > attack) {
      try {
        const impactAnim = Animator.getClip(this.entity, this.impactClip)
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)

        console.log('Executioner impact animation states:', {
          idlePlaying: idleAnim?.playing,
          walkPlaying: walkAnim?.playing,
          impactPlaying: impactAnim?.playing
        })

        // Stop other animations and play impact (following animation learnings)
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
          console.log('Executioner: Stopped idle animation for impact')
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Executioner: Stopped walk animation for impact')
        }
        if (impactAnim && !impactAnim.playing) {
          impactAnim.playing = true
          console.log('Executioner: Started impact animation')
        }

        // Return to idle after impact animation (1.5 seconds)
        utils.timers.setTimeout(() => {
          console.log(
            'Executioner: Impact animation timeout, returning to idle'
          )
          if (impactAnim && impactAnim.playing) {
            impactAnim.playing = false
            console.log('Executioner: Stopped impact animation')
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
            console.log('Executioner: Started idle animation after impact')
          }
        }, 1500)
      } catch (error) {
        console.log('Error playing executioner impact animation:', error)
      }
    }

    // Call the base reduceHealth method
    super.reduceHealth(attack)

    console.log('Executioner health after damage:', this.health)

    // Update the health bar to show the damage
    this.updateHealthBar()

    // Check if executioner died and handle death properly
    if (this.health <= 0 && !this.isDead) {
      console.log('Executioner died, calling onDead()')
      this.isDead = true

      // Remove roaming system immediately to prevent errors
      engine.removeSystem(this.roamingUpdateSystem.bind(this))

      // Play death animation first
      Animator.playSingleAnimation(this.entity, this.dieClip)

      // Remove entity after death animation completes
      utils.timers.setTimeout(() => {
        console.log('Removing dead executioner entity after animation')
        entityController.removeEntity(this.entity)
        if (this.rangeAttackTrigger) {
          entityController.removeEntity(this.rangeAttackTrigger)
        }
        if (this.engageAttackTrigger) {
          entityController.removeEntity(this.engageAttackTrigger)
        }
      }, 5000) // 5 seconds for death animation

      this.onDead()
    }

    console.log('Health bar updated')
  }

  onDropXp(): void {
    const player = Player.getInstance()
    const xp = getRandomIntRange(this.xp, this.xp + 10)

    // 10% chance for potion drop
    const randomNumber = Math.random()
    if (randomNumber <= 0.1) {
      player.gameController.uiController.displayAnnouncement(
        '+1 POTIONS',
        Color4.Yellow(),
        3000
      )
      player.inventory.incrementItem(ITEM_TYPES.POTION, 1)
    }

    // 50% chance for coin drop (same as fighters)
    const coinDropChance = Math.random()
    if (coinDropChance <= 0.5) {
      const coinAmount = Math.floor(Math.random() * 5) + 1 // 1-5 coins
      player.inventory.incrementItem(ITEM_TYPES.COIN, coinAmount)
      player.gameController.uiController.displayAnnouncement(
        `+${coinAmount} COINS`,
        Color4.Yellow(),
        3000
      )
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

    // Make executioner combat-ready from the start
    console.log('Creating health bar for executioner')
    this.createHealthBar()
    console.log('Health bar created for executioner')

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
        roamSpeed: 0.8, // Slower movement for more dramatic confrontations
        idleTime: 3, // Longer idle time
        maxRoamDistance: 20
      },
      this.walkClip, // Use the actual walk clip
      this.idleClip
    )

    // Add roaming system to engine
    engine.addSystem(this.roamingUpdateSystem.bind(this))
  }

  private checkForNearbyFighters(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Safety check: Make sure executioner entity still exists and has Transform
    try {
      const executionerTransform = Transform.get(this.entity)
      if (!executionerTransform) {
        console.log('Executioner entity missing Transform component')
        return
      }
    } catch (error) {
      console.log('Executioner entity not found or invalid:', error)
      return
    }

    // Get all fighters from the player
    const fighters = player.fighters || []
    let nearbyFighter = false
    let closestFighter = null
    let closestDistance = Infinity

    for (const fighter of fighters) {
      if (fighter && !fighter.isDead) {
        try {
          const executionerTransform = Transform.get(this.entity)
          const distance = Vector3.distance(
            executionerTransform.position,
            fighter.position
          )
          if (distance <= 10) {
            // 10 unit detection range
            nearbyFighter = true
            if (distance < closestDistance) {
              closestDistance = distance
              closestFighter = fighter
            }
          }
        } catch (error) {
          console.log('Error checking fighter distance:', error)
          continue
        }
      }
    }

    this.isConfrontedByFighter = nearbyFighter
    this.attackingFighter = closestFighter

    // Face the fighter that last attacked us, or the closest one if none has attacked recently
    const currentTime = Date.now()
    const timeSinceLastAttack = currentTime - this.lastAttackTime

    if (
      this.lastAttackedBy &&
      timeSinceLastAttack < 3000 &&
      !this.isDeadAnimation
    ) {
      // Face the fighter that last attacked us (for 3 seconds)
      try {
        const executionerTransform = Transform.get(this.entity)
        const direction = Vector3.subtract(
          this.lastAttackedBy.position,
          executionerTransform.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)
      } catch (error) {
        console.log('Error facing last attacker:', error)
      }
    } else if (this.attackingFighter && !this.isDeadAnimation) {
      // Face the closest fighter if no recent attacker
      try {
        const executionerTransform = Transform.get(this.entity)
        const direction = Vector3.subtract(
          this.attackingFighter.position,
          executionerTransform.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)
      } catch (error) {
        console.log('Error facing closest fighter:', error)
      }
    }
  }

  private roamingUpdateSystem(dt: number): void {
    // Safety check: Make sure executioner entity still exists and is not dead
    if (this.isDead || this.isDeadAnimation) {
      return // Don't update if dead
    }

    try {
      const executionerTransform = Transform.get(this.entity)
      if (!executionerTransform) {
        console.log(
          'Executioner roaming system: Entity missing Transform component'
        )
        return
      }
    } catch (error) {
      console.log(
        'Executioner roaming system: Entity not found or invalid:',
        error
      )
      return
    }

    const currentTime = Date.now()

    // Check for nearby fighters periodically
    if (currentTime - this.lastFighterCheck >= this.fighterCheckInterval) {
      this.checkForNearbyFighters()
      this.lastFighterCheck = currentTime
    }

    // Only roam when not engaged with player and not confronted by fighter
    if (
      !this.isEngaged &&
      !this.isConfrontedByFighter &&
      this.roamingSystem &&
      !this.isDeadAnimation
    ) {
      this.roamingSystem.update(dt)
    } else if (this.isConfrontedByFighter && !this.isDeadAnimation) {
      // Stop moving and play idle animation when confronted by fighter
      try {
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)

        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
        }
        if (idleAnim && !idleAnim.playing) {
          idleAnim.playing = true
        }
      } catch (error) {
        console.log('Error updating executioner animations:', error)
      }
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

    // Clear all references to prevent memory leaks
    this.roamingSystem = null
    this.attackingFighter = null
    this.lastAttackedBy = null

    super.cleanup()
    entityController.removeEntity(this.rangeAttackTrigger)
    entityController.removeEntity(this.engageAttackTrigger)
    entityController.removeEntity(this.entity)
  }

  create(): void {
    const newChar = new Executioner()

    // Add the new executioner to the antrom realm's executioners array
    const player = Player.getInstanceOrNull()
    if (player && player.gameController.realmController.currentRealm) {
      const currentRealm = player.gameController.realmController.currentRealm
      if (currentRealm.getId() === 'antrom') {
        // Remove this dead executioner from the array
        const executioners = (currentRealm as any).executioners || []
        const deadIndex = executioners.indexOf(this)
        if (deadIndex !== -1) {
          executioners.splice(deadIndex, 1)
          console.log('Dead executioner removed from array')
        }

        // Add the new executioner to the array
        executioners.push(newChar)
        console.log('New executioner spawned and added to array')
      }
    }
  }
}
