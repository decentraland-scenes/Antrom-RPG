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

export default class Boss extends MonsterMobAuto {
  shapeFile = 'assets/models/CptCruz.glb'
  hoverText: string
  private roamingSystem: MonsterRoaming | null = null
  private isEngaged: boolean = false
  private isConfrontedByFighter: boolean = false

  private lastFighterCheck: number = 0
  private fighterCheckInterval: number = 4000 // Check for fighters every 4 seconds (further reduced frequency)
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
  private hasInitiative: boolean = false // Whether boss has initiative in current combat

  constructor() {
    const player = Player.getInstanceOrNull()
    const level = player?.levels.getLevel(LEVEL_TYPES.PLAYER) ?? 2
    super(level + 30, level + 80, level - 5, level * 150, 0.01, 7, 2.5)
    this.minLuck = 15
    this.hoverText = `Attack LVL ${level} Boss!`

    // Set initial position first
    this.loadTransformation()

    // Then initialize monster with correct position
    this.initMonster()

    this.dropRate = -1
  }

  reduceHealth(attack: number): void {
    console.log('Boss.reduceHealth called with attack:', attack)
    console.log('Boss health before damage:', this.health)
    console.log('Boss isEngaged:', this.isEngaged)
    console.log('Boss isDead:', this.isDead)
    console.log('Boss isDeadAnimation:', this.isDeadAnimation)

    // Track which fighter attacked us
    this.lastAttackedBy = this.attackingFighter
    this.lastAttackTime = Date.now()

    // Face the attacking fighter if we know which one it is
    if (this.attackingFighter && !this.isDeadAnimation) {
      try {
        const bossTransform = Transform.get(this.entity)
        const direction = Vector3.subtract(
          this.attackingFighter.position,
          bossTransform.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)
        console.log('Boss facing attacking fighter')
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

        console.log('Boss impact animation states:', {
          idlePlaying: idleAnim?.playing,
          walkPlaying: walkAnim?.playing,
          impactPlaying: impactAnim?.playing
        })

        // Stop other animations and play impact (following animation learnings)
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
          console.log('Boss: Stopped idle animation for impact')
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Boss: Stopped walk animation for impact')
        }
        if (impactAnim && !impactAnim.playing) {
          impactAnim.playing = true
          console.log('Boss: Started impact animation')
        }

        // Return to idle after impact animation (1.5 seconds)
        utils.timers.setTimeout(() => {
          console.log('Boss: Impact animation timeout, returning to idle')
          if (impactAnim && impactAnim.playing) {
            impactAnim.playing = false
            console.log('Boss: Stopped impact animation')
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
            console.log('Boss: Started idle animation after impact')
          }
        }, 1500)
      } catch (error) {
        console.log('Error playing boss impact animation:', error)
      }
    }

    // Call the base reduceHealth method
    super.reduceHealth(attack)

    console.log('Boss health after damage:', this.health)

    // Update the health bar to show the damage
    this.updateHealthBar()

