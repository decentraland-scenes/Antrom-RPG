import {
  engine,
  Transform,
  Animator,
  AudioSource,
  GltfContainer,
  MeshRenderer,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { entityController } from '../realms/entityController'
import * as utils from '@dcl-sdk/utils'
import MonsterMobAuto from './monsterMobAuto'
import { Player } from '../player/player'

export default class WaveEnemy extends MonsterMobAuto {
  private modelPath: string
  private waveNumber: number

  constructor(modelPath: string, waveNumber: number) {
    // Calculate stats based on wave number
    const baseLevel = 1
    const levelIncrease = Math.floor(waveNumber / 5) // Increase level every 5 waves
    const level = baseLevel + levelIncrease

    const baseHealth = 100
    const healthIncrease = waveNumber * 20 // +20 health per wave
    const health = baseHealth + healthIncrease

    const baseAttack = 10
    const attackIncrease = waveNumber * 5 // +5 attack per wave
    const attack = baseAttack + attackIncrease

    const baseXP = 10
    const xpIncrease = waveNumber * 5 // +5 XP per wave
    const xp = baseXP + xpIncrease

    super(attack, xp, level, health, 0.01, 7, 2.5)

    this.modelPath = modelPath
    this.waveNumber = waveNumber
    this.shapeFile = modelPath

    // Ensure Transform component is created immediately
    Transform.createOrReplace(this.entity, {
      position: Vector3.create(0, 0, 0),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      scale: Vector3.create(1, 1, 1)
    })
  }

  initMonster(): void {
    console.log(
      `Initializing Wave Enemy with model: ${this.modelPath}, Wave: ${this.waveNumber}`
    )

    if (!this.shape && this.shapeFile) {
      this.shape = this.shapeFile
      GltfContainer.createOrReplace(this.entity, { src: this.shape })
    }

    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/attack.mp3',
      loop: false
    })

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
      'Wave Enemy Animator created with states:',
      animator.states.map((state) => state.clip)
    )

    // Make enemy combat-ready from the start
    console.log('Creating health bar for wave enemy')
    this.createHealthBar()
    console.log('Health bar created for wave enemy')

    this.setupEngageTriggerBox()
    // Disable base class attack systems - wave enemies use custom targeting
    // this.setupAttackTriggerBox()
    // this.setupRangedAttackTriggerBox()
  }

  loadTransformation(): void {
    // Position will be set by the spawning system
    const initialPosition = Vector3.create(0, 0, 0)
    const initialRotation = Quaternion.fromEulerDegrees(0, 0, 0)

    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation,
      scale: Vector3.create(1, 1, 1)
    })

    console.log(`Wave Enemy positioned at: ${initialPosition}`)
  }

  // Override handleAttack to prevent attacking the player
  handleAttack(): void {
    // Wave enemies only attack the gargoyle fountain, not the player
    console.log('Wave Enemy handleAttack called - ignoring player attacks')
    return
  }

  // Override attackPlayer to prevent attacking the player
  attackPlayer(enemyAttack: number): void {
    // Wave enemies only attack the gargoyle fountain, not the player
    console.log('Wave Enemy attackPlayer called - ignoring player attacks')
    return
  }

  // Override performAttack to only attack the gargoyle fountain
  performAttack(damage: number, isCriticalAttack: boolean): void {
    // Only attack if we have a valid target and it's the gargoyle fountain
    if (!this.attackingFighter) {
      console.log('Wave Enemy: No target to attack')
      return
    }

    // Check if target is gargoyle fountain
    const player = Player.getInstanceOrNull()
    if (!player) return

    const currentRealm = player.gameController.realmController.currentRealm
    if (!currentRealm || currentRealm.getId() !== 'antrom') return

    const gargoyleFountain = (currentRealm as any).gargoyleFountain
    if (!gargoyleFountain || gargoyleFountain.isDead) {
      console.log('Wave Enemy: Gargoyle fountain not found or dead')
      return
    }

    // Check if our target is the gargoyle fountain
    if (this.attackingFighter !== gargoyleFountain) {
      console.log(
        'Wave Enemy: Target is not gargoyle fountain, ignoring attack'
      )
      return
    }

    console.log(
      `Wave Enemy (Wave ${this.waveNumber}): Attacking gargoyle fountain with damage:`,
      damage
    )

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
        // engine.addSystem(this.attackSystem.attackSystem.bind(this.attackSystem))
        // Start first attack
        this.handleAttack()
      },
      () => {
        if (this.isDeadAnimation) return
        this.isEngaged = false
        this.cleanup()
        // engine.removeSystem(
        //   this.attackSystem.attackSystem.bind(this.attackSystem)
        // )
        // Stop all animations and return to idle with smart animation state management
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)
        const attackAnim = Animator.getClip(this.entity, this.attackClip)
        const impactAnim = Animator.getClip(this.entity, this.impactClip)

        // Stop all other animations
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Wave Enemy: Stopped walk animation on disengage')
        }
        if (attackAnim && attackAnim.playing) {
          attackAnim.playing = false
          console.log('Wave Enemy: Stopped attack animation on disengage')
        }
        if (impactAnim && impactAnim.playing) {
          impactAnim.playing = false
          console.log('Wave Enemy: Stopped impact animation on disengage')
        }

        // Start idle animation
        if (idleAnim && !idleAnim.playing) {
          idleAnim.playing = true
          console.log('Wave Enemy: Started idle animation on disengage')
        }
      }
    )
  }

  // Custom movement and targeting system (similar to Executioner)
  private roamingSystem: any = null
  private isEngaged: boolean = false
  private isConfrontedByFighter: boolean = false
  private lastFighterCheck: number = 0
  private fighterCheckInterval: number = 1000 // Check for targets every 1 second
  private attackingFighter: any = null
  private lastFighterAttackTime: number = 0
  private fighterAttackInterval: number = 3000 // Attack every 3 seconds

  // Add roaming system to engine
  initRoamingSystem(): void {
    engine.addSystem(this.roamingUpdateSystem.bind(this))
  }

  private roamingUpdateSystem(dt: number): void {
    // Safety check: Make sure enemy entity still exists and is not dead
    if (this.isDead || this.isDeadAnimation) {
      return // Don't update if dead
    }

    try {
      const enemyTransform = Transform.get(this.entity)
      if (!enemyTransform) {
        console.log(
          'Wave Enemy roaming system: Entity missing Transform component'
        )
        return
      }
    } catch (error) {
      console.log(
        'Wave Enemy roaming system: Entity not found or invalid:',
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
        const enemyTransform = Transform.get(this.entity)
        const targetTransform = Transform.get(target.entity)

        if (enemyTransform && targetTransform) {
          const distance = Vector3.distance(
            enemyTransform.position,
            targetTransform.position
          )

          console.log(
            `Wave Enemy moving towards target, distance: ${distance.toFixed(2)}`
          )

          if (distance > 5) {
            // Move towards target
            const direction = Vector3.subtract(
              targetTransform.position,
              enemyTransform.position
            )
            const normalizedDirection = Vector3.normalize(direction)
            const moveSpeed = 2.0

            // Update position
            const newPosition = Vector3.add(
              enemyTransform.position,
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
        console.log('Error moving wave enemy towards target:', error)
      }
    }
  }

  private checkForNearbyTargets(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Safety check: Make sure enemy entity still exists and has Transform
    try {
      const enemyTransform = Transform.get(this.entity)
      if (!enemyTransform) {
        console.log('Wave Enemy entity missing Transform component')
        return
      }
    } catch (error) {
      console.log('Wave Enemy entity not found or invalid:', error)
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
          const enemyTransform = Transform.get(this.entity)
          const gargoyleTransform = Transform.get(gargoyleFountain.entity)
          const distance = Vector3.distance(
            enemyTransform.position,
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
            const enemyTransform = Transform.get(this.entity)
            const distance = Vector3.distance(
              enemyTransform.position,
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

    if (closestTarget) {
      const enemyTransform = Transform.get(this.entity)
      const distance = Vector3.distance(
        enemyTransform.position,
        targetType === 'fighter'
          ? closestTarget.position
          : Transform.get(closestTarget.entity).position
      )

      console.log(
        `Wave Enemy found ${targetType} at distance: ${distance.toFixed(2)}`
      )
    }
  }

  private attackTarget(): void {
    if (!this.attackingFighter || this.isDeadAnimation) return

    try {
      const target = this.attackingFighter
      const enemyTransform = Transform.get(this.entity)
      const targetTransform = Transform.get(target.entity)

      if (!enemyTransform || !targetTransform) return

      const distance = Vector3.distance(
        enemyTransform.position,
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
          `Wave Enemy (Wave ${this.waveNumber}) attacking ${targetName} at distance:`,
          distance.toFixed(2)
        )

        // Stop movement and face target
        this.stopMovement()
        this.faceTarget(targetTransform.position)

        // Play attack animation with smart animation state management
        const attackAnim = Animator.getClip(this.entity, this.attackClip)
        const idleAnim = Animator.getClip(this.entity, this.idleClip)
        const walkAnim = Animator.getClip(this.entity, this.walkClip)

        console.log('Wave Enemy attack animation states:', {
          idlePlaying: idleAnim?.playing,
          walkPlaying: walkAnim?.playing,
          attackPlaying: attackAnim?.playing
        })

        // Stop other animations and start attack - using smart animation state management
        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
          console.log('Wave Enemy: Stopped idle animation')
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
          console.log('Wave Enemy: Stopped walk animation')
        }
        if (attackAnim && !attackAnim.playing) {
          attackAnim.playing = true
          console.log('Wave Enemy: Started attack animation')
        }

        // Deal damage to target
        const damage = this.attack // Use enemy's attack value

        if (isFighter) {
          target.takeDamage(damage)
          console.log(
            `Wave Enemy (Wave ${this.waveNumber}) dealt ${damage} damage to fighter`
          )
        } else {
          // Attack gargoyle fountain
          target.reduceHealth(damage)
          console.log(
            `Wave Enemy (Wave ${this.waveNumber}) dealt ${damage} damage to gargoyle fountain`
          )
        }

        // Return to idle after attack animation (2 seconds) - using smart animation state management
        utils.timers.setTimeout(() => {
          console.log('Wave Enemy: Attack animation timeout, returning to idle')
          if (attackAnim && attackAnim.playing) {
            attackAnim.playing = false
            console.log('Wave Enemy: Stopped attack animation')
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
            console.log('Wave Enemy: Started idle animation')
          }
        }, 2000)
      }
    } catch (error) {
      console.log('Error attacking target:', error)
    }
  }

  private faceTarget(targetPosition: Vector3): void {
    try {
      const enemyTransform = Transform.get(this.entity)
      if (!enemyTransform) return

      const direction = Vector3.subtract(
        targetPosition,
        enemyTransform.position
      )
      const normalizedDirection = Vector3.normalize(direction)
      const angle = Math.atan2(normalizedDirection.x, normalizedDirection.z)
      const rotation = Quaternion.fromEulerDegrees(
        0,
        (angle * 180) / Math.PI,
        0
      )

      Transform.getMutable(this.entity).rotation = rotation
    } catch (error) {
      console.log('Error facing target:', error)
    }
  }

  private stopMovement(): void {
    try {
      this.isEngaged = true
      this.isConfrontedByFighter = true
    } catch (error) {
      console.log('Error stopping movement:', error)
    }
  }

  removeEntity(): void {
    // Remove roaming system from engine
    engine.removeSystem(this.roamingUpdateSystem.bind(this))

    // Clear all references to prevent memory leaks
    this.roamingSystem = null
    this.attackingFighter = null

    super.cleanup()
    entityController.removeEntity(this.engageAttackTrigger)
    entityController.removeEntity(this.entity)
  }
}
