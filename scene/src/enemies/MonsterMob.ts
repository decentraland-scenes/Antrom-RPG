// import { Vector3 } from 'three'
// import { MonsterAttackRanged } from './monsterAttackRanged'

// // WORK IN PROGRESS

// const sceneMessageBus = new MessageBus()

// class MonsterMob extends Character {
//   static globalHasSkill: boolean = true
//   monsterShape: string = ''
//   chickenShape: string = ''
//   shapeFile?: string
//   shape?: string = ''
//   audioFile?: string
//   // sound?: AudioSource
//   // dyingSound?: AudioSource
//   idleClip: string = 'idle'
//   attackClip: string = 'attack'
//   walkClip: string = 'walk'
//   impactClip: string = 'impact'
//   dieClip: string = 'die'
//   engageDistance: number
//   fightBackAnnouncement?: string
//   isDeadAnimation: boolean
//   isDead: boolean
//   hoverText?: string
//   // attackSound?: AudioSource
//   // healthBar: Entity
//   // playerAttackUI: ui.CornerLabel
//   label?: any
//   topOffSet?: number
//   initialPosition?: Vector3
//   attackSystemRanged!: MonsterAttackRanged
//   isPrey: boolean = false
//   dropRate: number = -1
//   static setGlobalHasSkill(value: boolean) {
//     // Modify some static property or perform some global logic here.
//     MonsterMob.globalHasSkill = value
//   }

//   constructor(
//     attack: number,
//     xp: number,
//     level: number,
//     health: number = 1,
//     baseDefense = 0.01,
//     engageDistance: number = 5,
//     topOffset: number = 2.5
//   ) {
//     super(attack, xp, level, health, baseDefense)
//     this.animator = new Animator()
//     this.isDead = false
//     this.isDeadAnimation = false
//     this.engageDistance = engageDistance
//     this.loadTransformation()

//     // set-up animations for monsters
//     this.walkClip = new AnimationState('walk')
//     this.animator.addClip(this.walkClip)
//     this.impactClip = new AnimationState('impact', { looping: false })
//     this.animator.addClip(this.impactClip)
//     this.attackClip = new AnimationState('attack', {
//       looping: false,
//       layer: 2
//     })
//     this.attackClip.onChange((e) => {
//       // if(e.){}
//       // log("logging e", e)
//     })
//     this.animator.addClip(this.attackClip)
//     this.dieClip = new AnimationState('die', { looping: false })
//     this.animator.addClip(this.dieClip)

//     // monster sounds
//     // this.dyingSound = enemyDyingAudioSource
//     // this.addComponentOrReplace(this.dyingSound)
//     //

//     this.attackSound = enemyAttackAudioSource
//     // this.addComponentOrReplace(this.attackSound)
//     //
//     // let monDef = enemyDefAudioSource
//     // this.addComponentOrReplace(monDef)
//     //
//     // let monHey = enemyHeyAudioSource
//     // this.addComponentOrReplace(monHey)
//     MonsterMob.setGlobalHasSkill(true)
//   }

//   initMonster() {
//     if (!this.shape && this.shapeFile) {
//       this.shape = new GLTFShape(this.shapeFile)
//     }
//     if (this.audioFile) {
//       const clip = new AudioClip(this.audioFile)
//       this.sound = new AudioSource(clip)
//       this.addComponentOrReplace(this.sound)
//     }
//     this.addComponent(this.shape)
//     this.addComponent(this.animator)

//     // implement the rest of animations on individual monster class
//     this.idleClip = new AnimationState('idle', {
//       looping: true,
//       layer: 0
//     })
//     this.animator.addClip(this.idleClip)

//     // Default Animation
//     this.idleClip.play()

//     this.setupRangedAttackTriggerBox(new utils.TriggerSphereShape(800))
//     this.setupEngageTriggerBox(new utils.TriggerSphereShape(12))
//     this.setupAttackTriggerBox(new utils.TriggerSphereShape(4))

//     this.attackSystem = new MonsterAttack(this, Camera.instance, {
//       moveSpeed: 2.5,
//       engageDistance: this.engageDistance
//     })

//     this.attackSystemRanged = new MonsterAttackRanged(this, Camera.instance, {
//       moveSpeed: 2,
//       engageDistance: this.engageDistance
//     })

//     this.setupAttackHandler()
//   }

//   createLabel() {
//     this.label = addLabel(`${this.health}`, this, true, Color3.White(), 1, {
//       position: new Vector3(0, this.topOffSet, -0.1)
//     })
//   }

//   createHealthBar() {
//     const hb = new Entity()
//     hb.addComponentOrReplace(
//       new Transform({
//         scale: new Vector3(1 * this.getHealthScaled(), 0.1, 0.1),
//         position: new Vector3(0, this.topOffSet, 0)
//       })
//     )
//     const myMaterial = new Material()
//     myMaterial.albedoColor = Color4.FromColor3(Color3.Red(), 0.5)
//     myMaterial.roughness = 1
//     myMaterial.specularIntensity = 0
//     myMaterial.metallic = 0
//     myMaterial.emissiveColor = Color3.Red()
//     myMaterial.emissiveIntensity = 0.8

