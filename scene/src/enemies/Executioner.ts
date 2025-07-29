import {
  Transform,
  GltfContainer,
  AudioSource,
  Animator,
  engine,
  MeshRenderer,
  VisibilityComponent,
  type Entity
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
  private lastFighterAttackTime: number = 0 // Track when last attacked fighter
  private fighterAttackInterval: number = 3000 // Attack fighters every 3 seconds (faster since turn-based)

  // Combat initiative system
  private combatState: 'idle' | 'approaching' | 'engaged' | 'disengaging' =
    'idle'
  private combatTarget: Entity | null = null
  private lastCombatAction: number = 0
  private combatActionInterval: number = 1500 // 1.5 seconds between combat actions (faster since only one attacks)
  private hasInitiative: boolean = false // Whether executioner has initiative in current combat
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

      // Play death animation with smart animation state management
      const dieAnim = Animator.getClip(this.entity, this.dieClip)
      const idleAnim = Animator.getClip(this.entity, this.idleClip)
      const walkAnim = Animator.getClip(this.entity, this.walkClip)
      const attackAnim = Animator.getClip(this.entity, this.attackClip)
      const impactAnim = Animator.getClip(this.entity, this.impactClip)

      console.log('Executioner death animation states:', {
        idlePlaying: idleAnim?.playing,
        walkPlaying: walkAnim?.playing,
        attackPlaying: attackAnim?.playing,
        impactPlaying: impactAnim?.playing,
        diePlaying: dieAnim?.playing
      })

      // Stop all other animations and start death - using smart animation state management
      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
        console.log('Executioner: Stopped idle animation for death')
      }
      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Executioner: Stopped walk animation for death')
      }
      if (attackAnim && attackAnim.playing) {
        attackAnim.playing = false
        console.log('Executioner: Stopped attack animation for death')
      }
      if (impactAnim && impactAnim.playing) {
        impactAnim.playing = false
        console.log('Executioner: Stopped impact animation for death')
      }
      if (dieAnim && !dieAnim.playing) {
        dieAnim.playing = true
        console.log('Executioner: Started death animation')
      }

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
    // Disable base class attack systems - executioners only attack gargoyle fountain
    // this.setupAttackTriggerBox()
    // this.setupRangedAttackTriggerBox()

    // Disable base class attack systems - executioners use custom targeting
    // this.attackSystem = new MonsterAttack(this, {
    //   moveSpeed: 2.5,
    //   engageDistance: this.engageDistance,
    //   roaming: {
    //     ...ROAMING_CONFIGS.aggressive,
    //     roamRadius: 15,
    //     roamSpeed: 1.2,
    //     idleTime: 2,
    //     maxRoamDistance: 20
    //   }
    // })

    // this.attackSystemRanged = new MonsterAttackRanged(this, {
    //   moveSpeed: 2.5,
    //   engageDistance: this.engageDistance
    // })

    // this.setupAttackHandler()
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

  private checkForNearbyTargets(): void {
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
    let nearbyTarget = false
    let closestTarget = null
    let closestDistance = Infinity
    let targetType: 'fighter' | 'gargoyle' = 'gargoyle'

    // Check for gargoyle fountain first (primary target)
    const currentRealm = player.gameController.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const gargoyleFountain = (currentRealm as any).gargoyleFountain
      if (gargoyleFountain && !gargoyleFountain.isDead) {
        try {
          const executionerTransform = Transform.get(this.entity)
          const gargoyleTransform = Transform.get(gargoyleFountain.entity)
          const distance = Vector3.distance(
            executionerTransform.position,
            gargoyleTransform.position
          )
          if (distance <= 20) {
            // Larger range for gargoyle (primary target)
            nearbyTarget = true
            if (distance < closestDistance) {
              closestDistance = distance
              closestTarget = gargoyleFountain
              targetType = 'gargoyle'
            }
          }
        } catch (error) {
          console.log('Error checking gargoyle distance:', error)
        }
      }
    }

    // Check for fighters only if no gargoyle fountain nearby
    if (!closestTarget) {
      for (const fighter of fighters) {
        if (fighter && !fighter.isDead) {
          try {
            const executionerTransform = Transform.get(this.entity)
            const distance = Vector3.distance(
              executionerTransform.position,
              fighter.position
            )
            if (distance <= 10) {
              // 10 unit detection range for fighters (secondary target)
              nearbyTarget = true
              if (distance < closestDistance) {
                closestDistance = distance
                closestTarget = fighter
                targetType = 'fighter'
              }
            }
          } catch (error) {
            console.log('Error checking fighter distance:', error)
            continue
          }
        }
      }
    }

    this.isConfrontedByFighter = nearbyTarget
    this.attackingFighter = closestTarget

    // Handle combat state transitions
    const currentTime = Date.now()

    if (closestTarget) {
      const executionerTransform = Transform.get(this.entity)
      const distance = Vector3.distance(
        executionerTransform.position,
        targetType === 'fighter'
          ? closestTarget.position
          : Transform.get(closestTarget.entity).position
      )

      console.log(
        `Executioner found ${targetType} at distance: ${distance.toFixed(2)}`
      )

      if (distance <= 5) {
        // In combat range
        if (this.combatState === 'idle') {
          // Starting combat - executioner gets initiative if fighter doesn't have it
          this.combatState = 'engaged'
          this.combatTarget = closestTarget.entity
          this.hasInitiative =
            targetType === 'fighter' ? !closestTarget.hasInitiative : true // Gargoyle doesn't have initiative
          this.lastCombatAction = currentTime

          console.log(
            `Executioner entering combat with ${targetType} (${
              targetType === 'gargoyle' ? 'fountain' : 'fighter'
            }) with initiative: ${this.hasInitiative}`
          )
        }

        // Debug: Log current combat state
        console.log(
          `Executioner combat state: ${this.combatState}, hasInitiative: ${
            this.hasInitiative
          }, timeSinceLastAction: ${currentTime - this.lastCombatAction}`
        )

        // Handle combat actions
        if (
          this.combatState === 'engaged' &&
          currentTime - this.lastCombatAction >= this.combatActionInterval
        ) {
          if (this.hasInitiative) {
            // Executioner has initiative - attack target
            console.log('Executioner has initiative - ATTACKING!')
            this.attackTarget()
            this.hasInitiative = false // Give initiative to target
            console.log('Executioner attacked, giving initiative to target')
          } else {
            // Executioner doesn't have initiative - check if fighter has attacked recently
            // If fighter hasn't attacked in a while, executioner can regain initiative
            const timeSinceFighterAttack = currentTime - this.lastAttackTime
            console.log(
              `Executioner no initiative. Time since fighter attack: ${timeSinceFighterAttack}ms`
            )
            if (timeSinceFighterAttack > this.combatActionInterval * 2) {
              // Fighter hasn't attacked recently, executioner can take initiative
              this.hasInitiative = true
              console.log(
                'Executioner regaining initiative after fighter delay'
              )
            } else {
              console.log('Executioner waiting for fighter to attack first')
            }
          }
          this.lastCombatAction = currentTime
        }
      } else {
        // Out of combat range
        if (this.combatState !== 'approaching') {
          this.combatState = 'approaching'
          console.log('Executioner approaching fighter')
        }
      }
    } else {
      // No fighters nearby
      if (this.combatState !== 'idle') {
        this.combatState = 'idle'
        this.combatTarget = null
        this.hasInitiative = false
        console.log('Executioner returning to idle state')
      }
    }

    // Face the fighter that last attacked us, or the closest one if none has attacked recently
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

    // Check for nearby targets periodically
    if (currentTime - this.lastFighterCheck >= this.fighterCheckInterval) {
      this.checkForNearbyTargets()
      this.lastFighterCheck = currentTime
    }

    // Move towards target if found, otherwise roam
    if (
      this.isConfrontedByFighter &&
      this.attackingFighter &&
      !this.isDeadAnimation
    ) {
      try {
        const target = this.attackingFighter
        const executionerTransform = Transform.get(this.entity)
        const targetTransform = Transform.get(target.entity)

        if (executionerTransform && targetTransform) {
          const distance = Vector3.distance(
            executionerTransform.position,
            targetTransform.position
          )

          console.log(
            `Executioner moving towards target, distance: ${distance.toFixed(
              2
            )}`
          )

          if (distance > 5) {
            // Move towards target
            const direction = Vector3.subtract(
              targetTransform.position,
              executionerTransform.position
            )
            const normalizedDirection = Vector3.normalize(direction)
            const moveSpeed = 2.0

            // Update position
            const newPosition = Vector3.add(
              executionerTransform.position,
              Vector3.scale(normalizedDirection, moveSpeed * dt)
            )
            Transform.getMutable(this.entity).position = newPosition

            // Play walk animation
            const walkAnim = Animator.getClip(this.entity, this.walkClip)
            const idleAnim = Animator.getClip(this.entity, this.idleClip)

            if (walkAnim && !walkAnim.playing) {
              walkAnim.playing = true
            }
            if (idleAnim && idleAnim.playing) {
              idleAnim.playing = false
            }
          } else {
            // Stop and attack
            const idleAnim = Animator.getClip(this.entity, this.idleClip)
            const walkAnim = Animator.getClip(this.entity, this.walkClip)

            if (walkAnim && walkAnim.playing) {
              walkAnim.playing = false
            }
            if (idleAnim && !idleAnim.playing) {
              idleAnim.playing = true
            }

            // Attack target if enough time has passed
            if (
              currentTime - this.lastFighterAttackTime >=
              this.fighterAttackInterval
            ) {
              this.attackTarget()
              this.lastFighterAttackTime = currentTime
            }
          }
        }
      } catch (error) {
        console.log('Error moving executioner towards target:', error)
      }
    } else if (
      !this.isEngaged &&
      !this.isConfrontedByFighter &&
      this.roamingSystem &&
      !this.isDeadAnimation
    ) {
      // Normal roaming when no target found
      this.roamingSystem.update(dt)
    }
  }

  private attackTarget(): void {
    if (!this.attackingFighter || this.isDeadAnimation) return

    try {
      const target = this.attackingFighter
      const executionerTransform = Transform.get(this.entity)
      const targetTransform = Transform.get(target.entity)

      if (!executionerTransform || !targetTransform) return

      const distance = Vector3.distance(
        executionerTransform.position,
        targetTransform.position
      )

      // Face the target when close enough
      if (distance <= 8) {
        this.faceTarget(targetTransform.position)
      }

      // Only attack if target is close enough (within 5 units)
      if (distance <= 5) {
        const isFighter =
          target.hasOwnProperty('takeDamage') &&
          typeof target.takeDamage === 'function'
        const targetName = isFighter ? 'fighter' : 'gargoyle fountain'

        console.log(
          `Executioner attacking ${targetName} at distance:`,
          distance.toFixed(2)
        )

        // Stop movement and face target
        this.stopMovement()
        this.faceTarget(targetTransform.position)

        // Play attack animation with smart animation state management
        const attackAnim = Animator.getClip(this.entity, this.attackClip)
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)

        console.log('Executioner attack animation states:', {
          idlePlaying: idleAnim?.playing,
          walkPlaying: walkAnim?.playing,
          attackPlaying: attackAnim?.playing
        })

        // Stop other animations and start attack - using smart animation state management
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
          console.log('Executioner: Stopped idle animation')
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Executioner: Stopped walk animation')
        }
        if (attackAnim && !attackAnim.playing) {
          attackAnim.playing = true
          console.log('Executioner: Started attack animation')
        }

        // Deal damage to target
        const damage = this.attack // Use executioner's attack value

        if (isFighter) {
          target.takeDamage(damage)
          console.log(`Executioner dealt ${damage} damage to fighter`)
        } else {
          // Attack gargoyle fountain
          target.reduceHealth(damage)
          console.log(`Executioner dealt ${damage} damage to gargoyle fountain`)
        }

        // Return to idle after attack animation (2 seconds) - using smart animation state management
        utils.timers.setTimeout(() => {
          console.log(
            'Executioner: Attack animation timeout, returning to idle'
          )
          if (attackAnim && attackAnim.playing) {
            attackAnim.playing = false
            console.log('Executioner: Stopped attack animation')
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
            console.log('Executioner: Started idle animation')
          }
        }, 2000)
      }
    } catch (error) {
      console.log('Error attacking target:', error)
    }
  }

  private faceTarget(targetPosition: Vector3): void {
    try {
      const executionerTransform = Transform.get(this.entity)
      if (!executionerTransform) return

      const direction = Vector3.subtract(
        targetPosition,
        executionerTransform.position
      )
      const lookRotation = Quaternion.lookRotation(direction)

      Transform.getMutable(this.entity).rotation = lookRotation
      console.log('Executioner facing target')
    } catch (error) {
      console.log('Error facing target:', error)
    }
  }

  private stopMovement(): void {
    try {
      // Stop walking animation
      const walkAnim = Animator.getClip(this.entity, this.walkClip)
      const idleAnim = Animator.getClip(this.entity, this.idleClip)

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Executioner: Stopped walk animation')
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
        console.log('Executioner: Started idle animation')
      }

      // Stop roaming by setting state flags
      this.isEngaged = true
      this.isConfrontedByFighter = true
    } catch (error) {
      console.log('Error stopping movement:', error)
    }
  }

  // Override handleAttack to prevent attacking the player
  handleAttack(): void {
    // Executioners only attack the gargoyle fountain, not the player
    console.log('Executioner handleAttack called - ignoring player attacks')
    return
  }

  // Override attackPlayer to prevent attacking the player
  attackPlayer(enemyAttack: number): void {
    // Executioners only attack the gargoyle fountain, not the player
    console.log('Executioner attackPlayer called - ignoring player attacks')
    return
  }

  // Override performAttack to only attack the gargoyle fountain
  performAttack(damage: number, isCriticalAttack: boolean): void {
    // Only attack if we have a valid target and it's the gargoyle fountain
    if (!this.attackingFighter) {
      console.log('Executioner: No target to attack')
      return
    }

    // Check if target is gargoyle fountain
    const player = Player.getInstanceOrNull()
    if (!player) return

    const currentRealm = player.gameController.realmController.currentRealm
    if (!currentRealm || currentRealm.getId() !== 'antrom') return

    const gargoyleFountain = (currentRealm as any).gargoyleFountain
    if (!gargoyleFountain || gargoyleFountain.isDead) {
      console.log('Executioner: Gargoyle fountain not found or dead')
      return
    }

    // Check if our target is the gargoyle fountain
    if (this.attackingFighter !== gargoyleFountain) {
      console.log(
        'Executioner: Target is not gargoyle fountain, ignoring attack'
      )
      return
    }

    console.log('Executioner: Attacking gargoyle fountain with damage:', damage)

    // Play attack animation
    this.playAttack()

    // Apply damage to gargoyle fountain
    gargoyleFountain.reduceHealth(damage)

    // Update UI
    const mainHUD = player.gameController.uiController.mainHud
    if (mainHUD !== null) {
      mainHUD.lastEnemyAttack = damage
      mainHUD.lastPlayerAttack = 'MISSED'
    }

    // Play sound
    AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')
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
        // Stop all animations and return to idle with smart animation state management
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)
        const attackAnim = Animator.getClip(this.entity, this.attackClip)
        const impactAnim = Animator.getClip(this.entity, this.impactClip)

        // Stop all other animations
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Executioner: Stopped walk animation on disengage')
        }
        if (attackAnim && attackAnim.playing) {
          attackAnim.playing = false
          console.log('Executioner: Stopped attack animation on disengage')
        }
        if (impactAnim && impactAnim.playing) {
          impactAnim.playing = false
          console.log('Executioner: Stopped impact animation on disengage')
        }

        // Start idle animation
        if (idleAnim && !idleAnim.playing) {
          idleAnim.playing = true
          console.log('Executioner: Started idle animation on disengage')
        }
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
