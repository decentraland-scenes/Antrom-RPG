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
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Player } from '../player/player'
import { getRandomInt } from '../utils/getRandomInt'
import { refreshtimer, setRefreshTimer } from '../utils/refresherTimer'
import MonsterOligar from './monster'
import { type MonsterAttack } from './monsterAttack'
import { type MonsterAttackRanged } from './monsterAttackRanged'
import { GenericMonster } from './monsterGeneric'
import { monsterModifiers } from './skillEffects'

export class MonsterHealer extends GenericMonster {
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
    MonsterOligar.globalHasSkill = value
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
    MonsterOligar.setGlobalHasSkill(true)
  }

  initMonster(): void {
    console.log('init')
    if (this.shape.length === 0 && this.shapeFile !== undefined) {
      this.shape = this.shapeFile
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
          loop: false
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

    this.setupEngageTriggerBox()
    this.setupAttackTriggerBox()
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

  setupEngageTriggerBox(): void {
    this.engageAttackTrigger = engine.addEntity()
    Transform.create(this.engageAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.engageAttackTrigger)
    VisibilityComponent.create(this.engageAttackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.engageAttackTrigger,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(8, 2, 8) }],
      () => {
        engine.addSystem(this.attackSystem.attackSystem)
      },
      () => {
        console.log('im out')
        if (this.isDeadAnimation) return
        engine.removeSystem(this.attackSystem.attackSystem)

        if (this.initialPosition == null) {
          this.playIdle()
          return
        }
        this.run()
        const pos = Transform.getMutable(this.entity).rotation
        const newPos = Quaternion.fromLookAt(pos, this.initialPosition)
        Transform.getMutable(this.entity).rotation = newPos
        Animator.playSingleAnimation(this.entity, this.dieClip)
        // TODO createPath
      }
    )
  }

  stopRun(): void {
    Animator.playSingleAnimation(this.entity, this.idleClip)
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
    if (this.dieClip.length > 0) {
      Animator.playSingleAnimation(this.entity, this.dieClip)
    }
    this.create()
  }

  callDyingAnimation(): void {
    if (!this.isDeadAnimation) this.dyingAnimation()
  }

  killChar(): void {
    // TODO (first check if used )

    // lootEventManager.fireEvent(
    //     new LootDropEvent(
    //         this.getComponent(Transform).position,
    //         () => this.onDropLoot(),
    //         this.dropRate
    //     )
    // )
    utils.timers.setTimeout(() => {
      // TODO entity removing triggers error
      super.cleanup()

      engine.removeEntity(this.entity)
      engine.removeEntity(this.rangeAttackTrigger)
      engine.removeEntity(this.engageAttackTrigger)
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

    // const random = Math.random() * 1000
    if (refreshtimer > 0) {
      return
    }
    setRefreshTimer(1)

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
      const random = Math.random() * 1000
      const isCriticalAttack = getRandomInt(100) <= player.getCritRate()

      const reduceHealthBy = player.getPlayerAttack(isCriticalAttack) // remove monsters defence roll (bugged, monster has very high def) * (1 - defPercent)
      const playerAttack = Math.round(reduceHealthBy)

      this.performAttack(playerAttack, isCriticalAttack)

      // MainHUD.getInstance().updateStats(
      //     `${roundedPlayerDice}`,
      //     `${roundedMonsterDice}`,
      //     `${playerAttack}`,
      //     `MISSED`
      // )
      if (MonsterOligar.globalHasSkill) {
        switch (true) {
          case random < 200: {
            // 20% chance
            Player.setGlobalHasSkill(false)
            utils.timers.setTimeout(() => {
              Player.setGlobalHasSkill(true)
            }, 30 * 1000)
            break
          }
        }
      } else {
        // TODO  ui.displayAnnouncement("Enemy skills blocked")
        console.log('Monster has no skills')
      }

      monsterModifiers.activeSkills.forEach((skill) =>
        skill(isCriticalAttack, true, reduceHealthBy)
      )
    } else {
      // Monster attacks
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

      // MainHUD.getInstance().updateStats(
      //     `${roundedPlayerDice}`,
      //     `${roundedMonsterDice}`,
      //     `MISSED`,
      //     `${roundedAttack}`
      // )

      monsterModifiers.activeSkills.forEach((skill) =>
        skill(false, false, enemyAttack, this)
      )
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
    Animator.playSingleAnimation(this.entity, this.attackClip)
  }

  attackPlayer(enemyAttack: number): void {
    const player = Player.getInstanceOrNull()
    if (player === null) return

    player.reduceHealth(enemyAttack)

    this.playAttack()

    player.impactAnimation?.()
    // TODO effects
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

export default MonsterHealer