//     hb.addComponentOrReplace(myMaterial)
//     hb.addComponentOrReplace(new BoxShape())

//     hb.setParent(this)
//     this.healthBar = hb
//   }

//   refillHealthBar(percentage = 1) {
//     this.health += this.maxHealth * percentage
//     if (this.health > this.maxHealth) {
//       this.health = this.maxHealth
//     }
//     this.updateHealthBar()
//   }

//   takeDamage(damage) {
//     this.health -= damage
//     if (this.health < 0) {
//       this.health = 0
//     }
//     this.updateHealthBar()
//   }

//   updateHealthBar() {
//     if (this.healthBar) {
//       this.healthBar.getComponent(Transform).scale.x =
//         1 * this.getHealthScaled()
//     }

//     if (this.label) {
//       this.label.getComponent(TextShape).value = `${this.health}`
//     }
//   }

//   onDropLoot() {
//     // function needs to be implemented per individual monster
//     throw new Error('onDrop is required to be implemented for this monster')
//   }

//   onDropXp() {
//     // function needs to be implemented per individual monster
//     throw new Error('onDropXp is required to be implemented for this monster')
//   }

//   setupEngageTriggerBox(triggerShape: TriggerBoxShape | TriggerSphereShape) {
//     const engageEntity = new Entity()
//     engageEntity.setParent(this)

//     engageEntity.addComponentOrReplace(
//       new utils.TriggerComponent(triggerShape, {
//         onCameraEnter: () => {
//           if (this.isDeadAnimation) return
//           engine.addSystem(this.attackSystem)
//         },
//         onCameraExit: () => {
//           if (this.isDeadAnimation) return
//           engine.removeSystem(this.attackSystem)

//           this.playIdle()
//         }
//       })
//     )
//   }

//   setupRangedAttackTriggerBox(
//     triggerShape: TriggerBoxShape | TriggerSphereShape
//   ) {
//     const engageEntity = new Entity()
//     engageEntity.setParent(this)

//     engageEntity.addComponentOrReplace(
//       new utils.TriggerComponent(triggerShape, {
//         onCameraEnter: () => {
//           if (this.isDeadAnimation) return
//           engine.addSystem(this.attackSystemRanged)
//         },
//         onCameraExit: () => {
//           if (this.isDeadAnimation) return
//           engine.removeSystem(this.attackSystemRanged)

//           this.playIdle()
//         }
//       })
//     )
//   }

//   stopRun() {
//     this.walkClip?.stop()
//     this.playIdle(false)
//   }

//   setupAttackTriggerBox(triggerShape: TriggerBoxShape | TriggerSphereShape) {
//     this.addComponentOrReplace(
//       new utils.TriggerComponent(triggerShape, {
//         onCameraEnter: () => {
//           if (this.isDeadAnimation) return
//           this.createHealthBar()
//           this.handleAttack()
//           this.createLabel()

//           this.addComponentOrReplace(new CurrentlyAttackingMonster())

//           // this.addComponentOrReplace(interval)
//         },
//         onCameraExit: () => {
//           if (this.healthBar) engine.removeEntity(this.healthBar)

//           if (this.label) engine.removeEntity(this.label)

//           this.removeComponent(CurrentlyAttackingMonster)
//         }
//       })
//     )
//   }

//   setDistance(distance: number) {
//     const pointerDownComponent = this.getComponent(OnPointerDown)
//     if (pointerDownComponent) {
//       pointerDownComponent.distance = distance
//     }
//   }

//   create() {
//     // function needs to be implemented per individual monster
//     throw new Error('create is required to be implemented for this monster')
//   }

//   loadTransformation() {
//     // function needs to be implemented per individual monster
//     throw new Error(
//       'loadTransformation is required to be implemented for this monster'
//     )
//   }

//   dyingAnimation() {
//     this.isDeadAnimation = true

//     if (this.dyingSound) {
//       this.dyingSound.playOnce()
//     }
//     if (this.dieClip) {
//       this.dieClip.play()
//     }
//     this.create()
//   }

//   callDyingAnimation() {
//     if (!this.isDeadAnimation) this.dyingAnimation()
//   }

//   killChar() {
//     lootEventManager.fireEvent(
//       new LootDropEvent(
//         this.getComponent(Transform).position,
//         () => {
//           this.onDropLoot()
//         },
//         this.dropRate
//       )
//     )

//     setTimeout(5 * 1000, () => {
//       engine.removeEntity(this)
//       this.isDead = true
//     })
//   }

//   isDeadOnce() {
//     if (!this.isDead) this.killChar()
//   }

//   onDead() {
//     this.onDropXp()

//     this.callDyingAnimation()
//     engine.removeSystem(this.attackSystem)
//     engine.removeSystem(this.attackSystemRanged)

//     if (this.healthBar) {
//       engine.removeEntity(this.healthBar)
//     }
//     if (this.label) {
//       engine.removeEntity(this.label)
//     }

