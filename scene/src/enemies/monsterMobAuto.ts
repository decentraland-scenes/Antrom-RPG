/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as utils from '@dcl-sdk/utils'
import {
  Animator,
  AudioSource,
  GltfContainer,
  InputAction,
  MeshRenderer,
  Transform,
  VisibilityComponent,
  engine,
  pointerEventsSystem,
  type Entity
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { applyDefSkillEffectToEnemyLocation } from '../effects/enemyDeffSkillActivation'
import { Player } from '../player/player'
import { getRandomInt } from '../utils/getRandomInt'
import { refreshtimer, setRefreshTimer } from '../utils/refresherTimer'
import { MonsterAttack } from './monsterAttack'
import { MonsterAttackRanged } from './monsterAttackRanged'
import { GenericMonster } from './monsterGeneric'
import { monsterModifiers } from './skillEffects'
import { entityController } from '../realms/entityController'
import { triggerSceneEmote } from '~system/RestrictedActions'
import { ROAMING_CONFIGS, createPatrolRoute } from './monsterRoaming'

export class MonsterMobAuto extends GenericMonster {
  static globalHasSkill: boolean = true
  monsterShape?: string
  chickenShape?: { src: '' }
  shapeFile?: string
  shape: string = ''
  audioFile?: string
  idleClip: string = 'idle'
  attackClip: string = 'attack'
  walkClip: string = 'walk'
  impactClip: string = 'impact'
  dieClip: string = 'die'
  engageDistance: number
  fightBackAnnouncement?: string
  isDeadAnimation: boolean
  isDead: boolean
  // attackSound?: AudioSource
  // playerAttackUI: ui.CornerLabel
  rangeAttackTrigger!: Entity
  engageAttackTrigger!: Entity
  initialPosition?: Vector3
  attackSystemRanged!: MonsterAttackRanged
  attackSystem!: MonsterAttack
  isPrey: boolean = false
  dropRate: number = -1
  private isPlayingAttack: boolean = false
  static setGlobalHasSkill(value: boolean): void {
    // Modify some static property or perform some global logic here.
    MonsterMobAuto.globalHasSkill = value
  }

  constructor(
    attack: number,
    xp: number,
    level: number,
    health: number = 1,
    baseDefense = 0.01,
    engageDistance: number = 9,
    topOffset: number = 2.5
  ) {
    super(attack, xp, level, health, baseDefense, topOffset)
    this.isDead = false
    this.isDeadAnimation = false
    this.engageDistance = engageDistance
    MonsterMobAuto.setGlobalHasSkill(true)
  }

  initMonster(): void {
    console.log('init')
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

    // Use aggressive roaming configuration for auto monsters
    this.attackSystem = new MonsterAttack(this, {
      moveSpeed: 2,
      engageDistance: this.engageDistance,
      roaming: ROAMING_CONFIGS.aggressive
    })

    this.attackSystemRanged = new MonsterAttackRanged(this, {
      moveSpeed: 2,
      engageDistance: this.engageDistance
    })

    this.setupAttackHandler()
  }

  refillHealthBar(percentage = 1): void {
    this.health += this.maxHealth * percentage
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
    }
    this.updateHealthBar()
  }

  takeDamage(damage: number): void {
    this.health -= damage
    if (this.health < 0) {
      this.health = 0
    }
  }

  create(): void {
    // function needs to be implemented per individual monster
    throw new Error('create is required to be implemented for this monster')
  }

  onDropXp(): void {
    // function needs to be implemented per individual monster
    throw new Error('onDropXp is required to be implemented for this monster')
  }

  loadTransformation(): void {
    // function needs to be implemented per individual monster
    throw new Error(
      'loadTransformation is required to be implemented for this monster'
    )
  }

  setupRangedAttackTriggerBox(): void {
    this.rangeAttackTrigger = entityController.addEntity()
    Transform.create(this.rangeAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.rangeAttackTrigger)
    VisibilityComponent.create(this.rangeAttackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.rangeAttackTrigger,
      utils.NO_LAYERS,
      utils.LAYER_1,
      [{ type: 'box', scale: Vector3.create(15, 2, 15) }],
      () => {
        console.log('trigger Ranged attack')
        if (this.isDeadAnimation) return
        engine.addSystem(
          this.attackSystemRanged.attackSystem.bind(this.attackSystemRanged)
        )
      },
      () => {
        console.log('im out')
        if (this.isDeadAnimation) return
        engine.removeSystem(
          this.attackSystemRanged.attackSystem.bind(this.attackSystemRanged)
        )
        Animator.stopAllAnimations(this.entity)
        Animator.playSingleAnimation(this.entity, this.idleClip)
      }
    )
  }

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
        this.createHealthBar()
        // Start attack system immediately
        engine.addSystem(this.attackSystem.attackSystem.bind(this.attackSystem))
        // Start first attack
        this.handleAttack()
      },
      () => {
        if (this.isDeadAnimation) return
        this.cleanup()
        engine.removeSystem(
          this.attackSystem.attackSystem.bind(this.attackSystem)
        )
        Animator.stopAllAnimations(this.entity)
        Animator.playSingleAnimation(this.entity, this.idleClip)
      }
    )
  }

  setDistance(distance: number): void {
    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'Click',
          maxDistance: distance
        }
      },
      function () {
        console.log('clicked entity')
      }
    )
  }

  dyingAnimation(): void {
    this.isDeadAnimation = true
    if (this.dieClip) {
      Animator.playSingleAnimation(this.entity, this.dieClip)
    }
    this.create()
  }

  callDyingAnimation(): void {
    if (!this.isDeadAnimation) this.dyingAnimation()
  }

  killChar(): void {
    // Remove attack systems first
    engine.removeSystem(this.attackSystem.attackSystem.bind(this.attackSystem))
    engine.removeSystem(
      this.attackSystemRanged.attackSystem.bind(this.attackSystemRanged)
    )

    utils.timers.setTimeout(() => {
      entityController.removeEntity(this.entity)
      entityController.removeEntity(this.rangeAttackTrigger)
      entityController.removeEntity(this.engageAttackTrigger)
      super.cleanup()
      this.isDead = true
    }, 5 * 1000)
  }

  isDeadOnce(): void {
    if (!this.isDead) this.killChar()
  }

  onDead(): void {
    this.onDropXp()
    this.callDyingAnimation()

    // Remove attack systems first
    engine.removeSystem(this.attackSystem.attackSystem.bind(this.attackSystem))
    engine.removeSystem(
      this.attackSystemRanged.attackSystem.bind(this.attackSystemRanged)
    )

    super.cleanup()
    if (this.rangeAttackTrigger != null) {
      entityController.removeEntity(this.rangeAttackTrigger)
      entityController.removeEntity(this.engageAttackTrigger)
    }
    utils.timers.setTimeout(() => {
      this.isDeadOnce()
    }, 1000)
  }

  performAttack(damage: number, isCriticalAttack: boolean): void {
    console.log('damaging monster: ' + damage)
    this.reduceHealth(damage)
    this.updateHealthBar()

    const mainHUD = Player.getInstance().gameController.uiController.mainHud
    if (mainHUD !== null) {
      mainHUD.lastPlayerAttack = damage
      mainHUD.lastEnemyAttack = 'MISSED'
    }

    if (isCriticalAttack) {
      // UI from ui.ts
      // showCriticalIcon()
    }

    Animator.playSingleAnimation(this.entity, this.impactClip)
    if (this.health <= 0) {
      this.onDead()
      pointerEventsSystem.removeOnPointerDown(this.entity)
    }
  }

  handleAttack(): void {
    console.log('handleAttack called')
    const player = Player.getInstanceOrNull()
    if (player === null) return

    if (this.health <= 0) {
      this.onDead()
      pointerEventsSystem.removeOnPointerDown(this.entity)
      return
    }

    if (refreshtimer > 0) {
      return
    }
    setRefreshTimer(2)

    const monsterDiceResult = this.rollDice()
    const playerDiceResult = player.rollDice()
    const random = Math.random() * 1000
    const roundedPlayerDice = Math.floor(playerDiceResult)
    const roundedMonsterDice = Math.floor(monsterDiceResult)

    console.log(
      'Dice roll - Monster:',
      roundedMonsterDice,
      'Player:',
      roundedPlayerDice
    )

    const mainHUD = player?.gameController.uiController.mainHud
    if (mainHUD !== null) {
      mainHUD.lastPlayerRoll = roundedPlayerDice
      mainHUD.lastEnemyRoll = roundedMonsterDice
    }
    if (roundedMonsterDice <= roundedPlayerDice) {
      // Player attacks
      let defPercent = this.getDefensePercent()

      triggerSceneEmote({ src: 'assets/models/Axe_Combo.glb' })

      if (monsterModifiers.getDefBuff() !== 0) {
        defPercent = defPercent * monsterModifiers.getDefBuff()
        console.log('def %', defPercent)
      }

      const isCriticalAttack = getRandomInt(100) <= player.getCritRate()

      const reduceHealthBy = player.getPlayerAttack(isCriticalAttack)
      let playerAttack = Math.round(reduceHealthBy)
      switch (true) {
        case random < 1100: {
          applyDefSkillEffectToEnemyLocation(
            Transform.getMutable(this.entity).position,
            4000
          )
          playerAttack = playerAttack / 2
          break
        }
      }
      this.performAttack(playerAttack, isCriticalAttack)

      monsterModifiers.activeSkills.forEach((skill) => {
        skill(isCriticalAttack, true, reduceHealthBy, this)
      })
    } else {
      // Monster attacks
      console.log('Monster won dice roll, preparing attack')
      const defPercent = player.getDefensePercent()
      let enemyAttack = this.attack * (1 - defPercent)

      if (monsterModifiers.getAtkBuff() !== 0) {
        console.log('monster before modified: ' + enemyAttack)
        enemyAttack = enemyAttack * monsterModifiers.getAtkBuff()
        console.log(
          'monster after modified: ' +
            monsterModifiers.getAtkBuff() +
            ' ' +
            enemyAttack
        )
      }

      const roundedAttack = Math.floor(enemyAttack)
      console.log('Monster attacking with damage:', roundedAttack)

      // Play attack animation first
      this.playAttack()

      // Then apply damage
      const currentPlayer = Player.getInstanceOrNull()
      if (currentPlayer === null) return

      console.log(
        'About to call currentPlayer.reduceHealth with damage:',
        roundedAttack
      )
      currentPlayer.reduceHealth(roundedAttack)
      console.log('Finished calling currentPlayer.reduceHealth')
      const mainHUD = currentPlayer.gameController.uiController.mainHud
      if (mainHUD !== null) {
        mainHUD.lastEnemyAttack = roundedAttack
        mainHUD.lastPlayerAttack = 'MISSED'
      }

      currentPlayer.impactAnimation?.()
      AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')
      utils.timers.setTimeout(() => {
        // TODO from counters
        // checkHealth()
      }, 1000)

      monsterModifiers.activeSkills.forEach((skill) => {
        skill(false, false, enemyAttack, this)
      })
    }
  }

  setupAttackHandler(): void {
    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'Attack Enemy!',
          maxDistance: 7
        }
      },
      () => {
        this.handleAttack()
      }
    )
  }

  run(): void {
    Animator.playSingleAnimation(this.entity, this.walkClip)
  }

  playIdle(): void {
    Animator.playSingleAnimation(this.entity, this.idleClip)
  }

  playAttack(): void {
    if (this.isDeadAnimation) {
      console.log('Monster is in death animation, skipping attack animation')
      return
    }

    console.log('Playing attack animation')

    // Force stop all animations first
    Animator.stopAllAnimations(this.entity)

    // Get the current animator state
    const animator = Animator.getOrNull(this.entity)
    if (!animator) {
      console.log('No animator found on entity')
      return
    }

    // Log available states
    console.log(
      'Available animation states:',
      animator.states.map((state) => state.clip)
    )

    // Play the attack animation
    Animator.playSingleAnimation(this.entity, this.attackClip, false)

    // Return to idle after attack animation
    utils.timers.setTimeout(() => {
      if (!this.isDeadAnimation) {
        console.log('Returning to idle animation')
        Animator.playSingleAnimation(this.entity, this.idleClip, true)
      }
    }, 1000)
  }

  attackPlayer(enemyAttack: number): void {
    const player = Player.getInstanceOrNull()
    if (player === null) return

    console.log('Monster attacking player with damage:', enemyAttack)
    // Play attack animation first
    this.playAttack()

    // Then apply damage and effects
    console.log('About to call player.reduceHealth with damage:', enemyAttack)
    player.reduceHealth(enemyAttack)
    console.log('Finished calling player.reduceHealth')

    const mainHUD = player.gameController.uiController.mainHud
    if (mainHUD !== null) {
      mainHUD.lastEnemyAttack = enemyAttack
      mainHUD.lastPlayerAttack = 'MISSED'
    }

    player.impactAnimation?.()
    AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')
    utils.timers.setTimeout(() => {
      // TODO from counters
      // checkHealth()
    }, 1000)
  }
}

export default MonsterMobAuto
