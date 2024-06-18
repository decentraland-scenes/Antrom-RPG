import {
  Entity,
  AudioSource,
  Animator,
  GltfContainer,
  Transform,
  MeshRenderer,
  engine,
  VisibilityComponent,
  pointerEventsSystem,
  InputAction
} from '@dcl/sdk/ecs'
import { Character } from './character'
import { Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { MonsterAttackRanged } from './monsterAttackRanged'

export class MonsterMeat extends Character {
  static globalHasSkill: boolean = true
  monsterShape?: string
  chickenShape?: { src: '' }
  shapeFile?: string
  shape: string = ''
  audioFile?: string
  // sound?: AudioSource
  // dyingSound?: AudioSource
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
  // healthbar needs to be ui
  // healthBar: Entity
  // playerAttackUI: ui.CornerLabel
  label?: any
  topOffSet?: number
  initialPosition?: Vector3
  attackSystemRanged!: MonsterAttackRanged
  isPrey: boolean = false
  dropRate: number = -1
  static setGlobalHasSkill(value: boolean) {
    // Modify some static property or perform some global logic here.
    MonsterMeat.globalHasSkill = value
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
    super(attack, xp, level, health, baseDefense)
    this.isDead = false
    this.isDeadAnimation = false
    this.engageDistance = engageDistance
    this.loadTransformation()
    // monster sounds
    // this.dyingSound = enemyDyingAudioSource
    // this.addComponentOrReplace(this.dyingSound)
    //

    // this.attackSound = enemyAttackAudioSource
    // this.addComponentOrReplace(this.attackSound)
    //
    // let monDef = enemyDefAudioSource
    // this.addComponentOrReplace(monDef)
    //
    // let monHey = enemyHeyAudioSource
    // this.addComponentOrReplace(monHey)
    MonsterMeat.setGlobalHasSkill(true)
  }

  initMonster() {
    console.log('init')
    if (!this.shape && this.shapeFile) {
      this.shape = this.shapeFile
      GltfContainer.createOrReplace(this.entity, { src: this.shape })
    }
    if (this.audioFile) {
      // const clip = new AudioClip(this.audioFile)
      // this.sound = new AudioSource(clip)
      // this.addComponentOrReplace(this.sound)
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
          loop: true
        }
      ]
    })

    this.setupRangedAttackTriggerBox()
    //  this.setupEngageTriggerBox()
    //  this.setupAttackTriggerBox()

    // this.attackSystem = new MonsterAttack(this, Camera.instance, {
    //     moveSpeed: 2,
    //     engageDistance: this.engageDistance,
    // })

    this.attackSystemRanged = new MonsterAttackRanged(this, {
      moveSpeed: 2,
      engageDistance: this.engageDistance
    })

    this.setupAttackHandler()
  }

  create() {
    // function needs to be implemented per individual monster
    throw new Error('create is required to be implemented for this monster')
  }

  onDropXp() {
    // function needs to be implemented per individual monster
    throw new Error('onDropXp is required to be implemented for this monster')
  }

  loadTransformation() {
    // function needs to be implemented per individual monster
    throw new Error(
      'loadTransformation is required to be implemented for this monster'
    )
  }

  setupRangedAttackTriggerBox() {
    const entity = engine.addEntity()
    Transform.create(entity, { parent: this.entity })
    MeshRenderer.setBox(entity)
    VisibilityComponent.create(entity, { visible: false })
    utils.triggers.addTrigger(
      entity,
      utils.NO_LAYERS,
      utils.LAYER_1,
      [{ type: 'box', scale: Vector3.create(15, 2, 15) }],
      () => {
        console.log('trigger Ranged attack')
        if (this.isDeadAnimation) return
        const CameraPos = Transform.get(engine.CameraEntity).position
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

  setupEngageTriggerBox() {
    const entity = engine.addEntity()
    Transform.create(entity, { parent: this.entity })
    MeshRenderer.setBox(entity)
    VisibilityComponent.create(entity, { visible: false })
    utils.triggers.addTrigger(
      entity,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(8, 2, 8) }],
      () => {
        console.log('trigger Attack')
      },
      () => {
        console.log('im out')
      }
    )
  }

  setupAttackTriggerBox() {
    const entity = engine.addEntity()
    Transform.create(entity, { parent: this.entity })
    MeshRenderer.setBox(entity)
    VisibilityComponent.create(entity, { visible: false })
    utils.triggers.addTrigger(
      entity,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(4, 2, 4) }],
      () => {
        console.log('<<< Attack >>>')
      },
      () => {
        console.log('im out')
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

    // if (this.dyingSound) {
    //     this.dyingSound.playOnce()
    // }
    if (this.dieClip) {
      Animator.playSingleAnimation(this.entity, this.dieClip)
    }
    this.create() // ????
  }

  callDyingAnimation() {
    if (!this.isDeadAnimation) this.dyingAnimation()
  }

  killChar() {
    // TODO (first check if used )
    // lootEventManager.fireEvent(
    //     new LootDropEvent(
    //         this.getComponent(Transform).position,
    //         () => this.onDropLoot(),
    //         this.dropRate
    //     )
    // )
    // setTimeout(5 * 1000, () => {
    //     engine.removeEntity(this)
    //     this.isDead = true
    // })
  }

  isDeadOnce() {
    if (!this.isDead) this.killChar()
  }

  onDead() {
    this.onDropXp()
    this.callDyingAnimation()
    engine.removeSystem(this.attackSystemRanged.attackSystem)

    // UI TBD
    // if (this.healthBar) {
    //     engine.removeEntity(this.healthBar)
    // }
    // if (this.label) {
    //     engine.removeEntity(this.label)
    // }
    // setTimeout(1 * 1000, () => {
    //     this.isDeadOnce()
    // })
  }

  performAttack(damage: number, isCriticalAttack: boolean) {
    console.log('damaging monster: ' + damage)
    this.reduceHealth(damage)
    // this.updateHealthBar()

    if (isCriticalAttack) {
      // UI from ui.ts
      // showCriticalIcon()
    }

    Animator.playSingleAnimation(this.entity, this.impactClip)
    // Animator.playSingleAnimation(this.entity, this.walkClip)

    // Effect TBD
    // applyEnemyAttackedEffectToLocation(
    //     this.getComponent(Transform).position
    // )

    // player.attackAnimation?.()

    if (this.health <= 0) {
      this.onDead()
    }
  }

  handleAttack() {
    if (this.health <= 0) {
      this.onDead()
      return
    }
    this.performAttack(1, false)
    const random = Math.random() * 1000
  }

  setupAttackHandler() {
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

  attackPlayer(enemyAttack: number) {
    // PLAYER TBD
    // player.reduceHealth(enemyAttack)
    // this.playAttack()
    // player.impactAnimation?.()
    // applyEnemyAttackedEffectToLocation(Camera.instance.feetPosition)
    // //this.attackSound.playOnce()
    // setTimeout(1 * 1000, () => {
    //     checkHealth()
    // })
  }
}

export default MonsterMeat
