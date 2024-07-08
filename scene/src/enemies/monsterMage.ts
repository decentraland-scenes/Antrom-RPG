import {
    Animator,
    GltfContainer,
    Transform,
    MeshRenderer,
    engine,
    VisibilityComponent,
    pointerEventsSystem,
    InputAction,
    TextShape,
    Material,
    type Entity
  } from '@dcl/sdk/ecs'
  import { Character } from './character'
  import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
  import * as utils from '@dcl-sdk/utils'
  import { type MonsterAttackRanged } from './monsterAttackRanged'
  import { Player, player } from '../player/player'
  import { monsterModifiers } from './skillEffects'
  import { getRandomInt } from '../utils/getRandomInt'
  import { refreshtimer, setRefreshTimer } from '../utils/refresherTimer'
  import { type MonsterAttack } from './monsterAttack'
import MonsterOligar from './monster'
  
  export class MonsterMage extends Character {
    static globalHasSkill: boolean = true
    monsterShape?: string
    chickenShape?: { src: '' }
    shapeFile?: string
    shape: string = ''
    audioFile?: string
    healthBar?: Entity
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
    attackTrigger!: Entity
    label?: Entity
    topOffSet?: number
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
      super(attack, xp, level, health, baseDefense)
      this.isDead = false
      this.isDeadAnimation = false
      this.engageDistance = engageDistance
      this.topOffSet = topOffset
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
  
    createHealthBar(): void {
      const hb = engine.addEntity()
      Transform.createOrReplace(hb, {
        scale: Vector3.create(1 * this.getHealthScaled(), 0.1, 0.1),
        position: Vector3.create(0, this.topOffSet, 0),
        parent: this.entity
      })
      MeshRenderer.setBox(hb)
      Material.setPbrMaterial(hb, {
        albedoColor: Color4.create(1, 0, 0, 0.5),
        metallic: 0,
        roughness: 1,
        specularIntensity: 0,
        emissiveIntensity: 0.4
      })
  
      this.healthBar = hb
    }
  
    createLabel(): void {
      this.label = engine.addEntity()
      TextShape.create(this.label, {
        text: `${this.health}`,
        textColor: Color4.White(),
        fontSize: 1
      })
      Transform.createOrReplace(this.label, {
        position: Vector3.create(0, this.topOffSet, -0.1),
        rotation: Quaternion.fromEulerDegrees(0, 180, 0),
        parent: this.entity
      })
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
  
    updateHealthBar(): void {
      if (this.healthBar !== undefined) {
        Transform.getMutable(this.healthBar).scale.x = 1 * this.getHealthScaled()
      }
  
      if (this.label !== undefined) {
        TextShape.getMutable(this.label).text = `${this.health}`
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
          engine.removeSystem(this.attackSystem.attackSystem)
          Animator.playSingleAnimation(this.entity, this.dieClip)
        }
      )
    }

    stopRun(): void {
        Animator.playSingleAnimation(this.entity,this.idleClip)
    }

    setupAttackTriggerBox(): void {
      this.attackTrigger = engine.addEntity()
      Transform.create(this.attackTrigger, { parent: this.entity })
      MeshRenderer.setBox(this.attackTrigger)
      VisibilityComponent.create(this.attackTrigger, { visible: false })
      utils.triggers.addTrigger(
        this.attackTrigger,
        1,
        1,
        [{ type: 'box', scale: Vector3.create(4, 2, 4) }],
        () => {
          console.log('<<< Attack >>>')
          if (this.isDeadAnimation) return
          this.createHealthBar()
          this.handleAttack()
          this.createLabel()

        },
        () => {
          console.log('im out')
            if (this.healthBar != null) engine.removeEntity(this.healthBar)

            if (this.label != null) engine.removeEntity(this.label)
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
        engine.removeEntity(this.entity)
        engine.removeEntity(this.rangeAttackTrigger)
        engine.removeEntity(this.engageAttackTrigger)
        engine.removeEntity(this.attackTrigger)
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
  
      if (this.healthBar !== undefined) {
        engine.removeEntity(this.healthBar)
      }
      if (this.label !== undefined) {
        engine.removeEntity(this.label)
      }
      if (this.rangeAttackTrigger != null) {
        engine.removeEntity(this.rangeAttackTrigger)
        engine.removeEntity(this.engageAttackTrigger)
        engine.removeEntity(this.attackTrigger)
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
        const isCriticalAttack = getRandomInt(100) <= player.critRateBuff
  
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
                      }, 30* 1000)
                    break
                }
            }
        } else {
            // TODO  ui.displayAnnouncement("Enemy skills blocked")
            console.log("Monster has no skills")
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
  
  export default MonsterMage

  