    // Check if boss died and handle death properly
    if (this.health <= 0 && !this.isDead) {
      console.log('Boss died, calling onDead()')
      this.isDead = true

      // Remove stationary system immediately to prevent errors
      engine.removeSystem(this.stationaryUpdateSystem.bind(this))

      // Play death animation with smart animation state management
      const dieAnim = Animator.getClip(this.entity, this.dieClip)
      const idleAnim = Animator.getClip(this.entity, this.idleClip)
      const walkAnim = Animator.getClip(this.entity, this.walkClip)
      const attackAnim = Animator.getClip(this.entity, this.attackClip)
      const impactAnim = Animator.getClip(this.entity, this.impactClip)

      console.log('Boss death animation states:', {
        idlePlaying: idleAnim?.playing,
        walkPlaying: walkAnim?.playing,
        attackPlaying: attackAnim?.playing,
        impactPlaying: impactAnim?.playing,
        diePlaying: dieAnim?.playing
      })

      // Stop all other animations and start death - using smart animation state management
      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
        console.log('Boss: Stopped idle animation for death')
      }
      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
        console.log('Boss: Stopped walk animation for death')
      }
      if (attackAnim && attackAnim.playing) {
        attackAnim.playing = false
        console.log('Boss: Stopped attack animation for death')
      }
      if (impactAnim && impactAnim.playing) {
        impactAnim.playing = false
        console.log('Boss: Stopped impact animation for death')
      }
      if (dieAnim && !dieAnim.playing) {
        dieAnim.playing = true
        console.log('Boss: Started death animation')
      }

      // Schedule cleanup after death animation
      utils.timers.setTimeout(() => {
        console.log('Boss: Death animation complete, cleaning up')
        this.onDead()
      }, 3000) // 3 seconds for death animation
    }
  }

  initMonster(): void {
    console.log('init boss')
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

    // Make boss combat-ready from the start
    console.log('Creating health bar for boss')
    this.createHealthBar()
    console.log('Health bar created for boss')

    // Disable collision for boss to prevent blocking fighter placement
    try {
      // Remove any collision components that might interfere with placement
      console.log(
        'Boss entity created with no collision to allow fighter placement'
      )
    } catch (error) {
      console.log('Error setting up boss collision:', error)
    }

    this.setupEngageTriggerBox()
    // Don't setup attack trigger box for stationary boss
    // this.setupAttackTriggerBox()
    // Don't setup ranged attack trigger box for stationary boss
    // this.setupRangedAttackTriggerBox()

    // Create dummy attack systems for stationary boss (they won't be used)
    this.attackSystem = new MonsterAttack(this, {
      moveSpeed: 0,
      engageDistance: this.engageDistance
    })
    this.attackSystemRanged = new MonsterAttackRanged(this, {
      moveSpeed: 0,
      engageDistance: this.engageDistance
    })

    // Don't setup attack handler for stationary boss
    // this.setupAttackHandler()
  }

  loadTransformation(): void {
    // Boss has a fixed position - stationary
    const initialPosition = Vector3.create(-49.63, 5.89, -16.95)
    const initialRotation = Quaternion.fromEulerDegrees(0, 0, 0)
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation
    })

    // Store the initial position
    this.initialPosition = initialPosition

    // No roaming system for stationary boss
    this.roamingSystem = null

    // Add stationary update system to engine
    engine.addSystem(this.stationaryUpdateSystem.bind(this))
  }

  private checkForNearbyFighters(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Safety check: Make sure boss entity still exists and has Transform
    try {
      const bossTransform = Transform.get(this.entity)
      if (!bossTransform) {
        console.log('Boss entity missing Transform component')
        return
      }
    } catch (error) {
      console.log('Boss entity not found or invalid:', error)
      return
    }

    // Get all fighters from the player
    const fighters = player.fighters || []
    let nearbyFighter = false
    let closestFighter = null
    let closestDistance = Infinity
    let attackingFighters: any[] = []

    for (const fighter of fighters) {
      if (fighter && !fighter.isDead) {
        try {
          const bossTransform = Transform.get(this.entity)
          const distance = Vector3.distance(
            bossTransform.position,
            fighter.position
          )
          if (distance <= 8) {
            // Increased detection range
            nearbyFighter = true
            attackingFighters.push(fighter)
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

    console.log(`Boss detected ${attackingFighters.length} fighters nearby`)

    this.isConfrontedByFighter = nearbyFighter
    this.attackingFighter = closestFighter

    // Handle combat state transitions
    const currentTime = Date.now()

    if (closestFighter) {
      const bossTransform = Transform.get(this.entity)
      const distance = Vector3.distance(
        bossTransform.position,
        closestFighter.position
      )

      if (distance <= 8) {
        // Increased range to prevent constant disengagement
        // In combat range
        if (this.combatState === 'idle' || this.combatState === 'approaching') {
          // Starting combat - boss gets initiative if fighter doesn't have it
          this.combatState = 'engaged'
          this.combatTarget = closestFighter.entity
          this.hasInitiative = !closestFighter.hasInitiative // Opposite of fighter's initiative
          this.lastCombatAction = currentTime

          console.log(
            `Boss entering combat with initiative: ${this.hasInitiative}`
          )
        }

        // Only log combat state occasionally to reduce spam
        if (currentTime % 5000 < 1000) {
          // Log every 5 seconds
          console.log(
            `Boss combat state: ${this.combatState}, hasInitiative: ${
              this.hasInitiative
            }, timeSinceLastAction: ${currentTime - this.lastCombatAction}`
          )
        }

        // Handle combat actions
        if (
          this.combatState === 'engaged' &&
          currentTime - this.lastCombatAction >= this.combatActionInterval
        ) {
          if (this.hasInitiative) {
            // Boss has initiative - attack fighter
            console.log('Boss has initiative - ATTACKING!')
            this.attackFighter()
            this.hasInitiative = false // Give initiative to fighter
            console.log('Boss attacked, giving initiative to fighter')
          } else {
            // Boss doesn't have initiative - check if fighter has attacked recently
            // If fighter hasn't attacked in a while, boss can regain initiative
            const timeSinceFighterAttack = currentTime - this.lastAttackTime
            console.log(
              `Boss no initiative. Time since fighter attack: ${timeSinceFighterAttack}ms`
            )
            if (timeSinceFighterAttack > this.combatActionInterval * 2) {
              // Fighter hasn't attacked recently, boss can take initiative
              this.hasInitiative = true
              console.log('Boss regaining initiative after fighter delay')
            } else {
              console.log('Boss waiting for fighter to attack first')
            }
          }
          this.lastCombatAction = currentTime
        }
      } else {
        // Out of combat range - only disengage if really far
        if (distance > 12 && this.combatState !== 'approaching') {
          this.combatState = 'approaching'
          console.log('Boss approaching fighter (out of range)')
        }
      }
    } else {
      // No fighters nearby - only return to idle after a delay
      if (this.combatState !== 'idle' && this.combatState !== 'approaching') {
        this.combatState = 'approaching'
        console.log('Boss approaching (no fighters nearby)')
      }
    }

    // Face the fighter that last attacked us, or the closest one if none has attacked recently
    const timeSinceLastAttack = currentTime - this.lastAttackTime
    if (this.lastAttackedBy && timeSinceLastAttack < 5000) {
      // Face the fighter that last attacked us (within 5 seconds)
      try {
        const bossTransform = Transform.get(this.entity)
        const direction = Vector3.subtract(
          this.lastAttackedBy.position,
          bossTransform.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)
      } catch (error) {
        console.log('Error facing last attacker:', error)
      }
    } else if (closestFighter) {
      // Face the closest fighter
      try {
        const bossTransform = Transform.get(this.entity)
        const direction = Vector3.subtract(
          closestFighter.position,
          bossTransform.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)
      } catch (error) {
        console.log('Error facing closest fighter:', error)
      }
    }
  }

  private stationaryUpdateSystem(dt: number): void {
    // Safety check: Make sure boss entity still exists and is not dead
    if (this.isDead || this.isDeadAnimation) {
      return // Don't update if dead
    }

    try {
      const bossTransform = Transform.get(this.entity)
      if (!bossTransform) {
        console.log(
          'Boss stationary system: Entity missing Transform component'
        )
        return
      }
    } catch (error) {
      console.log('Boss stationary system: Entity not found or invalid:', error)
      return
    }

    const currentTime = Date.now()

    // Check for nearby fighters periodically
    if (currentTime - this.lastFighterCheck >= this.fighterCheckInterval) {
      console.log('Boss checking for nearby fighters...')
      this.checkForNearbyFighters()
      this.lastFighterCheck = currentTime
    }

    // Stationary boss - always play idle animation and face fighters
    if (!this.isDeadAnimation) {
      try {
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)
        const attackAnim = Animator.getClip(this.entity, this.attackClip)

        // Force stop all other animations and play idle for stationary boss
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Boss: Forced stop walk animation')
        }
        if (attackAnim && attackAnim.playing) {
          attackAnim.playing = false
          console.log('Boss: Forced stop attack animation')
        }
        if (idleAnim && !idleAnim.playing) {
          idleAnim.playing = true
          console.log('Boss: Forced start idle animation')
        }
      } catch (error) {
        console.log('Error updating boss animations:', error)
      }

      // Attack fighter if enough time has passed and fighter is in range
      if (
        this.isConfrontedByFighter &&
        currentTime - this.lastFighterAttackTime >= this.fighterAttackInterval
      ) {
        this.attackFighter()
        this.lastFighterAttackTime = currentTime
      }
    }
  }

  private attackFighter(): void {
    if (!this.attackingFighter || this.isDeadAnimation) return

    try {
      const fighter = this.attackingFighter
      const bossTransform = Transform.get(this.entity)
      const fighterTransform = Transform.get(fighter.entity)

      if (!bossTransform || !fighterTransform) return

      const distance = Vector3.distance(
        bossTransform.position,
        fighterTransform.position
      )

      // Only attack if fighter is close enough (within 5 units)
      if (distance <= 5) {
        console.log('Boss attacking fighter at distance:', distance.toFixed(2))

        // Play attack animation with smart animation state management
        const attackAnim = Animator.getClip(this.entity, this.attackClip)
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)

        console.log('Boss attack animation states:', {
          idlePlaying: idleAnim?.playing,
          walkPlaying: walkAnim?.playing,
          attackPlaying: attackAnim?.playing
        })

        // Stop other animations and start attack - using smart animation state management
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
          console.log('Boss: Stopped idle animation')
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Boss: Stopped walk animation')
        }
        if (attackAnim && !attackAnim.playing) {
          attackAnim.playing = true
          console.log('Boss: Started attack animation')
        }

        // Deal damage to fighter
        const damage = this.attack // Use boss's attack value
        fighter.takeDamage(damage)

        console.log(`Boss dealt ${damage} damage to fighter`)

        // Return to idle after attack animation
        utils.timers.setTimeout(() => {
          if (!this.isDeadAnimation) {
            if (attackAnim && attackAnim.playing) {
              attackAnim.playing = false
              console.log('Boss: Stopped attack animation')
            }
            if (idleAnim && !idleAnim.playing) {
              idleAnim.playing = true
              console.log('Boss: Started idle animation after attack')
            }
          }
        }, 2000) // 2 seconds for attack animation
      }
    } catch (error) {
      console.log('Error in boss attackFighter:', error)
    }
  }

  // Override the engage trigger for stationary boss - disable it entirely
  setupEngageTriggerBox(): void {
    // Create a dummy trigger entity but don't add any triggers to prevent interference
    this.engageAttackTrigger = entityController.addEntity()
    Transform.create(this.engageAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.engageAttackTrigger)
    VisibilityComponent.create(this.engageAttackTrigger, { visible: false })

    // Don't add any trigger logic - boss will handle combat through stationaryUpdateSystem
    console.log(
      'Boss engage trigger disabled to prevent interference with fighter placement'
    )
  }

  removeEntity(): void {
    // Remove stationary system from engine
    engine.removeSystem(this.stationaryUpdateSystem.bind(this))

    // Clear all references to prevent memory leaks
    this.roamingSystem = null
    // Don't remove attack systems since they're not being used
    this.attackingFighter = null
    this.lastAttackedBy = null

    super.cleanup()
    entityController.removeEntity(this.rangeAttackTrigger)
    entityController.removeEntity(this.engageAttackTrigger)
    entityController.removeEntity(this.entity)
  }

  create(): void {
    const newChar = new Boss()

    // Add the new boss to the antrom realm's bosses array
    const player = Player.getInstanceOrNull()
    if (player && player.gameController.realmController.currentRealm) {
      const currentRealm = player.gameController.realmController.currentRealm
      if (currentRealm.getId() === 'antrom') {
        // Remove this dead boss from the array
        const bosses = (currentRealm as any).bosses || []
        const deadIndex = bosses.indexOf(this)
        if (deadIndex !== -1) {
          bosses.splice(deadIndex, 1)
          console.log('Dead boss removed from array')
        }

        // Add the new boss to the array
        bosses.push(newChar)
        console.log('New boss spawned and added to array')
      }
    }
  }
}