//     this.removeComponent(OnPointerDown)
//     this.removeComponent(CurrentlyAttackingMonster)

//     setTimeout(1 * 1000, () => {
//       this.isDeadOnce()
//     })
//   }

//   performAttack(damage: number, isCriticalAttack: boolean) {
//     log('damaging monster: ' + damage)
//     this.reduceHealth(damage)
//     this.updateHealthBar()

//     if (isCriticalAttack) {
//       // ui.displayAnnouncement(`Critical Attack!`)
//       showCriticalIcon()
//     }

//     if (this.attackClip?.playing) {
//       this.attackClip.stop()
//     }
//     if (this.impactClip) {
//       this.impactClip.play()
//     }

//     applyEnemyAttackedEffectToLocation(this.getComponent(Transform).position)

//     player.attackAnimation?.()

//     if (this.health <= 0) {
//       this.onDead()
//     }
//   }

//   handleAttack() {
//     if (this.health <= 0) {
//       this.onDead()
//       return
//     }

//     if (refreshtimer > 0) {
//       return
//     }
//     setRefreshTimer(1)

//     // Monster attacks

//     const defPercent = player.getDefensePercent()
//     let enemyAttack = this.attack * (1 - defPercent)

//     if (monsterModifiers.getAtkBuff() != 0) {
//       log('monster before modified: ' + enemyAttack)
//       enemyAttack = enemyAttack * monsterModifiers.getAtkBuff()
//       log(
//         'monster after modified: ' +
//           monsterModifiers.getAtkBuff() +
//           ' ' +
//           enemyAttack
//       )
//     }

//     const roundedAttack = Math.floor(enemyAttack)
//     this.attackPlayer(enemyAttack)

//     // MainHUD.getInstance().updateStats(
//     //     `NONE`,
//     //     `NONE`,
//     //     `MISSED`,
//     //     `${roundedAttack}`
//     // )

//     monsterModifiers.activeSkills.forEach((skill) =>
//       skill(false, false, enemyAttack, this)
//     )
//   }

//   setupAttackHandler() {
//     this.addComponent(
//       new OnPointerDown(
//         (e) => {
//           // this.handleAttack()
//           if (this.health <= 0) {
//             this.onDead()
//             return
//           }

//           if (refreshtimer > 0) {
//             return
//           }
//           setRefreshTimer(0.3)

//           sceneMessageBus.emit('sayHi', () => {
//             ui.displayAnnouncement('hi')
//           })

//           const monsterDiceResult = this.rollDice()
//           const playerDiceResult = player.rollDice()

//           const roundedPlayerDice = Math.floor(playerDiceResult)
//           const roundedMonsterDice = Math.floor(monsterDiceResult)

//           if (monsterDiceResult <= playerDiceResult) {
//             // Player attacks
//             let defPercent = this.getDefensePercent()

//             if (monsterModifiers.getDefBuff() != 0) {
//               defPercent = defPercent * monsterModifiers.getDefBuff()
//               log('def %', defPercent)
//             }

//             const isCriticalAttack = getRandomInt(100) <= player.critRateBuff

//             const reduceHealthBy = player.getPlayerAttack(isCriticalAttack)
//             const playerAttack = Math.round(reduceHealthBy)
//             this.performAttack(playerAttack, isCriticalAttack)

//             MainHUD.getInstance().updateStats(
//               `${roundedPlayerDice}`,
//               `${roundedMonsterDice}`,
//               `${playerAttack}`,
//               `MISSED`
//             )

//             monsterModifiers.activeSkills.forEach((skill) =>
//               skill(isCriticalAttack, true, reduceHealthBy)
//             )
//           } else {
//             // ui.displayAnnouncement("missed attack")
//             createMissedLabel()
//           }
//         },
//         {
//           hoverText: this.hoverText || 'Attack Enemy!',
//           distance: 6.5
//         }
//       )
//     )
//   }

//   // Play running animation
//   run() {
//     this.getComponent(Animator).getClip('idle').stop()
//     this.getComponent(Animator).getClip('attack').stop()
//     this.getComponent(Animator).getClip('walk').play()
//   }

//   // Play idle animation
//   playIdle(reset?: boolean) {
//     this.getComponent(Animator).getClip('attack').stop()
//     this.getComponent(Animator).getClip('idle').play(reset)
//     // this.getComponent(Animator).getClip("run").stop()
//   }

//   playAttack() {
//     this.getComponent(Animator).getClip('idle').stop()
//     this.getComponent(Animator).getClip('run').stop()
//     this.getComponent(Animator).getClip('attack').play()
//   }

//   attackPlayer(enemyAttack: number) {
//     player.reduceHealth(enemyAttack)

//     this.playAttack()

//     // player.impactAnimation?.()
//     applyEnemyAttackedEffectToLocation(Camera.instance.feetPosition)

//     // this.attackSound.playOnce()

//     setTimeout(1 * 1000, () => {
//       checkHealth()
//     })
//   }
// }

// export default MonsterMob
