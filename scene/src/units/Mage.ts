import {
  Animator,
  AudioSource,
  GltfContainer,
  Transform,
  engine,
  type Entity
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { Player } from '../player/player'
import { entityController } from '../realms/entityController'
import { LEVEL_TYPES } from '../player/LevelManager'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import Executioner from '../enemies/Executioner'

export class Mage {
  public entity: Entity
  public position: Vector3
  public lastAttackTime: number
  public isPlaced: boolean = false
  public attackRange: number = 8 // Longer range than fighters
  public attackInterval: number = 5000 // 5 seconds between attacks (slower but more powerful)
  public targetExecutioner: Entity | null = null
  public isAttacking: boolean = false
  public isWalking: boolean = false
  public walkSpeed: number = 6.0 // Slower than fighters
  public lastWalkTime: number = 0
  public walkInterval: number = 100

  // Roaming system
  public isRoaming: boolean = false
  public roamRadius: number = 100
  public roamSpeed: number = 1.0 // Slower than fighters
  public lastRoamTime: number = 0
  public roamInterval: number = 2000
  public spawnPosition: Vector3

  // Systematic search system
  public searchDirection: Vector3 = Vector3.create(1, 0, 0)
  public searchDistance: number = 0
  public maxSearchDistance: number = 50
  public searchAngle: number = 0
  public searchAngleIncrement: number = 45

  // Mage stats - will be set from player stats
  public health: number = 0
  public maxHealth: number = 0
  public attackDamage: number = 0 // Will be based on player magic
  public isDead: boolean = false
  public lastDamagedTime: number = 0
  public damageCooldown: number = 1000

  // Combat system
  public combatState: 'idle' | 'approaching' | 'engaged' | 'disengaging' =
    'idle'
  public combatTarget: Entity | null = null
  public lastCombatAction: number = 0
  public combatActionInterval: number = 2000 // 2 seconds between combat actions
  public hasInitiative: boolean = false
  public hasBeenInCombat: boolean = false

  // Healing system
  public lastHealTime: number = 0
  public healInterval: number = 8000 // 8 seconds between heals
  public healRange: number = 10 // Range to heal fighters
  public healAmount: number = 0 // Will be based on player magic

  constructor(position: Vector3) {
    this.entity = entityController.addEntity()
    this.position = position
    this.spawnPosition = position
    this.lastAttackTime = Date.now()
    this.lastHealTime = Date.now() // Initialize healing timer

    console.log('Creating Mage entity:', this.entity)
    this.setupModel()
    this.initializeStatsFromPlayer()
  }

  private setupModel(): void {
    // Create the mage model
    Transform.create(this.entity, {
      position: this.position,
      rotation: Quaternion.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: Vector3.create(1, 1, 1)
    })

    GltfContainer.create(this.entity, {
      src: 'assets/models/druid.glb'
    })

    Animator.create(this.entity, {
      states: [
        {
          clip: 'idle',
          playing: true,
          loop: true
        },
        {
          clip: 'attack',
          playing: false,
          loop: false
        },
        {
          clip: 'walk',
          playing: false,
          loop: true
        },
        {
          clip: 'impact',
          playing: false,
          loop: false
        },
        {
          clip: 'die',
          playing: false,
          loop: false
        }
      ]
    })

    // Add audio source for magic attack sound
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/attack.mp3', // Will use same sound for now
      loop: false,
      playing: false
    })
  }

  private initializeStatsFromPlayer(): void {
    const player = Player.getInstanceOrNull()
    if (!player) {
      console.log('Player not found, using default mage stats')
      this.maxHealth = 150 // Less health than fighters
      this.health = 150
      this.attackDamage = 50 // Higher base damage than fighters
      this.healAmount = 30
      return
    }

    // Get player's base health and magic including wearable bonuses
    this.maxHealth = Math.floor(player.maxHealth * 0.75) // 75% of player health
    this.health = this.maxHealth
    this.attackDamage = player.getMagic() // Use magic score for attack
    this.healAmount = Math.floor(player.getMagic() * 0.6) // 60% of magic for healing

    console.log(
      `Mage initialized with stats - Health: ${this.health}, Attack: ${this.attackDamage}, Heal: ${this.healAmount}`
    )
  }

  public place(position: Vector3): void {
    this.position = position
    Transform.getMutable(this.entity).position = position
    this.isPlaced = true
    this.lastAttackTime = Date.now()
  }

  public update(): void {
    if (!this.isPlaced || this.isDead) return

    const currentTime = Date.now()

    // Try to heal fighters first
    if (currentTime - this.lastHealTime >= this.healInterval) {
      console.log('Mage update: Attempting to heal fighters')
      this.tryHealFighters()
      this.lastHealTime = currentTime
    } else {
      console.log(
        `Mage update: Healing cooldown. Time since last heal: ${
          currentTime - this.lastHealTime
        }ms, interval: ${this.healInterval}ms`
      )
    }

    // Find nearest executioner if we don't have a target
    if (
      !this.targetExecutioner ||
      !this.isExecutionerValid(this.targetExecutioner)
    ) {
      if (this.targetExecutioner) {
        console.log('Mage clearing invalid target')
        this.targetExecutioner = null
      }
      this.findNearestExecutioner()
    }

    // Only roam if we've been in combat before and have no current target
    if (
      !this.targetExecutioner &&
      this.hasBeenInCombat &&
      currentTime - this.lastRoamTime >= this.roamInterval
    ) {
      this.roam()
      this.lastRoamTime = currentTime
    }

    // Walk towards target if we have one and are not in attack range
    if (
      this.targetExecutioner &&
      currentTime - this.lastWalkTime >= this.walkInterval
    ) {
      this.walkTowardsTarget()
      this.lastWalkTime = currentTime
    }

    // Combat system
    if (this.targetExecutioner) {
      const distance = Vector3.distance(
        this.position,
        Transform.get(this.targetExecutioner).position
      )

      if (distance <= this.attackRange + 0.01) {
        if (this.combatState === 'idle' || this.combatState === 'approaching') {
          this.combatState = 'engaged'
          this.combatTarget = this.targetExecutioner
          this.hasInitiative = this.determineInitiative()
          this.hasBeenInCombat = true
          this.lastCombatAction = currentTime
        }

        if (
          this.combatState === 'engaged' &&
          currentTime - this.lastCombatAction >= this.combatActionInterval
        ) {
          if (this.hasInitiative) {
            console.log('Mage has initiative - ATTACKING!')
            this.attackExecutioner()
            this.hasInitiative = false
          } else {
            const timeSinceExecutionerAttack =
              currentTime - this.lastDamagedTime
            if (timeSinceExecutionerAttack > this.combatActionInterval * 2) {
              this.hasInitiative = true
            }
          }
          this.lastCombatAction = currentTime
        }
      } else {
        if (this.combatState !== 'approaching') {
          this.combatState = 'approaching'
        }
      }
    } else {
      if (this.combatState !== 'idle') {
        this.combatState = 'idle'
        this.combatTarget = null
        this.hasInitiative = false
      }
    }

    // Check if we should take damage from nearby executioners
    this.checkForDamage()

    // Animation state management
    this.updateAnimations()
  }

  private tryHealFighters(): void {
    const player = Player.getInstanceOrNull()
    if (!player || !player.fighters) {
      console.log('Mage healing: No player or fighters found')
      return
    }

    console.log(`Mage healing: Checking ${player.fighters.length} fighters`)
    let healedAny = false
    for (const fighter of player.fighters) {
      if (!fighter || fighter.isDead) {
        console.log('Mage healing: Skipping dead/null fighter')
        continue
      }

      const distance = Vector3.distance(this.position, fighter.position)
      console.log(
        `Mage healing: Fighter distance: ${distance.toFixed(2)}, heal range: ${
          this.healRange
        }`
      )

      if (distance <= this.healRange && fighter.health < fighter.maxHealth) {
        // Heal the fighter
        const healAmount = Math.min(
          this.healAmount,
          fighter.maxHealth - fighter.health
        )
        fighter.health += healAmount

        console.log(
          `Mage healed fighter for ${healAmount} health. Fighter health: ${fighter.health}/${fighter.maxHealth}`
        )
        healedAny = true

        // Play heal effect (could add visual effect here)
        // For now, just play a sound
        AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')
      } else {
        console.log(
          `Mage healing: Fighter not in range or at full health. Distance: ${distance.toFixed(
            2
          )}, Health: ${fighter.health}/${fighter.maxHealth}`
        )
      }
    }

    if (healedAny) {
      console.log('Mage performed healing!')
    } else {
      console.log('Mage healing: No fighters needed healing')
    }
  }

  private findNearestExecutioner(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    let nearestExecutioner: Entity | null = null
    let nearestDistance = Infinity

    const currentRealm = player.gameController.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const executioners = (currentRealm as any).executioners || []

      // Count how many mages are targeting each executioner
      const targetCounts = new Map<Entity, number>()
      const mages = player.mages || []

      for (const mage of mages) {
        if (mage && mage !== this && mage.targetExecutioner) {
          const count = targetCounts.get(mage.targetExecutioner) || 0
          targetCounts.set(mage.targetExecutioner, count + 1)
        }
      }

      for (const executioner of executioners) {
        if (!executioner || executioner.isDead) continue

        const executionerPos = Transform.get(executioner.entity).position
        const distance = Vector3.distance(this.position, executionerPos)

        if (distance <= this.roamRadius) {
          const currentTargets = targetCounts.get(executioner.entity) || 0
          const currentTargetsForNearest =
            targetCounts.get(nearestExecutioner!) || 0

          if (
            currentTargets < currentTargetsForNearest ||
            (currentTargets === currentTargetsForNearest &&
              distance < nearestDistance)
          ) {
            nearestDistance = distance
            nearestExecutioner = executioner.entity
          }
        }
      }
    }

    this.targetExecutioner = nearestExecutioner
  }

  private roam(): void {
    if (this.isWalking) {
      this.isWalking = false
      const walkAnim = Animator.getClip(this.entity, 'walk')
      const idleAnim = Animator.getClip(this.entity, 'idle')

      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
      }
    }

    if (this.searchDistance >= this.maxSearchDistance) {
      this.searchAngle += this.searchAngleIncrement
      if (this.searchAngle >= 360) {
        this.maxSearchDistance += 25
        this.searchAngle = 0
      }

      const angleRad = (this.searchAngle * Math.PI) / 180
      this.searchDirection = Vector3.create(
        Math.cos(angleRad),
        0,
        Math.sin(angleRad)
      )
      this.searchDistance = 0
    }

    const roamDistance = this.roamSpeed * (this.roamInterval / 1000)
    const newPosition = Vector3.add(
      this.position,
      Vector3.scale(this.searchDirection, roamDistance)
    )

    Transform.getMutable(this.entity).position = newPosition
    this.position = newPosition
    this.searchDistance += roamDistance

    Transform.getMutable(this.entity).rotation = Quaternion.lookRotation(
      this.searchDirection
    )

    if (!this.isWalking) {
      this.isWalking = true
      const idleAnim = Animator.getClip(this.entity, 'idle')
      const walkAnim = Animator.getClip(this.entity, 'walk')

      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
      }
      if (walkAnim && !walkAnim.playing) {
        walkAnim.playing = true
      }
    }

    this.isRoaming = true
  }

  private isExecutionerValid(executionerEntity: Entity): boolean {
    try {
      const transform = Transform.get(executionerEntity)
      if (!transform) return false

      const player = Player.getInstanceOrNull()
      if (!player) return false

      const currentRealm = player.gameController.realmController.currentRealm
      if (currentRealm && currentRealm.getId() === 'antrom') {
        const executioners = (currentRealm as any).executioners || []

        for (const executioner of executioners) {
          if (executioner.entity === executionerEntity) {
            if (executioner.isDead || executioner.health <= 0) {
              return false
            }
            return true
          }
        }
      }

      return false
    } catch {
      return false
    }
  }

  private walkTowardsTarget(): void {
    if (!this.targetExecutioner) return

    try {
      const executionerTransform = Transform.get(this.targetExecutioner)
      const distance = Vector3.distance(
        this.position,
        executionerTransform.position
      )

      if (distance <= this.attackRange) {
        if (this.isWalking) {
          this.isWalking = false
          const walkAnim = Animator.getClip(this.entity, 'walk')
          const idleAnim = Animator.getClip(this.entity, 'idle')

          if (walkAnim && walkAnim.playing) {
            walkAnim.playing = false
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
          }
        }
        this.isRoaming = false
        return
      }

      const direction = Vector3.subtract(
        executionerTransform.position,
        this.position
      )
      const normalizedDirection = Vector3.normalize(direction)

      const walkDistance = this.walkSpeed * (this.walkInterval / 1000)
      const newPosition = Vector3.add(
        this.position,
        Vector3.scale(normalizedDirection, walkDistance)
      )

      Transform.getMutable(this.entity).position = newPosition
      this.position = newPosition

      Transform.getMutable(this.entity).rotation =
        Quaternion.lookRotation(direction)

      if (!this.isWalking) {
        this.isWalking = true
        const idleAnim = Animator.getClip(this.entity, 'idle')
        const walkAnim = Animator.getClip(this.entity, 'walk')

        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
        }
        if (walkAnim && !walkAnim.playing) {
          walkAnim.playing = true
        }
      }

      this.isRoaming = false
    } catch (error) {
      console.log('Error walking towards target:', error)
      this.targetExecutioner = null
      this.isWalking = false
    }
  }

  private attackExecutioner(): void {
    if (!this.targetExecutioner) return

    const player = Player.getInstanceOrNull()
    if (!player) return

    try {
      const executionerTransform = Transform.get(this.targetExecutioner)
      const distance = Vector3.distance(
        this.position,
        executionerTransform.position
      )

      if (distance <= this.attackRange) {
        if (this.isWalking) {
          this.isWalking = false
        }

        // Get closer for dramatic effect
        if (distance > 3) {
          const direction = Vector3.subtract(
            executionerTransform.position,
            this.position
          )
          const normalizedDirection = Vector3.normalize(direction)

          const offsetAngle = (this.entity * 137.5) % 360
          const offsetRadius = 0.5
          const offsetX = Math.cos((offsetAngle * Math.PI) / 180) * offsetRadius
          const offsetZ = Math.sin((offsetAngle * Math.PI) / 180) * offsetRadius

          const targetDistance = 3 + (this.entity % 3) * 0.5
          const moveDistance = Math.min(distance - targetDistance, 0.5)

          const newPosition = Vector3.add(
            this.position,
            Vector3.scale(normalizedDirection, moveDistance)
          )

          newPosition.x += offsetX
          newPosition.z += offsetZ

          Transform.getMutable(this.entity).position = newPosition
          this.position = newPosition
        }

        const direction = Vector3.subtract(
          executionerTransform.position,
          this.position
        )
        Transform.getMutable(this.entity).rotation =
          Quaternion.lookRotation(direction)

        // Play attack animation
        const idleAnim = Animator.getClip(this.entity, 'idle')
        const walkAnim = Animator.getClip(this.entity, 'walk')
        const attackAnim = Animator.getClip(this.entity, 'attack')

        if (idleAnim && idleAnim.playing) {
          idleAnim.playing = false
        }
        if (walkAnim && walkAnim.playing) {
          walkAnim.playing = false
        }
        if (attackAnim && !attackAnim.playing) {
          attackAnim.playing = true
        }

        this.isAttacking = true

        AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')

        // Deal damage to executioner
        this.dealDamageToExecutioner()

        // Return to idle after attack
        utils.timers.setTimeout(() => {
          if (attackAnim && attackAnim.playing) {
            attackAnim.playing = false
          }
          if (idleAnim && !idleAnim.playing) {
            idleAnim.playing = true
          }
          this.isAttacking = false
        }, 2000)
      }
    } catch (error) {
      console.log('Error attacking executioner:', error)
      this.targetExecutioner = null
    }
  }

  private dealDamageToExecutioner(): void {
    if (!this.targetExecutioner) return

    const player = Player.getInstanceOrNull()
    if (!player) return

    const currentRealm = player.gameController.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const executioners = (currentRealm as any).executioners || []

      for (const executioner of executioners) {
        if (executioner.entity === this.targetExecutioner) {
          console.log(
            `Mage dealing ${this.attackDamage} magic damage to executioner`
          )
          executioner.reduceHealth(this.attackDamage)

          if (executioner.health <= 0) {
            console.log('Mage killed executioner!')
            this.handleExecutionerKill(player)
          }
          break
        }
      }
    }
  }

  private handleExecutionerKill(player: Player): void {
    // Add assassin XP
    player.levels.addXp(LEVEL_TYPES.ENEMY, 1)

    // Add player XP
    player.levels.addXp(LEVEL_TYPES.PLAYER, 2)

    // 50% chance to drop coins
    if (Math.random() < 0.5) {
      const coinAmount = Math.floor(Math.random() * 5) + 1
      player.inventory.incrementItem(ITEM_TYPES.COIN, coinAmount)
    }
  }

  public remove(): void {
    console.log('Mage.remove() called for entity:', this.entity)
    entityController.removeEntity(this.entity)
    console.log('Mage entity removed successfully')
  }

  private checkForDamage(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    const currentTime = Date.now()
    if (currentTime - this.lastDamagedTime < this.damageCooldown) return

    const currentRealm = player.gameController.realmController.currentRealm
    if (currentRealm && currentRealm.getId() === 'antrom') {
      const executioners = (currentRealm as any).executioners || []

      for (const executioner of executioners) {
        if (!executioner || executioner.isDead) continue

        const executionerPos = Transform.get(executioner.entity).position
        const distance = Vector3.distance(this.position, executionerPos)

        if (distance <= 2) {
          this.takeDamage(executioner.attack || 10)
          this.lastDamagedTime = currentTime
          break
        }
      }
    }
  }

  private takeDamage(damage: number): void {
    if (this.isDead) return

    const player = Player.getInstanceOrNull()
    let finalDamage = damage
    if (player) {
      const defensePercent = player.getDefensePercent()
      finalDamage = Math.max(1, Math.round(damage * (1 - defensePercent)))
    }

    this.health -= finalDamage
    console.log(
      `Mage took ${finalDamage} damage. Health: ${this.health}/${this.maxHealth}`
    )

    if (this.health <= 0) {
      this.die()
      return
    }

    // Play impact animation
    const impactAnim = Animator.getClip(this.entity, 'impact')
    const idleAnim = Animator.getClip(this.entity, 'idle')
    const walkAnim = Animator.getClip(this.entity, 'walk')
    const attackAnim = Animator.getClip(this.entity, 'attack')

    if (idleAnim && idleAnim.playing) {
      idleAnim.playing = false
    }
    if (walkAnim && walkAnim.playing) {
      walkAnim.playing = false
    }
    if (attackAnim && attackAnim.playing) {
      attackAnim.playing = false
    }
    if (impactAnim && !impactAnim.playing) {
      impactAnim.playing = true
    }

    utils.timers.setTimeout(() => {
      if (impactAnim && impactAnim.playing) {
        impactAnim.playing = false
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
      }
    }, 1500)
  }

  private determineInitiative(): boolean {
    const player = Player.getInstanceOrNull()
    if (!player) return false

    const playerLuck = player.getLuckRange()
    const luckPercentage = playerLuck / 100

    // Mage gets 55% base chance + half of player's luck (slightly lower than fighters)
    const mageChance = 0.55 + luckPercentage / 2

    const randomRoll = Math.random()
    const hasInitiative = randomRoll < mageChance

    console.log(
      `Mage initiative roll: ${randomRoll.toFixed(3)} < ${mageChance.toFixed(
        3
      )} = ${hasInitiative}`
    )

    return hasInitiative
  }

  private die(): void {
    this.isDead = true
    this.targetExecutioner = null
    this.isWalking = false
    this.isAttacking = false

    // Play death animation
    const dieAnim = Animator.getClip(this.entity, 'die')
    const idleAnim = Animator.getClip(this.entity, 'idle')
    const walkAnim = Animator.getClip(this.entity, 'walk')
    const attackAnim = Animator.getClip(this.entity, 'attack')
    const impactAnim = Animator.getClip(this.entity, 'impact')

    if (idleAnim && idleAnim.playing) {
      idleAnim.playing = false
    }
    if (walkAnim && walkAnim.playing) {
      walkAnim.playing = false
    }
    if (attackAnim && attackAnim.playing) {
      attackAnim.playing = false
    }
    if (impactAnim && impactAnim.playing) {
      impactAnim.playing = false
    }
    if (dieAnim && !dieAnim.playing) {
      dieAnim.playing = true
    }

    // Remove entity after death animation
    utils.timers.setTimeout(() => {
      console.log('Removing mage entity:', this.entity)
      this.remove()
    }, 3000)
  }

  private updateAnimations(): void {
    if (this.isDead) return

    const idleAnim = Animator.getClip(this.entity, 'idle')
    const walkAnim = Animator.getClip(this.entity, 'walk')
    const attackAnim = Animator.getClip(this.entity, 'attack')

    if (!this.isWalking && !this.isAttacking) {
      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
      }
      if (attackAnim && attackAnim.playing) {
        attackAnim.playing = false
      }
      if (idleAnim && !idleAnim.playing) {
        idleAnim.playing = true
      }
    }

    if (this.isWalking) {
      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
      }
      if (attackAnim && attackAnim.playing) {
        attackAnim.playing = false
      }
      if (walkAnim && !walkAnim.playing) {
        walkAnim.playing = true
      }
    }

    if (this.isAttacking) {
      if (idleAnim && idleAnim.playing) {
        idleAnim.playing = false
      }
      if (walkAnim && walkAnim.playing) {
        walkAnim.playing = false
      }
      if (attackAnim && !attackAnim.playing) {
        attackAnim.playing = true
      }
    }
  }
}
