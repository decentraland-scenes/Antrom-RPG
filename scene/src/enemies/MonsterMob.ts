import * as utils from '@dcl-sdk/utils'
import {
  Animator,
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
import { Player } from '../player/player'
import { getRandomInt } from '../utils/getRandomInt'
import { refreshtimer, setRefreshTimer } from '../utils/refresherTimer'
import { MonsterAttack } from './monsterAttack'
import { MonsterAttackRanged } from './monsterAttackRanged'
import { GenericMonster } from './monsterGeneric'
import { monsterModifiers } from './skillEffects'

export class MonsterMob extends GenericMonster {
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

  static setGlobalHasSkill(value: boolean): void {
    // Modify some static property or perform some global logic here.
    MonsterMob.globalHasSkill = value
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

    MonsterMob.setGlobalHasSkill(true)
  }

  initMonster(): void {
    console.log('init')

    if (this.shape.length === 0 && this.shapeFile != null) {
      this.shape = this.shapeFile
      console.log(this.shape)
      GltfContainer.createOrReplace(this.entity, { src: this.shape })
    }

    GltfContainer.createOrReplace(this.entity, { src: this.shape })
    Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: this.idleClip,
          playing: true,
          loop: true
        },
        {
          clip: this.attackClip,
          playing: false,
          loop: true
        },
        {
          clip: this.walkClip,
          playing: false,
          loop: true
        },
        {
          clip: this.impactClip,
          playing: false,
          loop: false
        },
        {
          clip: this.dieClip,
          playing: false,
          loop: false
        }
      ]
    })

    this.setupRangedAttackTriggerBox()
    this.setupEngageTriggerBox()
    this.setupAttackTriggerBox()

    this.attackSystem = new MonsterAttack(this, {
      moveSpeed: 2,
      engageDistance: this.engageDistance
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
    this.rangeAttackTrigger = engine.addEntity()
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
        engine.addSystem(this.attackSystemRanged.attackSystem)
      },
      () => {
        console.log('im out')
        if (this.isDeadAnimation) return
        engine.removeSystem(this.attackSystemRanged.attackSystem)
        Animator.stopAllAnimations(this.entity)
        Animator.playSingleAnimation(this.entity, this.idleClip)
      }
    )
  }

  setupEngageTriggerBox(): void {
    this.engageAttackTrigger = engine.addEntity()
    Transform.create(this.engageAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.engageAttackTrigger)
    VisibilityComponent.create(this.engageAttackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.engageAttackTrigger,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(16, 2, 15) }],
      () => {
        engine.addSystem(this.attackSystem.attackSystem)
      },
      () => {
        console.log('im out')
        engine.removeSystem(this.attackSystem.attackSystem)
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
    if (this.dieClip != null) {
      Animator.playSingleAnimation(this.entity, this.dieClip)
    }
    this.create()
  }

  callDyingAnimation(): void {
    if (!this.isDeadAnimation) this.dyingAnimation()
  }

  killChar(): void {
    // TODO lootEvent

    // lootEventManager.fireEvent(
    //     new LootDropEvent(
    //         this.getComponent(Transform).position,
    //         () => this.onDropLoot(),
    //         this.dropRate
    //     )
    // )
    utils.timers.setTimeout(() => {
      // TODO entity removing triggers error
      engine.removeEntity(this.entity)
      engine.removeEntity(this.rangeAttackTrigger)
      engine.removeEntity(this.engageAttackTrigger)
      super.cleanup()
      console.log('entity removed')
      this.isDead = true
    }, 5 * 1000)
  }

  isDeadOnce(): void {
    if (!this.isDead) this.killChar()
  }

  onDead(): void {
    this.onDropXp()
    this.callDyingAnimation()
    engine.removeSystem(this.attackSystemRanged.attackSystem)

    super.cleanup()
    if (this.rangeAttackTrigger != null) {
      engine.removeEntity(this.rangeAttackTrigger)
      engine.removeEntity(this.engageAttackTrigger)
    }
    utils.timers.setTimeout(() => {
      this.isDeadOnce()
    }, 1000)
  }

  performAttack(damage: number, isCriticalAttack: boolean): void {
    console.log('damaging monster: ' + damage)
    this.reduceHealth(damage)
    this.updateHealthBar()

    if (isCriticalAttack) {
      // UI from ui.ts
      // showCriticalIcon()
    }

    Animator.playSingleAnimation(this.entity, this.impactClip)
    if (this.health <= 0) {
      this.onDead()
    }
  }

  handleAttack(): void {
    const player = Player.getInstanceOrNull()
    if (player === null) return

    if (this.health <= 0) {
      this.onDead()
      return
    }

    if (refreshtimer > 0) {
      return
    }
    setRefreshTimer(0)

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
    this.attackPlayer(roundedAttack)
    monsterModifiers.activeSkills.forEach((skill) =>
      skill(false, false, enemyAttack, this)
    )
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
        const player = Player.getInstanceOrNull()
        if (player === null) return

        if (this.health <= 0) {
          this.onDead()
          return
        }

        if (refreshtimer > 0) {
          return
        }
        setRefreshTimer(0)

        const monsterDiceResult = this.rollDice()
        const playerDiceResult = player.rollDice()

        const roundedPlayerDice = Math.floor(playerDiceResult)
        const roundedMonsterDice = Math.floor(monsterDiceResult)

        if (roundedMonsterDice <= roundedPlayerDice) {
          // Player attacks
          let defPercent = this.getDefensePercent()

          if (monsterModifiers.getDefBuff() !== 0) {
            defPercent = defPercent * monsterModifiers.getDefBuff()
            console.log('def %', defPercent)
          }

          const isCriticalAttack = getRandomInt(100) <= player.getCritRate()

          const reduceHealthBy = player.getPlayerAttack(isCriticalAttack)
          const playerAttack = Math.round(reduceHealthBy)
          this.performAttack(playerAttack, isCriticalAttack)

          // MainHUD.getInstance().updateStats(
          //     `${roundedPlayerDice}`,
          //     `${roundedMonsterDice}`,
          //     `${playerAttack}`,
          //     `MISSED`
          // )

          monsterModifiers.activeSkills.forEach((skill) =>
            skill(isCriticalAttack, true, reduceHealthBy)
          )
        }
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
    Animator.playSingleAnimation(this.entity, this.attackClip)
  }

  attackPlayer(enemyAttack: number): void {
    const player = Player.getInstanceOrNull()
    if (player === null) return

    player.reduceHealth(enemyAttack)

    this.playAttack()

    player.impactAnimation?.()
    // applyEnemyAttackedEffectToLocation(Camera.instance.feetPosition)
    // setTimeout(1 * 1000, () => {
    //     checkHealth()
    // })
    utils.timers.setTimeout(() => {
      // TODO from counters
      // checkHealth()
    }, 1000)
  }
}

export default MonsterMob
